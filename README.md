# RadioGuessr

RadioGuessr is a small browser extension that streams a random radio from the country you're visiting in GeoGuessr.

## Installation

### Firefox

- Download the latest `.xpi` file from the Releases page
- Open [about:addons](about:addons) and drop the file over the page

### Chrome and other Chromium based browsers

- Download this repo as a [ZIP file from GitHub](https://github.com/dzstara/radioguessr/archive/main.zip).
- Unzip the file and you should have a folder named `radioguessr-main`.
- In your browser go to the extensions page (`chrome://extensions` or `edge://extensions`).
- Enable Developer Mode.
- Drag the `radioguessr-main` folder anywhere on the page to import it (do not delete the folder afterwards).

Note: every time you open Chrome it may warn you about running extensions in developer mode, just click ✕ to keep the extension enabled.

## Building for Firefox

Requirements:

- Node 12+
- `windows-build-tools` (on Windows)
- `web-ext`

```
web-ext --config=webext-config.js lint
web-ext --config=webext-config.js build
web-ext --config=webext-config.js sign --api-key=KEY --api-secret=SECRET
```

## Project Structure

- `src` : main RadioGuessr code
  - `background` : getting the radio streams and playing them as well as responding to events from other parts of the extension
  - `browser-action` : the interface shown when clicking the extension button, it is coded using React (without JSX)
  - `content-script` : code that is injected on GeoGuessr pages
  - `util` : code used in multiple parts
- `static` : base files and manifests
  - `media` : images and sound

## Credits

Some dependencies are not pulled from NPM, as such here are their authors:

- Radio tuning sound from [David Bain](https://freesound.org/people/davidbain/)  
  Source: https://freesound.org/people/davidbain/sounds/259706/  
  File found in `/static/media/tuning.ogg`  
  Modified to be played in a loop
