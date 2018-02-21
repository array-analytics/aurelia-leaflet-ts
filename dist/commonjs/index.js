"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var au_leaflet_1 = require("./au-leaflet");
__export(require("./au-leaflet"));
__export(require("./layer-factory"));
__export(require("./au-leaflet-exception"));
function configure(aurelia) {
    if (au_leaflet_1.AULeafletCustomElement) { }
    aurelia.globalResources([
        "./au-leaflet"
    ]);
}
exports.configure = configure;
//# sourceMappingURL=index.js.map