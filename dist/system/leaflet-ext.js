System.register(["leaflet"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var L, createLayersControl, createScaleControl;
    return {
        setters: [
            function (L_1) {
                L = L_1;
            }
        ],
        execute: function () {
            exports_1("createLayersControl", createLayersControl = L.control.layers);
            exports_1("createScaleControl", createScaleControl = L.control.scale);
        }
    };
});
//# sourceMappingURL=leaflet-ext.js.map