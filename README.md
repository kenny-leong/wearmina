# Mina's App

Concept prototype: a plugin for streaming services that tags what characters are wearing and links each piece to its store.

Live page: https://kenny-leong.github.io/wearmina/

## Build

```bash
python3 build.py            # private build: index.html + preview.html, embeds stills from frames/
python3 build.py --public   # public build: docs/index.html, illustrated frames only
```

`src/` holds the page in pieces (CSS, HTML, JS, concatenated in filename order). `docs/` is what GitHub Pages serves.

`frames/` (real stills) and the private builds are git-ignored on purpose.

## Notes

*Queen of Tears* and the brands named in the demo belong to their owners and appear only as an example. Demo retailers, timecodes, match scores and metrics are simulated.
