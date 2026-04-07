import colorsys

def hex_to_rgb(hex_color: str):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def get_contrast_ratio(hex1: str, hex2: str):
    # Standard WCAG contrast formula
    def get_luminance(hex_c):
        rgb = hex_to_rgb(hex_c)
        l = []
        for v in rgb:
            v /= 255
            l.append(v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4)
        return l[0] * 0.2126 + l[1] * 0.7152 + l[2] * 0.0722

    l1 = get_luminance(hex1)
    l2 = get_luminance(hex2)
    
    brightest = max(l1, l2)
    darkest = min(l1, l2)
    return (brightest + 0.05) / (darkest + 0.05)

def is_vibrant(hex_color: str):
    rgb = hex_to_rgb(hex_color)
    h, s, l = colorsys.rgb_to_hls(rgb[0]/255, rgb[1]/255, rgb[2]/255)
    return s > 0.2 and 0.2 < l < 0.8
