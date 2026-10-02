"""Concatenate src/ into the single-file page (index.html) and a local preview copy."""
import base64, glob, io, json, os, sys
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
read = lambda p: open(p, encoding="utf-8").read()
part = lambda pat: "\n".join(read(p) for p in sorted(glob.glob(os.path.join(here, "src", pat))))

FONTS = ("https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900"
         "&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap")
PUBLIC = "--public" in sys.argv      # standalone page for the live site (docs/)
STILLS = "--no-stills" not in sys.argv  # --no-stills: illustrated frames only
frames = {}
if STILLS:
    for p in sorted(glob.glob(os.path.join(here, "frames", "*.jpg"))):
        im = Image.open(p); w, h = im.size
        buf = io.BytesIO(); im.convert("RGB").resize((48, max(1, round(48 * h / w)))).save(buf, "JPEG", quality=70)
        b64 = lambda b: "data:image/jpeg;base64," + base64.b64encode(b).decode()
        # src = the frame itself; lo = a tiny copy used for the blurred fill behind it
        frames[os.path.splitext(os.path.basename(p))[0]] = {"src": b64(open(p, "rb").read()), "lo": b64(buf.getvalue()), "w": w, "h": h}
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
    # Standalone page for public hosting (GitHub Pages serves docs/), kept out of search results.
    if not STILLS:
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
