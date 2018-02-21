import * as L from "leaflet";
import { Marker } from "leaflet";
import { Popup } from "leaflet";
import { TileLayer } from "leaflet";
import { Canvas } from "leaflet";
import { ImageOverlay } from "leaflet";
import { Polyline } from "leaflet";
import { Polygon } from "leaflet";
import { Rectangle } from "leaflet";
import { Circle } from "leaflet";
import { CircleMarker } from "leaflet";
import { LayerGroup } from "leaflet";
import { FeatureGroup } from "leaflet";
import { GeoJSON } from "leaflet";
import { Layer } from "leaflet";
export declare abstract class LeafletLayerFactoryPluginBase {
    readonly abstract type: string;
    abstract getLayer<TLayerType extends Layer>(options: any): TLayerType;
}
export declare class LayerFactory {
    private _logger;
    private _leafletLib;
    private _customPlugins;
    constructor(pCustomPlugins: Array<LeafletLayerFactoryPluginBase>);
    getLayer(pLayerConfig: any, pType: string, pInitCallback?: Function): L.Layer;
    getMarker(layer: any): Marker;
    getPopup(layer: any): Popup;
    getTile(layer: any): TileLayer;
    getWMS(layer: any): any;
    getCanvas(layer: any): Canvas;
    getImageOverlay(layer: any): ImageOverlay;
    getPolyline(layer: any): Polyline;
    getMultiPolyline(layer: any): any;
    getPolygone(layer: any): Polygon;
    getRectangle(layer: any): Rectangle;
    getCircle(layer: any): Circle;
    getCircleMarker(layer: any): CircleMarker;
    getLayerGroup(layer: any): LayerGroup;
    getFeatureGroup(layer: any): FeatureGroup;
    getGeoJson(layer: any): GeoJSON;
}
