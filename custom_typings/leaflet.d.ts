import * as L from "leaflet";

module "leaflet" {

    export type LayersObject = L.Control.LayersObject;

    export type LayersControl = L.Control.Layers;

    export type ScaleControl = L.Control.Scale;

    export type LeafLayer = L.Layer & { id?: string, url?: string };

}

