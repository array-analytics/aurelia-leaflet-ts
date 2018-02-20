define(["require", "exports", "./au-leaflet"], function (require, exports, au_leaflet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        if (au_leaflet_1.AULeafletCustomElement) { }
        aurelia.globalResources([
            "./au-leaflet"
        ]);
    }
    exports.configure = configure;
});
//# sourceMappingURL=index.js.map