import cv2
import numpy as np
import os
from PIL import Image, ImageDraw

def process_croptab():
    print("Processing CropTab NPK...")
    im = cv2.imread('assets/croptab_npk.webp', cv2.IMREAD_UNCHANGED)
    b, g, r, a = cv2.split(im)
    rgb = cv2.merge([b, g, r])

    # 1. Inpaint flower on tablet face
    center_crop = rgb[450:850, 250:650].copy()
    poly_pts = np.array([
        [220, 0],
        [350, 110],
        [235, 250],
        [60, 150],
        [50, 50],
        [120, 0]
    ], np.int32)
    mask = np.zeros(center_crop.shape[:2], dtype=np.uint8)
    cv2.fillPoly(mask, [poly_pts], 255)
    smooth_crop = cv2.inpaint(center_crop, mask, 15, cv2.INPAINT_TELEA)

    # 2. Inpaint bottom-left Farm Minerals logo
    bl_mask = np.zeros(rgb.shape[:2], dtype=np.uint8)
    bl_mask[770:860, 25:200] = 255
    clean_rgb = cv2.inpaint(rgb, bl_mask, 7, cv2.INPAINT_TELEA)
    clean_rgb[450:850, 250:650] = smooth_crop

    # 3. Engrave Solum Emblem onto tablet face
    emblem = cv2.imread('solum_emblem_rendered.png', cv2.IMREAD_UNCHANGED)
    emb_alpha = emblem[:, :, 3].astype(float) / 255.0

    src_pts = np.float32([[0, 0], [512, 0], [512, 512], [0, 512]])
    dst_pts = np.float32([[205, 45], [295, 115], [205, 195], [115, 125]])
    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped_alpha = cv2.warpPerspective(emb_alpha, M, (400, 400), flags=cv2.INTER_LINEAR)
    warped_mask = cv2.GaussianBlur(warped_alpha, (3, 3), 0)

    # Engraving indentation with soft highlight
    tab_bgr = clean_rgb[450:850, 250:650].astype(float)
    indent_color = np.array([32, 42, 22], dtype=float)

    for c in range(3):
        tab_bgr[:, :, c] = tab_bgr[:, :, c] * (1.0 - warped_mask * 0.45) + indent_color[c] * (warped_mask * 0.45)

    clean_rgb[450:850, 250:650] = np.clip(tab_bgr, 0, 255).astype(np.uint8)

    # 4. Solum Logo on bottom left
    logo = cv2.imread('solum_logo_white_rendered.png', cv2.IMREAD_UNCHANGED)
    lw = 135
    lh = int(logo.shape[0] * (lw / logo.shape[1]))
    logo_resized = cv2.resize(logo, (lw, lh), interpolation=cv2.INTER_AREA)

    lx1, ly1 = 28, 815
    lx2, ly2 = lx1 + lw, ly1 + lh
    logo_alpha = (logo_resized[:, :, 3].astype(float) / 255.0)[:, :, None]
    logo_bgr = logo_resized[:, :, :3].astype(float)

    bg_roi = clean_rgb[ly1:ly2, lx1:lx2].astype(float)
    clean_rgb[ly1:ly2, lx1:lx2] = np.clip(bg_roi * (1.0 - logo_alpha * 0.95) + logo_bgr * (logo_alpha * 0.95), 0, 255).astype(np.uint8)

    result = cv2.merge([clean_rgb[:, :, 0], clean_rgb[:, :, 1], clean_rgb[:, :, 2], a])
    cv2.imwrite('assets/croptab_npk.png', result)
    pil_img = Image.fromarray(cv2.cvtColor(result, cv2.COLOR_BGRA2RGBA))
    pil_img.save('assets/croptab_npk.webp', 'WEBP', quality=95)
    print("CropTab NPK saved successfully!")

