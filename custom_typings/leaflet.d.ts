import * as L from "leaflet";

module "leaflet" {

    export type LayersObject = L.Control.LayersObject;

    export type LayersControl = L.Control.Layers;

    export type ScaleControl = L.Control.Scale;

    export let createLayersControl = L.control.layers;

    export let createScaleControl = L.control.scale;

}

export type LeafLayer = L.Layer & { id?: string, url?: string };


