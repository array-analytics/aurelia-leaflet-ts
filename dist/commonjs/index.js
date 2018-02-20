"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var au_leaflet_1 = require("./au-leaflet");
function configure(aurelia) {
    if (au_leaflet_1.AULeafletCustomElement) { }
    aurelia.globalResources([
        "./au-leaflet"
    ]);
}
exports.configure = configure;
//# sourceMappingURL=index.js.map