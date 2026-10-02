"""Concatenate src/ into the single-file page (index.html) and a local preview copy."""
import base64, glob, json, os, sys
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
read = lambda p: open(p, encoding="utf-8").read()
part = lambda pat: "\n".join(read(p) for p in sorted(glob.glob(os.path.join(here, "src", pat))))

FONTS = ("https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900"
         "&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap")
PUBLIC = "--public" in sys.argv  # public build: illustrated frames only, no stills embedded
frames = {}
if not PUBLIC:
    for p in sorted(glob.glob(os.path.join(here, "frames", "*.jpg"))):
        w, h = Image.open(p).size
        frames[os.path.splitext(os.path.basename(p))[0]] = {
            "src": "data:image/jpeg;base64," + base64.b64encode(open(p, "rb").read()).decode(), "w": w, "h": h}
frames_js = "const FRAMES=" + json.dumps(frames) + ";"
page = (
    "<title>Mina's App</title>\n"
    f'<link rel="stylesheet" href="{FONTS}">\n'
    f"<style>\n{part('*.css')}\n</style>\n"
    f"{part('*.html')}\n"
    f"<script>\n(()=>{{\n{frames_js}\n{part('*.js')}\n}})();\n</script>\n"
)
SHELL = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
         '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">{extra}'
         "<style>:root{{color-scheme:light}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>"
         "</head><body>\n{page}</body></html>\n")

if PUBLIC:
    # Standalone page for public hosting (GitHub Pages serves docs/). No stills, and kept out of search results.
    page = page.replace("Stills are shown for demonstration and belong to the show’s owners; the other frames are original illustrations.",
                        "Frames are original illustrations.")
    assert "data:image/jpeg" not in page
    extra = ('<meta name="robots" content="noindex">'
             '<meta name="description" content="Mina\'s App: tap what characters wear on any streaming show. Concept prototype.">')
    os.makedirs(os.path.join(here, "docs"), exist_ok=True)
    open(os.path.join(here, "docs", "index.html"), "w", encoding="utf-8").write(SHELL.format(extra=extra, page=page))
    open(os.path.join(here, "docs", ".nojekyll"), "w").write("")
    print("built docs/index.html", len(page), "bytes"); sys.exit()

open(os.path.join(here, "index.html"), "w", encoding="utf-8").write(page)
# Local preview: the same page inside the skeleton the artifact host adds at publish time.
open(os.path.join(here, "preview.html"), "w", encoding="utf-8").write(SHELL.format(extra="", page=page))
print("built", len(page), "bytes")
