# RadioGuessr

RadioGuessr is a small browser extension that streams a random radio from the country you're visiting in GeoGuessr.

## Installation

### Firefox

Download and open the latest `.xpi` file from the [Releases page](https://github.com/dzstara/radioguessr/releases/)

### Chrome and other Chromium based browsers

- Download and open the latest `radioguessr.zip` file from the [Releases page](https://github.com/dzstara/radioguessr/releases/)
- Unzip the file and you should have a folder named `radioguessr`.
- In your browser go to the extensions page (`chrome://extensions` or `edge://extensions`).
- Enable Developer Mode.
- Drag the `radioguessr` folder anywhere on the page to import it (do not delete the folder afterwards).

Note: every time you open Chrome it may warn you about running extensions in developer mode, just click ✕ to keep the extension enabled.

## Development

Requirements:

- Node 12+
- `windows-build-tools` (on Windows)
- `web-ext`

```bash
# Install dependencies
npm install

# Build in development mode and watch for changes
npm run watch

# Build in production mode
npm run build
```

### Project Information

We use TypeScript for our code and React for our interface.

- `src` : main RadioGuessr code
  - `background` : getting the radio streams and playing them as well as responding to events from other parts of the extension
  - `browser-action` : the interface shown when clicking the extension button, it is coded using React
  - `content-script` : code that is injected on GeoGuessr pages
  - `util` : code used in multiple parts
- `static` : base files and manifests
  - `media` : images and sound

### Building for Firefox

```
web-ext lint
web-ext build
web-ext sign --api-key=KEY --api-secret=SECRET
```

## Credits

Some dependencies are not pulled from NPM, as such here are their authors:

- Countries GeoJSON from [Simone Primarosa](https://github.com/simonepri)
  Source: https://github.com/simonepri/geo-maps

- Radio tuning sound from [David Bain](https://freesound.org/people/davidbain/)  
  Source: https://freesound.org/people/davidbain/sounds/259706/  
  File found in `/static/media/tuning.ogg`  
  Modified to be played in a loop
