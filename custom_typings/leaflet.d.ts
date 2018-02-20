import * as L from "leaflet";

module "leaflet" {

    export type LayersObject = L.Control.LayersObject;

    export type LayersControl = L.Control.Layers;

    export type ScaleControl = L.Control.Scale;

    export type LayersOptions = L.Control.LayersOptions;

    export type ScaleOptions = L.Control.ScaleOptions;

    export type LayerId = { id?: string | number, _leaflet_id?: number };

    export type LayerConfig = L.GridLayerOptions & LayerId;

    export type TileLayerConfig = L.TileLayerOptions & LayerConfig & { url?: string };

    export type LayerWithIdInstance = L.Layer & LayerConfig

}

