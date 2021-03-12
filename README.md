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
  - `browser_action` : the interface shown when clicking the extension button, it is coded using React (without JSX)
  - `content_script` : code that is injected on GeoGuessr pages
  - `util` : code used in multiple parts
- `lib` : external code
- `media` : images and sound

## Credits

- Geographic data from johan  
  Source: https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json  
  Repository: https://github.com/johan/world.geo.json

- Country codes data from lukes  
  Source: https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.json  
  Repository: https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes

- Reverse geocoding code from totemstech  
  Source: https://raw.githubusercontent.com/totemstech/country-reverse-geocoding/master/lib/country_reverse_geocoding.js  
  Repository: https://github.com/totemstech/country-reverse-geocoding/

- Radio tuning sound from davidbain  
  Source: https://freesound.org/people/davidbain/sounds/259706/
