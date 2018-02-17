import { FrameworkConfiguration } from "aurelia-framework";
import { AULeafletCustomElement } from "./au-leaflet";

export function configure(aurelia: FrameworkConfiguration) {
    //use it so tsc to AMD format won't complain.
    if (AULeafletCustomElement) { }

    aurelia.globalResources([
        "./au-leaflet"
    ]);
}
