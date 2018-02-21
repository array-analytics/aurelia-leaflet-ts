import { AULeafletCustomElement } from "./au-leaflet";
export * from "./au-leaflet";
export * from "./layer-factory";
export * from "./au-leaflet-exception";
export function configure(aurelia) {
    if (AULeafletCustomElement) { }
    aurelia.globalResources([
        "./au-leaflet"
    ]);
}
//# sourceMappingURL=index.js.map