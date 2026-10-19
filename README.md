# Ilya Kolotiy, photographer (Kyiv)

Portfolio site for photographer **Ilya Kolotiy** ([@kolotiy_ilya](https://www.instagram.com/kolotiy_ilya/), [Behance](https://www.behance.net/kolotiyphotography)).

- Photographs: © Ilya Kolotiy. All rights reserved. They are published here with his involvement and are not licensed for reuse.
- Site: built by RaftTone. Plain HTML, CSS and a little JavaScript, no build step.
- Live (GitHub Pages): https://rafttone.github.io/kolotiy-photo/

## Edit the site

Open `index.html`. Text in English is in the markup, Ukrainian strings are in `js/main.js` (`STRINGS.uk`). Style tokens are at the top of `css/style.css`.

## Add photos

Put the originals in `originals/` (git-ignored, so 5 MB files never reach the repository), then:

```sh
python3 tools/add_photos.py originals/IMG_0001.jpg originals/IMG_0002.jpg \
  --tag "Salat Party" --alt "DJ behind the decks under red light"
```

The script writes two WebP sizes into `photos/` (900 px grid, 2000 px lightbox) and prints `<figure>` markup. Paste it inside `<div class="grid">` in `index.html`. The tag appears on hover and in the lightbox.

Needs Python 3 and Pillow (`pip install pillow`).

## To do

- Custom domain: add a `CNAME` file and update the canonical and Open Graph URLs in `index.html`, `robots.txt`, `sitemap.xml`.
- Contact email and phone, once Ilya picks what to show.
- More photos, grouped into sections (events, brands, BTS), and a short About text in his own words.
- Check the captions against what Ilya remembers about each shoot.
