"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var au_leaflet_exception_1 = require("./au-leaflet-exception");
var L = require("leaflet");
var LeafletLayerFactoryPluginBase = (function () {
    function LeafletLayerFactoryPluginBase() {
    }
    return LeafletLayerFactoryPluginBase;
}());
exports.LeafletLayerFactoryPluginBase = LeafletLayerFactoryPluginBase;
var LayerFactory = (function () {
    function LayerFactory(pCustomPlugins) {
        this._leafletLib = L;
        this._customPlugins = pCustomPlugins;
    }
    LayerFactory.prototype.getLayer = function (layer) {
        if (!layer.hasOwnProperty("type")) {
            layer.type = "tile";
        }
        var instance;
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
                var plugin = this._customPlugins.find(function (pPlugin) { return pPlugin.type === layer.type; });
                return plugin.getLayer(layer.options);
        }
        if (typeof layer.initCallback === "function") {
            layer.initCallback(instance);
        }
        if (layer.hasOwnProperty("events")) {
            for (var _i = 0, _a = layer.events; _i < _a.length; _i++) {
                var e = _a[_i];
                if (typeof instance.on === "function") {
                    instance.on(e.name, e.callback);
                }
            }
        }
        return instance;
    };
    LayerFactory.prototype.getMarker = function (layer) {
        if (!layer.hasOwnProperty("latLng")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No latLng given for layer.type \"marker\"");
        }
        var marker = this._leafletLib.marker(layer.latLng, layer.options);
        if (layer.hasOwnProperty("popupContent")) {
            marker.bindPopup(layer.popupContent).openPopup();
        }
        return marker;
    };
    LayerFactory.prototype.getPopup = function (layer) {
        var popup = this._leafletLib.popup(layer.options);
        if (layer.hasOwnProperty("content")) {
            popup.setContent(layer.content);
        }
        if (layer.hasOwnProperty("latLng")) {
            popup.setLatLng(layer.latLng);
        }
        return popup;
    };
    LayerFactory.prototype.getTile = function (layer) {
        if (!layer.hasOwnProperty("url")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No url given for layer.type \"tile\"");
        }
        return this._leafletLib.tileLayer(layer.url, layer.options);
    };
    LayerFactory.prototype.getWMS = function (layer) {
        if (!layer.hasOwnProperty("url")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No url given for layer.type \"wms\"");
        }
        return this._leafletLib.tileLayer.wms(layer.url, layer.options);
    };
    LayerFactory.prototype.getCanvas = function (layer) {
        var l = this._leafletLib.tileLayer.canvas(layer.options);
        if (layer.hasOwnProperty("drawTile")) {
            l.drawTile = layer.drawTile;
        }
        if (layer.hasOwnProperty("tileDrawn")) {
            l.tileDrawn = layer.tileDrawn;
        }
        return l;
    };
    LayerFactory.prototype.getImageOverlay = function (layer) {
        if (!layer.hasOwnProperty("url")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No url given for layer.type \"imageOverlay\"");
        }
        if (!layer.hasOwnProperty("imageBounds")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No imageBounds given for layer.type \"imageOverlay\"");
        }
        return this._leafletLib.imageOverlay(layer.url, layer.imageBounds, layer.options);
    };
    LayerFactory.prototype.getPolyline = function (layer) {
        if (!layer.hasOwnProperty("latLngs")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No latLngs given for layer.type \"polyline\"");
        }
        return this._leafletLib.polyline(layer.latlngs, layer.options);
    };
    LayerFactory.prototype.getMultiPolyline = function (layer) {
        if (!layer.hasOwnProperty("latLngs")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No latLngs given for layer.type \"multiPolyline\"");
        }
        return this._leafletLib.multiPolyline(layer.latlngs, layer.options);
    };
    LayerFactory.prototype.getPolygone = function (layer) {
        if (!layer.hasOwnProperty("latLngs")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No latLngs given for layer.type \"polygone\"");
        }
        return this._leafletLib.polygone(layer.latlngs, layer.options);
    };
    LayerFactory.prototype.getRectangle = function (layer) {
        if (!layer.hasOwnProperty("bounds")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No bounds given for layer.type \"rectangle\"");
        }
        return this._leafletLib.rectangle(layer.bounds, layer.options);
    };
    LayerFactory.prototype.getCircle = function (layer) {
        if (!layer.hasOwnProperty("latLng")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No latLng given for layer.type \"circle\"");
        }
        if (!layer.hasOwnProperty("radius")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No radius given for layer.type \"circle\"");
        }
        return this._leafletLib.circle(layer.latLng, layer.radius, layer.options);
    };
    LayerFactory.prototype.getCircleMarker = function (layer) {
        if (!layer.hasOwnProperty("latLng")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No latLng given for layer.type \"circleMarker\"");
        }
        return this._leafletLib.circleMarker(layer.latLng, layer.options);
    };
    LayerFactory.prototype.getLayerGroup = function (layer) {
        if (!layer.hasOwnProperty("layers")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No layers given for layer.type \"group\"");
        }
        var layers = [];
        for (var _i = 0, _a = layer.layers; _i < _a.length; _i++) {
            var l = _a[_i];
            layers.push(this.getLayer(l));
        }
        return this._leafletLib.layerGroup(layers);
    };
    LayerFactory.prototype.getFeatureGroup = function (layer) {
        if (!layer.hasOwnProperty("layers")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No layers given for layer.type \"featureGroup\"");
        }
        var layers = [];
        for (var _i = 0, _a = layer.layers; _i < _a.length; _i++) {
            var l = _a[_i];
            layers.push(this.getLayer(l));
        }
        return this._leafletLib.featureGroup(layers);
    };
    LayerFactory.prototype.getGeoJson = function (layer) {
        if (!layer.hasOwnProperty("data")) {
            throw new au_leaflet_exception_1.AureliaLeafletException("No data property given for layer.type \"geoJSON\"");
        }
        return this._leafletLib.geoJson(layer.data, layer.options);
    };
    LayerFactory = __decorate([
        aurelia_dependency_injection_1.inject(aurelia_dependency_injection_1.All.of(LeafletLayerFactoryPluginBase)),
        __metadata("design:paramtypes", [Array])
    ], LayerFactory);
    return LayerFactory;
}());
exports.LayerFactory = LayerFactory;
//# sourceMappingURL=layer-factory.js.map