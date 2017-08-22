# aurelia-leaflet-plugin
An Aurelia plugin for LeafletJS. 

## Structure
- `src` this is where your `.ts` files go. They get compiled into the respective `dist` folders for each module type.
- `dist` automatically transpiled/generated modules go in here, don't edit anything here.
- `styles` the root styles directory is where your styles go. These are then put into the `dist` folder so your modules can include/reference any styles.

## Supported
- [x] Multiple module formats: commonjs, es2015, system and amd.
- [x] Write plugins in TypeScript
- [x] Definition files automatically generated using the TypeScript native compiler
- [x] Implement testing
- [x] Implement better linting
- [x] Better definition generation and singular index.js export strategy

## Disclaimers
This plugin is originally based on https://github.com/benib/aurelia-leaflet js code that uses JSPM and is written in javascript. The typescript aurelia plugin template (https://github.com/Vheissu/aurelia-typescript-plugin) was used as a basis for this repository.

## Aurelia CLI Support
This plugin skeleton exports an AMD module format which works with Aurelia CLI > v0.30.x.

```
"dependencies": [
  {
    "name": "aurelia-leaflet-plugin",
    "path": "../node_modules/aurelia-leaflet-plugin/dist/amd",
    "main": "index",
     "resources": [
        "**/*.html",
        "**/*.css"
      ]
  }
]
```
