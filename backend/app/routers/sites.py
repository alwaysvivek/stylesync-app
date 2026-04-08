import uuid
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_async_session
from app.models.scraped_site import ScrapedSite
from app.models.design_token import DesignToken
from app.schemas.site import SiteCreate, SiteRead
from app.services.scraper import Scraper
from app.services.extractor import Extractor
from app.services.image_analyzer import ImageAnalyzer
from app.services.token_manager import TokenManager

router = APIRouter(prefix="/api/sites", tags=["Sites"])

async def run_extraction_task(site_id: uuid.UUID, url: str, session_factory):
    async with session_factory() as session:
        try:
            # 1. Scrape
            scraper = Scraper()
            data = await scraper.scrape(url)
            
            # 2. Analyze Images
            analyzer = ImageAnalyzer()
            palette = await analyzer.get_dominant_colors(data["images"])
            
            # 3. Extract Tokens
            extractor = Extractor()
            raw_tokens = extractor.extract_tokens(data, palette)
            
            # 4. Merge with Locks (if any)
            manager = TokenManager()
            final_tokens = await manager.merge_with_locks(session, site_id, raw_tokens)
            
            # 5. Save
            stmt = select(ScrapedSite).where(ScrapedSite.id == site_id)
            result = await session.execute(stmt)
            site = result.scalar_one()
            
            site.status = "completed"
            site.domain = url.split('//')[-1].split('/')[0]
            site.raw_html = data["html"]
            
            token_record = DesignToken(
                site_id=site_id,
                colors=final_tokens["colors"],
                typography=final_tokens["typography"],
                spacing=final_tokens["spacing"],
                metadata_info=final_tokens["metadata_info"]
            )
            session.add(token_record)
            await session.commit()
            
        except Exception as e:
            stmt = select(ScrapedSite).where(ScrapedSite.id == site_id)
            result = await session.execute(stmt)
            site = result.scalar_one()
            site.status = "failed"
            site.error_message = str(e)
            await session.commit()

@router.post("/", response_model=SiteRead)
async def create_site(site_data: SiteCreate, background_tasks: BackgroundTasks, session: AsyncSession = Depends(get_async_session)):
    site = ScrapedSite(url=site_data.url)
    session.add(site)
    await session.commit()
    await session.refresh(site)
    
    from app.database import async_session_maker
    background_tasks.add_task(run_extraction_task, site.id, site.url, async_session_maker)
    
    return site

@router.get("/{site_id}", response_model=SiteRead)
async def get_site(site_id: uuid.UUID, session: AsyncSession = Depends(get_async_session)):
    stmt = select(ScrapedSite).where(ScrapedSite.id == site_id)
    result = await session.execute(stmt)
    site = result.scalar_one_or_none()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site
