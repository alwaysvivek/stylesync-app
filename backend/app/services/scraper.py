from typing import Dict, List, Optional
from playwright.async_api import async_playwright

class Scraper:
    async def scrape(self, url: str) -> Dict:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_api_context().new_page()
            
            try:
                await page.goto(url, wait_until="networkidle", timeout=30000)
                
                # 1. Extract Styles
                styles = await page.evaluate("""() => {
                    const getStyles = (selector) => {
                        const el = document.querySelector(selector);
                        if (!el) return {};
                        const s = window.getComputedStyle(el);
                        return {
                            color: s.color,
                            backgroundColor: s.backgroundColor,
                            fontFamily: s.fontFamily,
                            fontSize: s.fontSize,
                            fontWeight: s.fontWeight,
                            lineHeight: s.lineHeight
                        };
                    };
                    
                    return {
                        body: getStyles('body'),
                        h1: getStyles('h1'),
                        h2: getStyles('h2'),
                        button: getStyles('button') || getStyles('[role="button"]') || getStyles('a.btn'),
                        link: getStyles('a')
                    };
                }""")
                
                # 2. Extract Images (for color analysis)
                images = await page.evaluate("""() => {
                    return Array.from(document.querySelectorAll('img'))
                        .map(img => img.src)
                        .filter(src => src.startsWith('http'))
                        .slice(0, 10);
                }""")
                
                # 3. HTML for backup
                html = await page.content()
                
                return {
                    "styles": styles,
                    "images": images,
                    "html": html,
                    "title": await page.title()
                }
            finally:
                await browser.close()
