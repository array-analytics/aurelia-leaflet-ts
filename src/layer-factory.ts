import { inject, All } from "aurelia-dependency-injection";
import { AureliaLeafletException } from "./au-leaflet-exception";
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

interface Constructor<T> {
    new(options?: any): T;
}

export abstract class LeafletLayerFactoryPluginBase {
    abstract get type(): string;
    abstract getLayer<TLayerType extends Layer>(options: any): TLayerType;
}

@inject(All.of(LeafletLayerFactoryPluginBase))
export class LayerFactory {
    private _leafletLib: any;
    private _customPlugins: Array<LeafletLayerFactoryPluginBase>;

    constructor(pCustomPlugins: Array<LeafletLayerFactoryPluginBase>) {
        this._leafletLib = L;
        this._customPlugins = pCustomPlugins;
    }

    public getLayer(layer) {
        if (!layer.hasOwnProperty("type")) {
            layer.type = "tile";
        }

        let instance: Layer;

        switch (layer.type) {
            case "marker":
                instance = this.getMarker(layer);
                break;
            case "popup":
                instance = this.getPopup(layer);
                break;
            case "tile":
                instance = this.getTile(layer);
                break;
            case "wms":
                instance = this.getWMS(layer);
                break;
            case "canvas":
                instance = this.getCanvas(layer);
                break;
            case "imageOverlay":
                instance = this.getImageOverlay(layer);
                break;
            case "polyline":
                instance = this.getPolyline(layer);
                break;
            case "multiPolyline":
                instance = this.getMultiPolyline(layer);
                break;
            case "polygone":
                instance = this.getPolygone(layer);
                break;
            /* case "multiPolygone":
                instance = this.getMultiPolygone(layer);
                break; */
            case "rectangle":
                instance = this.getRectangle(layer);
                break;
            case "circle":
                instance = this.getCircle(layer);
                break;
            case "circleMarker":
                instance = this.getCircleMarker(layer);
                break;
            case "group":
                instance = this.getLayerGroup(layer);
                break;
            case "featureGroup":
                instance = this.getFeatureGroup(layer);
                break;
            case "geoJSON":
                instance = this.getGeoJson(layer);
                break;
            default:
                let plugin = this._customPlugins.find(pPlugin => pPlugin.type === layer.type);
                return plugin.getLayer(layer.options);
                //throw new AureliaLeafletException(`Layer type ${layer.type} not implemented`);
        }

        if (typeof layer.initCallback === "function") {
            layer.initCallback(instance);
        }

        if (layer.hasOwnProperty("events")) {
            for (let e of layer.events) {
                if (typeof instance.on === "function") {
                    instance.on(e.name, e.callback);
                }
            }
        }

        return instance;
    }

    public getMarker(layer): Marker {
        if (!layer.hasOwnProperty("latLng")) {
            throw new AureliaLeafletException("No latLng given for layer.type \"marker\"");
        }
        let marker = this._leafletLib.marker(layer.latLng, layer.options);
        if (layer.hasOwnProperty("popupContent")) {
            marker.bindPopup(layer.popupContent).openPopup();
        }
        return marker;
    }

    public getPopup(layer): Popup {
        let popup = this._leafletLib.popup(layer.options);
        if (layer.hasOwnProperty("content")) {
            popup.setContent(layer.content);
        }
        if (layer.hasOwnProperty("latLng")) {
            popup.setLatLng(layer.latLng);
        }
        return popup;
    }

    public getTile(layer): TileLayer {
        if (!layer.hasOwnProperty("url")) {
            throw new AureliaLeafletException("No url given for layer.type \"tile\"");
        }
        return this._leafletLib.tileLayer(layer.url, layer.options);
    }

    public getWMS(layer) {
        if (!layer.hasOwnProperty("url")) {
            throw new AureliaLeafletException("No url given for layer.type \"wms\"");
        }
        return this._leafletLib.tileLayer.wms(layer.url, layer.options);
    }