def process_nutripeak():
    print("Processing NutriPeak Micros...")
    im = cv2.imread('assets/nutripeak_npk.webp', cv2.IMREAD_UNCHANGED)
    b, g, r, a = cv2.split(im)
    rgb = cv2.merge([b, g, r])

    # 1. Inpaint flower on tablet face (x: 250..660, y: 430..850)
    center_crop = rgb[430:850, 250:660].copy()
    poly_pts = np.array([
        [240, 5],
        [365, 120],
        [265, 275],
        [75, 175],
        [65, 50],
        [150, 10]
    ], np.int32)
    mask = np.zeros(center_crop.shape[:2], dtype=np.uint8)
    cv2.fillPoly(mask, [poly_pts], 255)
    smooth_crop = cv2.inpaint(center_crop, mask, 15, cv2.INPAINT_TELEA)

    # 2. Inpaint bottom-left Farm Minerals logo
    bl_mask = np.zeros(rgb.shape[:2], dtype=np.uint8)
    bl_mask[750:850, 25:200] = 255
    clean_rgb = cv2.inpaint(rgb, bl_mask, 7, cv2.INPAINT_TELEA)
    clean_rgb[430:850, 250:660] = smooth_crop

    # 3. Engrave Solum Emblem onto tablet face
    emblem = cv2.imread('solum_emblem_rendered.png', cv2.IMREAD_UNCHANGED)
    emb_alpha = emblem[:, :, 3].astype(float) / 255.0

    src_pts = np.float32([[0, 0], [512, 0], [512, 512], [0, 512]])
    dst_pts = np.float32([[215, 55], [305, 125], [215, 205], [125, 135]])
    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped_alpha = cv2.warpPerspective(emb_alpha, M, (410, 420), flags=cv2.INTER_LINEAR)
    warped_mask = cv2.GaussianBlur(warped_alpha, (3, 3), 0)

    # Engraving indentation
    tab_bgr = clean_rgb[430:850, 250:660].astype(float)
    indent_color = np.array([85, 96, 75], dtype=float)

    for c in range(3):
        tab_bgr[:, :, c] = tab_bgr[:, :, c] * (1.0 - warped_mask * 0.40) + indent_color[c] * (warped_mask * 0.40)

    clean_rgb[430:850, 250:660] = np.clip(tab_bgr, 0, 255).astype(np.uint8)

    # 4. Solum Dark Logo on bottom left
    logo = cv2.imread('solum_logo_dark_rendered.png', cv2.IMREAD_UNCHANGED)
    lw = 135
    lh = int(logo.shape[0] * (lw / logo.shape[1]))
    logo_resized = cv2.resize(logo, (lw, lh), interpolation=cv2.INTER_AREA)

    lx1, ly1 = 28, 805
    lx2, ly2 = lx1 + lw, ly1 + lh
    logo_alpha = (logo_resized[:, :, 3].astype(float) / 255.0)[:, :, None]
    logo_bgr = logo_resized[:, :, :3].astype(float)

    bg_roi = clean_rgb[ly1:ly2, lx1:lx2].astype(float)
    clean_rgb[ly1:ly2, lx1:lx2] = np.clip(bg_roi * (1.0 - logo_alpha * 0.95) + logo_bgr * (logo_alpha * 0.95), 0, 255).astype(np.uint8)

    result = cv2.merge([clean_rgb[:, :, 0], clean_rgb[:, :, 1], clean_rgb[:, :, 2], a])
    cv2.imwrite('assets/nutripeak_npk.png', result)
    pil_img = Image.fromarray(cv2.cvtColor(result, cv2.COLOR_BGRA2RGBA))
    pil_img.save('assets/nutripeak_npk.webp', 'WEBP', quality=95)
    print("NutriPeak Micros saved successfully!")

