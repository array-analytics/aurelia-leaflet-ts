import { FrameworkConfiguration } from "aurelia-framework";
import { AULeafletCustomElement } from "./au-leaflet";

export * from "./au-leaflet";
export * from "./layer-factory";
export * from "./au-leaflet-exception";

export function configure(aurelia: FrameworkConfiguration) {
    //use it so tsc to AMD format won't complain.
    if (AULeafletCustomElement) { }

    aurelia.globalResources([
        "./au-leaflet"
    ]);
}