    public getCanvas(layer): Canvas {
        let l = this._leafletLib.tileLayer.canvas(layer.options);
        if (layer.hasOwnProperty("drawTile")) {
            l.drawTile = layer.drawTile;
        }
        if (layer.hasOwnProperty("tileDrawn")) {
            l.tileDrawn = layer.tileDrawn;
        }
        return l;
    }

    public getImageOverlay(layer): ImageOverlay {
        if (!layer.hasOwnProperty("url")) {
            throw new AureliaLeafletException("No url given for layer.type \"imageOverlay\"");
        }
        if (!layer.hasOwnProperty("imageBounds")) {
            throw new AureliaLeafletException("No imageBounds given for layer.type \"imageOverlay\"");
        }
        return this._leafletLib.imageOverlay(layer.url, layer.imageBounds, layer.options);
    }

    public getPolyline(layer): Polyline {
        if (!layer.hasOwnProperty("latLngs")) {
            throw new AureliaLeafletException("No latLngs given for layer.type \"polyline\"");
        }
        return this._leafletLib.polyline(layer.latlngs, layer.options);
    }

    public getMultiPolyline(layer) {
        if (!layer.hasOwnProperty("latLngs")) {
            throw new AureliaLeafletException("No latLngs given for layer.type \"multiPolyline\"");
        }
        return this._leafletLib.multiPolyline(layer.latlngs, layer.options);
    }

    public getPolygone(layer): Polygon {
        if (!layer.hasOwnProperty("latLngs")) {
            throw new AureliaLeafletException("No latLngs given for layer.type \"polygone\"");
        }
        return this._leafletLib.polygone(layer.latlngs, layer.options);
    }

    /* public getMultiPolygone(layer): any {
        if (!layer.hasOwnProperty("latLngs")) {
            throw new AureliaLeafletException("No latLngs given for layer.type \"multiPolygone\"");
        }

        return this._leafletLib.multiPolygone(layer.latlngs, layer.options);
    } */

    public getRectangle(layer): Rectangle {
        if (!layer.hasOwnProperty("bounds")) {
            throw new AureliaLeafletException("No bounds given for layer.type \"rectangle\"");
        }
        return this._leafletLib.rectangle(layer.bounds, layer.options);
    }

    public getCircle(layer): Circle {
        if (!layer.hasOwnProperty("latLng")) {
            throw new AureliaLeafletException("No latLng given for layer.type \"circle\"");
        }
        if (!layer.hasOwnProperty("radius")) {
            throw new AureliaLeafletException("No radius given for layer.type \"circle\"");
        }
        return this._leafletLib.circle(layer.latLng, layer.radius, layer.options);
    }

    public getCircleMarker(layer): CircleMarker {
        if (!layer.hasOwnProperty("latLng")) {
            throw new AureliaLeafletException("No latLng given for layer.type \"circleMarker\"");
        }
        return this._leafletLib.circleMarker(layer.latLng, layer.options);
    }

    public getLayerGroup(layer): LayerGroup {
        if (!layer.hasOwnProperty("layers")) {
            throw new AureliaLeafletException("No layers given for layer.type \"group\"");
        }
        let layers = [];
        for (let l of layer.layers) {
            layers.push(this.getLayer(l));
        }
        return this._leafletLib.layerGroup(layers);
    }

    public getFeatureGroup(layer): FeatureGroup {
        if (!layer.hasOwnProperty("layers")) {
            throw new AureliaLeafletException("No layers given for layer.type \"featureGroup\"");
        }
        let layers = [];
        for (let l of layer.layers) {
            layers.push(this.getLayer(l));
        }
        return this._leafletLib.featureGroup(layers);
    }

    public getGeoJson(layer): GeoJSON {
        if (!layer.hasOwnProperty("data")) {
            throw new AureliaLeafletException("No data property given for layer.type \"geoJSON\"");
        }
        return this._leafletLib.geoJson(layer.data, layer.options);
    }
}
