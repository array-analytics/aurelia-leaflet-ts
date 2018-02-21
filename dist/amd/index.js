define(["require", "exports", "./au-leaflet", "./au-leaflet", "./layer-factory", "./au-leaflet-exception"], function (require, exports, au_leaflet_1, au_leaflet_2, layer_factory_1, au_leaflet_exception_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(au_leaflet_2);
    __export(layer_factory_1);
    __export(au_leaflet_exception_1);
    function configure(aurelia) {
        if (au_leaflet_1.AULeafletCustomElement) { }
        aurelia.globalResources([
            "./au-leaflet"
        ]);
    }
    exports.configure = configure;
});
//# sourceMappingURL=index.js.map