def process_elevatefeed():
    print("Processing ElevateFeed...")
    im = cv2.imread('assets/elevatefeed.webp', cv2.IMREAD_UNCHANGED)
    b, g, r, a = cv2.split(im)
    rgb = cv2.merge([b, g, r])

    # 1. Clean top tag text "Farm Minerals" (y: 60..105, x: 153..187) and flower
    tag_mask = np.zeros(rgb.shape[:2], dtype=np.uint8)
    tag_mask[36:108, 153:187] = 255
    clean_rgb = cv2.inpaint(rgb, tag_mask, 5, cv2.INPAINT_TELEA)

    # 2. Add mini Solum emblem to tag
    emblem = cv2.imread('solum_emblem_rendered.png', cv2.IMREAD_UNCHANGED)
    ew, eh = 20, 20
    emblem_mini = cv2.resize(emblem, (ew, eh), interpolation=cv2.INTER_AREA)
    ea = (emblem_mini[:, :, 3].astype(float) / 255.0)[:, :, None]
    eb = emblem_mini[:, :, :3].astype(float)
    
    tx1, ty1 = 160, 42
    tx2, ty2 = tx1 + ew, ty1 + eh
    roi = clean_rgb[ty1:ty2, tx1:tx2].astype(float)
    clean_rgb[ty1:ty2, tx1:tx2] = np.clip(roi * (1.0 - ea) + eb * ea, 0, 255).astype(np.uint8)

    # Add crisp "SOLUM" text on tag
    pil_temp = Image.fromarray(cv2.cvtColor(clean_rgb, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_temp)
    draw.text((157, 68), "S O L U M", fill=(240, 240, 240))
    clean_rgb = cv2.cvtColor(np.array(pil_temp), cv2.COLOR_RGB2BGR)

    # 3. Clean tiny flower on bottom-left fold (y: 205..250, x: 23..38)
    fl_mask = np.zeros(rgb.shape[:2], dtype=np.uint8)
    fl_mask[205:250, 22:38] = 255
    clean_rgb = cv2.inpaint(clean_rgb, fl_mask, 5, cv2.INPAINT_TELEA)

    # 4. Surgical inpaint of front orange flower petals
    orange_mask = np.zeros(rgb.shape[:2], dtype=np.uint8)
    cond = (r > 100) & (b < 75) & (g < 110)
    orange_mask[150:340, 150:290] = cond[150:340, 150:290].astype(np.uint8) * 255
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    orange_mask = cv2.dilate(orange_mask, kernel, iterations=1)
    clean_rgb = cv2.inpaint(clean_rgb, orange_mask, 7, cv2.INPAINT_TELEA)

    # 5. Overlay Solum Emblem in warm copper/orange gradient on front right
    se_w, se_h = 75, 110
    se_resized = cv2.resize(emblem, (se_w, se_h), interpolation=cv2.INTER_AREA)
    se_alpha = (se_resized[:, :, 3].astype(float) / 255.0)[:, :, None]
    
    copper_color = np.array([25, 80, 215], dtype=float) # BGR orange/copper
    se_bgr = np.ones((se_h, se_w, 3), dtype=float) * copper_color
    
    sx1, sy1 = 185, 195
    sx2, sy2 = sx1 + se_w, sy1 + se_h
    body_roi = clean_rgb[sy1:sy2, sx1:sx2].astype(float)
    clean_rgb[sy1:sy2, sx1:sx2] = np.clip(body_roi * (1.0 - se_alpha * 0.90) + se_bgr * (se_alpha * 0.90), 0, 255).astype(np.uint8)

    result = cv2.merge([clean_rgb[:, :, 0], clean_rgb[:, :, 1], clean_rgb[:, :, 2], a])
    cv2.imwrite('assets/elevatefeed.png', result)
    pil_img = Image.fromarray(cv2.cvtColor(result, cv2.COLOR_BGRA2RGBA))
    pil_img.save('assets/elevatefeed.webp', 'WEBP', quality=95)
    print("ElevateFeed saved successfully!")

if __name__ == '__main__':
    process_croptab()
    process_nutripeak()
    process_elevatefeed()
    print("\nAll 3 Solum product PNGs & WebPs generated successfully!")
