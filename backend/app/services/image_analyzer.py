import httpx
from io import BytesIO
from typing import List
from colorthief import ColorThief
from app.utils.color_utils import rgb_to_hex

class ImageAnalyzer:
    async def get_dominant_colors(self, image_urls: List[str], count: int = 5) -> List[str]:
        palette = []
        async with httpx.AsyncClient(timeout=10.0) as client:
            for url in image_urls[:5]: # Cap at 5 images for performance
                try:
                    response = await client.get(url)
                    if response.status_code == 200:
                        ct = ColorThief(BytesIO(response.content))
                        # Get a small palette from each image
                        img_palette = ct.get_palette(color_count=3, quality=10)
                        for color in img_palette:
                            palette.append(rgb_to_hex(color))
                except Exception:
                    continue
        return list(set(palette)) # Unique colors
