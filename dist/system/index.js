System.register(["./au-leaflet"], function (exports_1, context_1) {
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
    return {
        setters: [
            function (au_leaflet_1_1) {
                au_leaflet_1 = au_leaflet_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=index.js.map