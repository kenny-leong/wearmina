# Mina's App

Concept prototype: a plugin for streaming services that tags what characters are wearing and links each piece to its store.

Live page: https://kenny-leong.github.io/wearmina/

## Build

```bash
python3 build.py                        # index.html + preview.html, embeds stills from frames/
python3 build.py --public               # live site: docs/index.html, with the stills
python3 build.py --public --no-stills   # live site, illustrated frames only
```

`src/` holds the page in pieces (CSS, HTML, JS, concatenated in filename order). `docs/` is what GitHub Pages serves.

`frames/` (the source stills) is git-ignored; the live page carries its own embedded copies.

## Notes

*Queen of Tears* and the brands named in the demo belong to their owners and appear only as an example. Stills belong to the show's owners. Demo retailers, timecodes, match scores and metrics are simulated.
