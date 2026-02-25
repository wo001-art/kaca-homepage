"""
KACA Homepage Builder
Notion CMS → Static HTML 변환기

사용법: python build.py
결과: output/ 디렉토리에 정적 HTML 생성
"""

import requests
import json
import os
import shutil
import hashlib
from datetime import datetime

NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
if not NOTION_TOKEN:
    raise ValueError("NOTION_TOKEN environment variable is required")
MAIN_PAGE_ID = "312765eb-4694-81c9-abe6-c9fca885b43e"
HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
}
OUTPUT_DIR = "output"
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")

def _generate_placeholder(filename):
    """SVG 플레이스홀더 생성"""
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
<rect fill="#1a1a2e" width="800" height="400"/>
<text fill="#c9a96e" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" x="400" y="190">KACA</text>
<text fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="16" text-anchor="middle" x="400" y="220">한국아트크래프트협회</text>
</svg>'''
    svgname = filename.rsplit(".", 1)[0] + ".svg"
    svgpath = os.path.join(IMAGES_DIR, svgname)
    os.makedirs(IMAGES_DIR, exist_ok=True)
    with open(svgpath, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"    Placeholder: {svgname}")
    return f"images/{svgname}"

_img_counter = 0
def download_image(url, block_id):
    """이미지를 다운로드하여 로컬에 저장, 로컬 경로 반환"""
    global _img_counter
    _img_counter += 1
    try:
        ext = ".jpg"
        url_base = url.split("?")[0]
        if ".png" in url_base:
            ext = ".png"
        elif ".webp" in url_base:
            ext = ".webp"
        elif ".gif" in url_base:
            ext = ".gif"
        filename = f"img_{_img_counter:03d}{ext}"
        filepath = os.path.join(IMAGES_DIR, filename)
        r = requests.get(url, timeout=30)
        if r.status_code == 200 and len(r.content) > 100:
            # Content-Type 기반 확장자 보정
            ct = r.headers.get("Content-Type", "")
            if "png" in ct:
                ext = ".png"
            elif "webp" in ct:
                ext = ".webp"
            elif "gif" in ct:
                ext = ".gif"
            filename = f"img_{_img_counter:03d}{ext}"
            filepath = os.path.join(IMAGES_DIR, filename)
            os.makedirs(IMAGES_DIR, exist_ok=True)
            with open(filepath, "wb") as f:
                f.write(r.content)
            print(f"    Downloaded: {filename} ({len(r.content):,} bytes)")
            return f"images/{filename}"
        else:
            print(f"    Image download failed: {r.status_code} - generating placeholder")
            return _generate_placeholder(filename)
    except Exception as e:
        print(f"    Image download error: {e}")
        return url

# 서브페이지 매핑
SUBPAGES = {
    "312765eb-4694-8179-aafc-d51444089655": {"title": "협회소개", "slug": "about", "nav": True},
    "312765eb-4694-81c4-9fd1-c4228c1aec03": {"title": "교육과정", "slug": "education", "nav": True},
    "312765eb-4694-81ca-adcd-e3f31b095a2c": {"title": "자격증 안내", "slug": "certification", "nav": True},
    "312765eb-4694-818b-8baf-c66b73f3ca88": {"title": "전시회 & 갤러리", "slug": "exhibitions", "nav": True},
    "312765eb-4694-81f9-8d46-c8ac0a8d8da2": {"title": "교육처 안내", "slug": "centers", "nav": True},
    "312765eb-4694-81fa-9c27-cb0b0ffcaaf9": {"title": "문의하기", "slug": "contact", "nav": True},
}

def get_blocks(page_id):
    """Notion 페이지의 모든 블록 가져오기"""
    blocks = []
    cursor = None
    while True:
        url = f"https://api.notion.com/v1/blocks/{page_id}/children?page_size=100"
        if cursor:
            url += f"&start_cursor={cursor}"
        r = requests.get(url, headers=HEADERS)
        if r.status_code != 200:
            print(f"  Error fetching blocks: {r.status_code}")
            break
        data = r.json()
        blocks.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
    return blocks

def get_children(block_id):
    """블록의 자식 블록 가져오기"""
    return get_blocks(block_id)

def rich_text_to_html(rich_texts):
    """Notion rich_text를 HTML로 변환"""
    html = ""
    for rt in rich_texts:
        content = rt.get("plain_text", "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        content = content.replace("\n", "<br>")
        ann = rt.get("annotations", {})
        link = rt.get("href")

        if ann.get("bold"):
            content = f"<strong>{content}</strong>"
        if ann.get("italic"):
            content = f"<em>{content}</em>"
        if ann.get("strikethrough"):
            content = f"<del>{content}</del>"
        if ann.get("code"):
            content = f"<code>{content}</code>"
        if ann.get("underline"):
            content = f"<u>{content}</u>"
        if link:
            content = f'<a href="{link}" target="_blank">{content}</a>'

        color = ann.get("color", "default")
        if color != "default":
            color_map = {
                "gray": "#9b9a97", "brown": "#64473a", "orange": "#d9730d",
                "yellow": "#dfab01", "green": "#0f7b6c", "blue": "#0b6e99",
                "purple": "#6940a5", "pink": "#ad1a72", "red": "#e03e3e",
            }
            if color in color_map:
                content = f'<span style="color:{color_map[color]}">{content}</span>'

        html += content
    return html

def block_to_html(block, depth=0):
    """단일 블록을 HTML로 변환"""
    btype = block.get("type", "")
    bdata = block.get(btype, {})

    if btype == "paragraph":
        text = rich_text_to_html(bdata.get("rich_text", []))
        if not text:
            return '<div class="spacer"></div>'
        return f'<p>{text}</p>'

    elif btype in ("heading_1", "heading_2", "heading_3"):
        level = btype[-1]
        text = rich_text_to_html(bdata.get("rich_text", []))
        return f'<h{level} class="notion-h{level}">{text}</h{level}>'

    elif btype == "bulleted_list_item":
        text = rich_text_to_html(bdata.get("rich_text", []))
        children_html = ""
        if block.get("has_children"):
            children = get_children(block["id"])
            children_html = '<ul class="nested">' + "".join(block_to_html(c, depth+1) for c in children) + "</ul>"
        return f'<li>{text}{children_html}</li>'

    elif btype == "numbered_list_item":
        text = rich_text_to_html(bdata.get("rich_text", []))
        return f'<li>{text}</li>'

    elif btype == "quote":
        text = rich_text_to_html(bdata.get("rich_text", []))
        return f'<blockquote class="notion-quote">{text}</blockquote>'

    elif btype == "callout":
        text = rich_text_to_html(bdata.get("rich_text", []))
        icon = bdata.get("icon", {}).get("emoji", "💡")
        children_html = ""
        if block.get("has_children"):
            children = get_children(block["id"])
            children_html = "".join(block_to_html(c, depth+1) for c in children)
        return f'<div class="callout"><span class="callout-icon">{icon}</span><div class="callout-text">{text}{children_html}</div></div>'

    elif btype == "divider":
        return '<hr class="notion-divider">'

    elif btype == "image":
        src = bdata.get("file", {}).get("url", "") or bdata.get("external", {}).get("url", "")
        # Notion 임시 URL은 다운로드하여 로컬 저장
        if src:
            src = download_image(src, block["id"])
        caption_html = rich_text_to_html(bdata.get("caption", []))
        # alt 속성에는 plain text만
        caption_plain = " ".join([r.get("plain_text", "") for r in bdata.get("caption", [])])
        cap_html = f'<figcaption>{caption_html}</figcaption>' if caption_html else ""
        return f'<figure class="notion-image"><img src="{src}" alt="{caption_plain}" loading="lazy">{cap_html}</figure>'

    elif btype == "toggle":
        text = rich_text_to_html(bdata.get("rich_text", []))
        children_html = ""
        if block.get("has_children"):
            children = get_children(block["id"])
            children_html = "".join(block_to_html(c, depth+1) for c in children)
        return f'<details class="notion-toggle"><summary>{text}</summary><div class="toggle-content">{children_html}</div></details>'

    elif btype == "table":
        rows = get_children(block["id"])
        has_header = bdata.get("has_column_header", False)
        html = '<div class="table-wrapper"><table class="notion-table">'
        for i, row in enumerate(rows):
            cells = row.get("table_row", {}).get("cells", [])
            tag = "th" if (i == 0 and has_header) else "td"
            row_class = ' class="table-header"' if (i == 0 and has_header) else ""
            html += f"<tr{row_class}>"
            for cell in cells:
                cell_text = rich_text_to_html(cell)
                html += f"<{tag}>{cell_text}</{tag}>"
            html += "</tr>"
        html += "</table></div>"
        return html

    elif btype == "column_list":
        children = get_children(block["id"])
        col_count = len(children)
        cols_html = ""
        for col in children:
            col_children = get_children(col["id"])
            col_content = "".join(block_to_html(c, depth+1) for c in col_children)
            cols_html += f'<div class="column">{col_content}</div>'
        # 컬럼 수에 따라 그리드 클래스 지정
        grid_class = f"columns cols-{col_count}" if col_count <= 4 else "columns"
        return f'<div class="{grid_class}">{cols_html}</div>'

    elif btype == "child_page":
        return ""  # 서브페이지는 별도 처리

    elif btype == "code":
        text = rich_text_to_html(bdata.get("rich_text", []))
        lang = bdata.get("language", "")
        return f'<pre class="notion-code"><code>{text}</code></pre>'

    elif btype == "bookmark":
        url = bdata.get("url", "")
        return f'<a href="{url}" class="bookmark" target="_blank">{url}</a>'

    elif btype == "embed":
        url = bdata.get("url", "")
        return f'<div class="embed"><iframe src="{url}" frameborder="0"></iframe></div>'

    return f'<!-- unsupported: {btype} -->'

def blocks_to_html(blocks):
    """블록 리스트를 HTML로 변환 (리스트 그룹핑 처리)"""
    html = ""
    i = 0
    while i < len(blocks):
        block = blocks[i]
        btype = block.get("type", "")

        if btype == "bulleted_list_item":
            html += '<ul class="notion-list">'
            while i < len(blocks) and blocks[i].get("type") == "bulleted_list_item":
                html += block_to_html(blocks[i])
                i += 1
            html += "</ul>"
            continue

        elif btype == "numbered_list_item":
            html += '<ol class="notion-list">'
            while i < len(blocks) and blocks[i].get("type") == "numbered_list_item":
                html += block_to_html(blocks[i])
                i += 1
            html += "</ol>"
            continue

        html += block_to_html(block)
        i += 1

    return html

def get_nav_html(current_slug=""):
    """네비게이션 HTML 생성"""
    nav = '<nav class="navbar"><div class="nav-container">'
    nav += '<a href="index.html" class="nav-logo">KACA</a>'
    nav += '<button class="nav-toggle" onclick="document.querySelector(\'.nav-menu\').classList.toggle(\'active\')">☰</button>'
    nav += '<ul class="nav-menu">'

    active = ' class="active"' if current_slug == "" else ""
    nav += f'<li><a href="index.html"{active}>홈</a></li>'

    for pid, info in SUBPAGES.items():
        if info.get("nav"):
            active = ' class="active"' if current_slug == info["slug"] else ""
            nav += f'<li><a href="{info["slug"]}.html"{active}>{info["title"]}</a></li>'

    nav += '</ul></div></nav>'
    return nav

def get_css():
    """메인 CSS"""
    return """
:root {
    --primary: #1a1a2e;
    --secondary: #16213e;
    --accent: #c9a96e;
    --accent-hover: #b8943f;
    --text: #333;
    --text-light: #666;
    --bg: #f8f6f2;
    --white: #fff;
    --border: #e5e5e5;
    --red: #e94560;
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
    font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    color: var(--text);
    background: var(--bg);
    line-height: 1.7;
}

/* === Navigation === */
.navbar {
    background: rgba(26,26,46,0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
}
.nav-logo {
    color: var(--accent);
    font-size: 1.5rem;
    font-weight: 800;
    text-decoration: none;
    letter-spacing: 2px;
    padding: 1rem 0;
}
.nav-menu {
    list-style: none;
    display: flex;
    gap: 0;
}
.nav-menu li a {
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    padding: 1.2rem 1.2rem;
    display: block;
    font-size: 0.95rem;
    transition: all 0.3s;
    border-bottom: 3px solid transparent;
}
.nav-menu li a:hover,
.nav-menu li a.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
    background: rgba(255,255,255,0.05);
}
.nav-toggle {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

/* === Hero === */
.hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, #0f3460 100%);
    color: white;
    text-align: center;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 6rem 2rem;
    position: relative;
    overflow: hidden;
}
.hero-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.2;
    pointer-events: none;
}
.hero-glow-1 {
    width: 400px; height: 400px;
    background: var(--red);
    top: 10%; left: 10%;
    animation: float1 12s ease-in-out infinite;
}
.hero-glow-2 {
    width: 350px; height: 350px;
    background: var(--accent);
    top: 30%; right: 10%;
    animation: float2 10s ease-in-out infinite;
}
.hero-glow-3 {
    width: 300px; height: 300px;
    background: #533483;
    bottom: 10%; left: 30%;
    animation: float3 14s ease-in-out infinite;
}
@keyframes float1 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(30px,-20px); }
}
@keyframes float2 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(-20px,30px); }
}
@keyframes float3 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(20px,20px); }
}
.hero h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.2rem;
    position: relative;
    letter-spacing: 4px;
}
.hero .subtitle {
    font-size: 1.3rem;
    opacity: 0.85;
    position: relative;
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.8;
}
.hero-buttons {
    display: flex;
    gap: 1.2rem;
    justify-content: center;
    position: relative;
}
.btn {
    padding: 1rem 2.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s;
    display: inline-block;
}
.btn-primary {
    background: var(--accent);
    color: white;
    box-shadow: 0 4px 15px rgba(201,169,110,0.3);
}
.btn-primary:hover { background: var(--accent-hover); transform: translateY(-3px); box-shadow: 0 6px 20px rgba(201,169,110,0.4); }
.btn-outline {
    border: 2px solid rgba(255,255,255,0.4);
    color: white;
}
.btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-3px); }

/* === Content === */
.content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 4rem 2rem 5rem;
}
.page-header {
    text-align: center;
    padding: 8rem 2rem 3rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, #0f3460 100%);
    color: white;
    position: relative;
    overflow: hidden;
}
.page-header::before {
    content: '';
    position: absolute;
    top: -50%; right: -20%;
    width: 400px; height: 400px;
    background: var(--accent);
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.1;
    pointer-events: none;
}
.page-header h1 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 0.5rem;
    font-weight: 800;
    letter-spacing: 2px;
    position: relative;
}
.page-header p {
    color: rgba(255,255,255,0.7);
    font-size: 1.1rem;
    position: relative;
}

/* === Notion Blocks === */
.notion-h1 {
    font-size: 2.2rem;
    color: var(--primary);
    margin: 3.5rem 0 1.5rem;
    padding-bottom: 0.8rem;
    border-bottom: 3px solid var(--accent);
    font-weight: 800;
}
.notion-h2 {
    font-size: 1.6rem;
    color: var(--primary);
    margin: 3rem 0 1rem;
    font-weight: 700;
}
.notion-h3 {
    font-size: 1.25rem;
    color: var(--secondary);
    margin: 2rem 0 0.8rem;
    font-weight: 600;
}
p { margin-bottom: 1rem; font-size: 1.05rem; line-height: 1.8; }
.spacer { height: 1rem; }

.notion-list {
    margin: 0.5rem 0 1rem 1.5rem;
}
.notion-list li {
    margin-bottom: 0.4rem;
}
.notion-list .nested {
    margin-top: 0.3rem;
}

.notion-quote {
    border-left: 4px solid var(--accent);
    padding: 1rem 1.5rem;
    margin: 1rem 0;
    background: rgba(201,169,110,0.08);
    font-style: italic;
    color: var(--text-light);
}

.callout {
    display: flex;
    gap: 1rem;
    padding: 1.5rem 2rem;
    margin: 1.5rem 0;
    border-radius: 8px;
    background: var(--white);
    border: 1px solid var(--border);
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    color: var(--text);
}
.callout-icon { font-size: 1.3rem; flex-shrink: 0; }
.callout-text { flex: 1; color: var(--text); }

.notion-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 2rem 0;
}

.notion-image {
    margin: 2rem 0;
    text-align: center;
}
.notion-image img {
    max-width: 100%;
    max-height: 500px;
    width: auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    transition: transform 0.3s;
}
.notion-image img:hover { transform: scale(1.02); }
.notion-image figcaption {
    margin-top: 0.5rem;
    color: var(--text-light);
    font-size: 0.9rem;
}
/* 컬럼 내 이미지는 꽉 채움 */
.column .notion-image img {
    width: 100%;
    height: 220px;
    object-fit: cover;
}

/* === Columns === */
.columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}
.cols-2 { grid-template-columns: repeat(2, 1fr); }
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(2, 1fr); }  /* 4는 2x2로 표시 */
.column {
    background: var(--white);
    border-radius: 8px;
    padding: 2rem;
    border: 1px solid var(--border);
    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
}
.column:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}
/* 다크 카드 (홀수번째 섹션용) */
.content > .columns:nth-of-type(even) .column {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    border: none;
}
.content > .columns:nth-of-type(even) .column h3,
.content > .columns:nth-of-type(even) .column .notion-h3 {
    color: var(--accent);
}
.content > .columns:nth-of-type(even) .column p {
    color: rgba(255,255,255,0.8);
}

/* === Table === */
.table-wrapper {
    overflow-x: auto;
    margin: 1rem 0;
}
.notion-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--white);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.notion-table th, .notion-table td {
    padding: 1rem 1.2rem;
    border: 1px solid var(--border);
    text-align: left;
    font-size: 0.95rem;
}
.notion-table th, .notion-table .table-header th {
    background: var(--primary);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.notion-table tr:hover td {
    background: rgba(201,169,110,0.05);
}

/* === Toggle === */
.notion-toggle {
    margin: 0.5rem 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
}
.notion-toggle summary {
    padding: 1rem 1.5rem;
    cursor: pointer;
    font-weight: 600;
    background: var(--white);
    transition: background 0.2s;
}
.notion-toggle summary:hover { background: #f0f0f0; }
.toggle-content {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
    background: #fafafa;
}

/* === Footer === */
.footer {
    background: var(--primary);
    color: rgba(255,255,255,0.7);
    padding: 3rem 2rem 1.5rem;
    margin-top: 3rem;
}
.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}
.footer h3 {
    color: var(--accent);
    margin-bottom: 1rem;
    font-size: 1.1rem;
}
.footer a {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: color 0.2s;
}
.footer a:hover { color: var(--accent); }
.footer-bottom {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 0.85rem;
}
.footer-bottom .tech {
    color: rgba(255,255,255,0.4);
    font-size: 0.8rem;
    margin-top: 0.3rem;
}

/* === Bookmark === */
.bookmark {
    display: block;
    padding: 1rem 1.5rem;
    margin: 1rem 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    text-decoration: none;
    color: var(--text);
    background: var(--white);
    transition: all 0.2s;
}
.bookmark:hover { border-color: var(--accent); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

/* === Stats === */
.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}
.stat-card {
    text-align: center;
    padding: 1.5rem;
    background: var(--white);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.stat-number { font-size: 2rem; font-weight: 800; color: var(--accent); }
.stat-label { font-size: 0.9rem; color: var(--text-light); margin-top: 0.3rem; }

/* === Responsive === */
@media (max-width: 768px) {
    .nav-toggle { display: block; }
    .nav-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(26,26,46,0.98);
        backdrop-filter: blur(12px);
        flex-direction: column;
        padding: 1rem;
    }
    .nav-menu.active { display: flex; }
    .nav-menu li a { padding: 0.8rem 1rem; }
    .hero h1 { font-size: 2.2rem; letter-spacing: 2px; }
    .hero { min-height: 70vh; padding: 5rem 1.5rem; }
    .hero-glow { display: none; }
    .columns, .cols-2, .cols-3, .cols-4 { grid-template-columns: 1fr; }
    .content { padding: 2rem 1rem 3rem; }
    .footer-content { grid-template-columns: 1fr; }
    .page-header { padding: 6rem 1.5rem 1.5rem; }
    .page-header h1 { font-size: 1.8rem; }
    .notion-h1 { font-size: 1.7rem; }
}
"""

def get_footer_html():
    """푸터 HTML"""
    return """
<footer class="footer">
    <div class="footer-content">
        <div>
            <h3>KACA</h3>
            <p>한국아트크래프트협회</p>
            <p style="margin-top:0.5rem;font-size:0.9rem">마블플루이드아트의 아름다움을 세상에 전합니다</p>
        </div>
        <div>
            <h3>바로가기</h3>
            <p><a href="about.html">협회소개</a></p>
            <p><a href="education.html">교육과정</a></p>
            <p><a href="exhibitions.html">전시회 &amp; 갤러리</a></p>
            <p><a href="contact.html">문의하기</a></p>
        </div>
        <div>
            <h3>연락처</h3>
            <p>Email: info@kaca-art.com</p>
            <p>Band: 한국아트크래프트협회</p>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 한국아트크래프트협회 (KACA). All rights reserved.</p>
        <p class="tech">Notion CMS + Static Site | Built by WOOKVAN</p>
    </div>
</footer>
"""

def build_page(title, content_html, slug="", is_home=False):
    """완전한 HTML 페이지 생성"""
    nav = get_nav_html(slug)
    footer = get_footer_html()

    hero = ""
    if is_home:
        hero = """
        <section class="hero">
            <div class="hero-glow hero-glow-1"></div>
            <div class="hero-glow hero-glow-2"></div>
            <div class="hero-glow hero-glow-3"></div>
            <h1>한국아트크래프트협회</h1>
            <p class="subtitle">Korea Art Craft Association &mdash; 마블플루이드아트 · 레진아트 · 크리스탈레진</p>
            <div class="hero-buttons">
                <a href="exhibitions.html" class="btn btn-primary">전시회 보기</a>
                <a href="education.html" class="btn btn-outline">교육 안내</a>
            </div>
        </section>
        """
    else:
        # 페이지별 서브타이틀
        subtitles = {
            "about": "KACA의 비전과 조직, 활동 내역을 확인하세요",
            "education": "마블플루이드아트 · 레진아트 · 크리스탈레진 전문 커리큘럼",
            "certification": "KACA 공인 자격증 종류 · 취득 절차 · 응시 안내",
            "exhibitions": "최신 전시 일정과 작가 작품을 만나보세요",
            "centers": "전국 공인 교육처 위치 및 수강 안내",
            "contact": "입회 · 교육 · 제휴 문의",
        }
        sub = subtitles.get(slug, "")
        sub_html = f'<p>{sub}</p>' if sub else ""
        hero = f"""
        <div class="page-header">
            <h1>{title}</h1>
            {sub_html}
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - 한국아트크래프트협회 (KACA)</title>
    <meta name="description" content="한국아트크래프트협회 - 마블플루이드아트, 레진아트, 크리스탈레진 전문 협회">
    <!-- System font stack -->
    <style>{get_css()}</style>
</head>
<body>
    {nav}
    {hero}
    <main class="content">
        {content_html}
    </main>
    {footer}
</body>
</html>"""

def build_site():
    """전체 사이트 빌드"""
    print(f"=== KACA Homepage Builder ===")
    print(f"Build started: {datetime.now().isoformat()}")

    # output 디렉토리 초기화
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)

    # 1. 메인 페이지 빌드
    print("\n[1/7] Building: index.html (홈)")
    blocks = get_blocks(MAIN_PAGE_ID)
    # child_page 블록 제외
    content_blocks = [b for b in blocks if b.get("type") != "child_page"]
    content_html = blocks_to_html(content_blocks)

    html = build_page("홈", content_html, slug="", is_home=True)
    with open(os.path.join(OUTPUT_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  → {len(content_blocks)} blocks converted")

    # 2. 서브페이지 빌드
    for i, (page_id, info) in enumerate(SUBPAGES.items(), 2):
        print(f"\n[{i}/7] Building: {info['slug']}.html ({info['title']})")
        blocks = get_blocks(page_id)
        content_html = blocks_to_html(blocks)

        html = build_page(info["title"], content_html, slug=info["slug"])
        with open(os.path.join(OUTPUT_DIR, f"{info['slug']}.html"), "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  → {len(blocks)} blocks converted")

    print(f"\n=== Build Complete ===")
    print(f"Output: {os.path.abspath(OUTPUT_DIR)}/")
    files = os.listdir(OUTPUT_DIR)
    for f in files:
        size = os.path.getsize(os.path.join(OUTPUT_DIR, f))
        print(f"  {f} ({size:,} bytes)")

if __name__ == "__main__":
    build_site()
