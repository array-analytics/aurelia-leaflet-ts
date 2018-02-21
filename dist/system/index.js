System.register(["./au-leaflet", "./layer-factory", "./au-leaflet-exception"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia) {
        if (au_leaflet_1.AULeafletCustomElement) { }
        aurelia.globalResources([
            "./au-leaflet"
        ]);
    }
    exports_1("configure", configure);
    var au_leaflet_1;
    var exportedNames_1 = {
        "configure": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (au_leaflet_1_1) {
                au_leaflet_1 = au_leaflet_1_1;
                exportStar_1(au_leaflet_1_1);
            },
            function (layer_factory_1_1) {
                exportStar_1(layer_factory_1_1);
            },
            function (au_leaflet_exception_1_1) {
                exportStar_1(au_leaflet_exception_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=index.js.map