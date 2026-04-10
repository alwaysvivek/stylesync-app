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
        candidates = []
        if 'button' in styles:
            candidates.append(styles['button'].get('backgroundColor'))
            candidates.append(styles['button'].get('color'))
        if 'h1' in styles:
            candidates.append(styles['h1'].get('color'))
        if 'link' in styles:
            candidates.append(styles['link'].get('color'))
            
        candidates.extend(palette)
        
        # Filter for valid, non-transparent, brand-like colors
        valid_colors = [c for c in candidates if self._is_valid_color(c)]
        
        # Deduplicate while preserving order
        unique_colors = []
        for c in valid_colors:
            if c not in unique_colors:
                unique_colors.append(c)
        
        return {
            "primary": unique_colors[0] if len(unique_colors) > 0 else "#6366f1",
            "secondary": unique_colors[1] if len(unique_colors) > 1 else "#1e293b",
            "accent": unique_colors[2] if len(unique_colors) > 2 else "#f59e0b",
            "background": styles.get('body', {}).get('backgroundColor', "#ffffff"),
            "text": styles.get('body', {}).get('color', "#09090b")
        }

    def _is_valid_color(self, color: Any) -> bool:
        if not color or not isinstance(color, str): return False
        c = color.lower().strip()
        if c in ['transparent', 'rgba(0, 0, 0, 0)', 'rgba(0,0,0,0)', 'none']: return False
        # Basic check to avoid ultra-light grayscale for primary
        if c in ['#fff', '#ffffff', 'rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)']: return False
        return True

    def _process_typography(self, styles: Dict) -> Dict:
        body = styles.get('body', {})
        h1 = styles.get('h1', {})
        
        def safe_font(font):
            if not font or font == 'none': return "Inter, sans-serif"
            return font

        return {
            "fontFamilies": {
                "heading": safe_font(h1.get('fontFamily')),
                "body": safe_font(body.get('fontFamily'))
            },
            "sizes": {
                "h1": h1.get('fontSize') if h1.get('fontSize') and 'px' in str(h1.get('fontSize')) or 'rem' in str(h1.get('fontSize')) else "2.5rem",
                "p": body.get('fontSize') if body.get('fontSize') and ('px' in str(body.get('fontSize')) or 'rem' in str(body.get('fontSize'))) else "1rem"
            },
            "weights": {
                "bold": h1.get('fontWeight', "700"),
                "normal": body.get('fontWeight', "400")
            },
            "lineHeights": {
                "tight": h1.get('lineHeight') if h1.get('lineHeight') and h1.get('lineHeight') != 'normal' else "1.2",
                "relaxed": body.get('lineHeight') if body.get('lineHeight') and body.get('lineHeight') != 'normal' else "1.6"
            }
        }
