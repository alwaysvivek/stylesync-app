import re
from typing import Dict, List, Any
from app.utils.color_utils import is_vibrant

class Extractor:
    def extract_tokens(self, scrape_data: Dict, image_palette: List[str]) -> Dict:
        styles = scrape_data.get("styles", {})
        
        # 1. Color Extraction
        colors = self._process_colors(styles, image_palette)
        
        # 2. Typography Extraction
        typography = self._process_typography(styles)
        
        # 3. Spacing Heuristics (Fallback to standard scale)
        spacing = {
            "base": 16,
            "scales": [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]
        }
        
        return {
            "colors": colors,
            "typography": typography,
            "spacing": spacing,
            "metadata_info": {"extracted_at": "now"}
        }

    def _process_colors(self, styles: Dict, palette: List[str]) -> Dict:
        # Prioritize button/heading colors as they are likely brand colors
        candidates = []
        if 'button' in styles:
            candidates.append(styles['button'].get('backgroundColor'))
            candidates.append(styles['button'].get('color'))
        if 'h1' in styles:
            candidates.append(styles['h1'].get('color'))
            
        # Add palette colors
        candidates.extend(palette)
        
        # Filter for vibrant/unique colors
        unique_colors = []
        for c in candidates:
            if c and c not in unique_colors:
                unique_colors.append(c)
                
        # Simple assignment logic
        return {
            "primary": unique_colors[0] if len(unique_colors) > 0 else "#6366f1",
            "secondary": unique_colors[1] if len(unique_colors) > 1 else "#1e293b",
            "accent": unique_colors[2] if len(unique_colors) > 2 else "#f59e0b",
            "background": styles.get('body', {}).get('backgroundColor', "#ffffff"),
            "text": styles.get('body', {}).get('color', "#09090b")
        }

    def _process_typography(self, styles: Dict) -> Dict:
        body = styles.get('body', {})
        h1 = styles.get('h1', {})
        
        return {
            "fontFamilies": {
                "heading": h1.get('fontFamily', "Inter, sans-serif"),
                "body": body.get('fontFamily', "Inter, sans-serif")
            },
            "sizes": {
                "h1": h1.get('fontSize', "2.5rem"),
                "p": body.get('fontSize', "1rem")
            },
            "weights": {
                "bold": h1.get('fontWeight', "700"),
                "normal": body.get('fontWeight', "400")
            },
            "lineHeights": {
                "tight": h1.get('lineHeight', "1.2"),
                "relaxed": body.get('lineHeight', "1.6")
            }
        }
