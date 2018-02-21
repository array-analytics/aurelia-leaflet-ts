import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-dependency-injection";
import { bindable, customElement } from "aurelia-templating";
import { Map, MapOptions, LayersControl, ScaleControl, LeafLayer } from "leaflet";
import { LayerFactory } from "./layer-factory";
import { AureliaLeafletException } from "./au-leaflet-exception";
import { createLayersControl, createScaleControl } from "./leaflet-ext";


@autoinject()
@customElement("au-leaflet")
export class AULeafletCustomElement {

    private _eventAggregator: EventAggregator;
    
    private _layerFactory: LayerFactory;

    private _mapInit: Promise<any>;

    private _mapInitResolve: Function;
    private _mapInitReject: Function;
    private _eventsBound: Promise<any>;
    private _eventsBoundResolve: Function;
    private _eventsBoundReject: Function;

    private _defaultMapOptions: MapOptions = {
        center: {
            lat: 47.3686498,
            lng: 8.53918250
        },
        zoom: 13
    };

    constructor(pEventAgg: EventAggregator, pLayerFactory: LayerFactory) {
        this._eventAggregator = pEventAgg;
        
        this._layerFactory = pLayerFactory;

        this._mapInit = new Promise((resolve, reject) => {
            this._mapInitResolve = resolve;
            this._mapInitReject = reject;
        });

        this._eventsBound = new Promise((resolve, reject) => {
            this._eventsBoundResolve = resolve;
            this._eventsBoundReject = reject;
        });

        this.mapOptions = this._defaultMapOptions;

        this.layers =
            {
                base: [
                    {
                        id: "OSM Tiles",
                        type: "tile",
                        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
                        options: {
                            attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
                        }
                    }
                ],
                overlay: []
            };
        this.attachedLayers.base = {};
        this.attachedLayers.overlay = {};
    
    }

    @bindable({ changeHandler: "_layersChanged" })
    public layers: any;

    @bindable({ changeHandler: "_mapEventsChanged" })
    public mapEvents: string[]
    @bindable({ changeHandler: "_mapOptionsChanged" })
    public mapOptions: MapOptions;
    @bindable
    public withLayerControl: boolean;
    @bindable
    public withScaleControl: any;

    public map: Map


    public attachedLayers: any = {};

    public layerControl: LayersControl;

    public scaleControl: ScaleControl;

    public mapContainer: HTMLElement;

    private _layersChanged(newLayers: any, oldLayers: any) {
        if (oldLayers && oldLayers !== null) {
            this.removeOldLayers(oldLayers.base, "base");
            this.removeOldLayers(oldLayers.overlay, "overlay");
        }
        this.attachLayers();
    }

    private _mapOptionsChanged(newOptions: MapOptions, oldOptions: MapOptions) {
        this.mapOptions = Object.assign(this._defaultMapOptions, newOptions);
        // some options can get set on the map object after init
        this._mapInit.then(() => {
            if (oldOptions) {
                if (this.mapOptions.center !== oldOptions.center) {
                    this.map.setView(this.mapOptions.center, this.mapOptions.zoom);
                }

                if (this.mapOptions.maxBounds !== oldOptions.maxBounds) {
                    this.map.setMaxBounds(this.mapOptions.maxBounds);
                }
            }
        });
    }

    private _mapEventsChanged(newEvents, oldEvents) {
        this._mapInit.then(() => {
            if (newEvents && newEvents.length) {
                for (let eventName of newEvents) {
                    this.map.on(eventName, (e) => this._eventAggregator.publish("aurelia-leaflet", Object.assign(e, { map: this.map })));
                }
            }
            if (oldEvents !== null && oldEvents !== undefined) {
                for (let removedEvent of oldEvents.filter((e) => newEvents.indexOf(e) === -1)) {
                    this.map.off(removedEvent);
                }
            }

            this._eventsBoundResolve();
        });
    }

    withLayerControlChanged(newValue) {
        if (newValue === false) {
            this._mapInit.then(() => {
                if (this.layerControl) {
                    this.map.removeControl(this.layerControl);
                }
            });
        } else {
            this._mapInit.then(() => {
                if (this.layerControl) {
                    this.map.removeControl(this.layerControl);
                }
                this.layerControl = createLayersControl(this.attachedLayers.base, this.attachedLayers.overlay, newValue).addTo(this.map);
            });
        }
    }

    withScaleControlChanged(newValue) {
        if (newValue === false) {
            this._mapInit.then(() => {
                if (this.scaleControl) {
                    this.map.removeControl(this.scaleControl);
                }
            });
        } else {
            this._mapInit.then(() => {
                if (this.scaleControl) {
                    this.map.removeControl(this.scaleControl);
                }

                this.scaleControl = createScaleControl(newValue).addTo(this.map);
            });
        }
    }

    attached() {
        this.attachLayers();
        return new Promise((resolve, reject) => {
            // remove the center option before contructing the map to have a chance to bind to the "load" event
            // first. The "load" event on the map gets fired after center and zoom are set for the first time.
            var center = this.mapOptions.center;
            delete this.mapOptions.center;
            if (!this.map) {
                this.map = new Map(this.mapContainer, this.mapOptions);
            }
            this.mapOptions.center = center;

            if (this.map) {
                this._mapInitResolve();
            } else {
                this._mapInitReject();
                reject();
            }

            resolve();

            if (this.mapEvents) {
                this._eventsBound.then(() => {
                    this.map.setView(this.mapOptions.center, this.mapOptions.zoom);
                });
            } else {
                this.map.setView(this.mapOptions.center, this.mapOptions.zoom);
            }
        });
    }

    attachLayers() {
        let layersToAttach = {
            base: {},
            overlay: {}
        };
        if (this.layers.hasOwnProperty("base")) {
            for (let layer of this.layers.base) {
                layersToAttach.base[this.getLayerId(layer)] = this._layerFactory.getLayer(layer);
            }
        }
        if (this.layers.hasOwnProperty("overlay")) {
            for (let layer of this.layers.overlay) {
                layersToAttach.overlay[this.getLayerId(layer)] = this._layerFactory.getLayer(layer);
            }
        }
        this._mapInit.then(() => {
            for (let layerId in layersToAttach.base) {
                this.attachedLayers.base[layerId] = layersToAttach.base[layerId].addTo(this.map);
            }
            for (let layerId in layersToAttach.overlay) {
                this.attachedLayers.overlay[layerId] = layersToAttach.overlay[layerId].addTo(this.map);
            }
        });
    }

    removeOldLayers(oldLayers, type) {
        if (!oldLayers || !oldLayers.length) {
            return;
        }
        let removedLayers = oldLayers.filter((oldLayer) => {
            let removed = true;
            if (!this.layers.hasOwnProperty(type)) {
                return true;
            }
            for (let newLayer of this.layers[type]) {
                if (this.getLayerId(newLayer) === this.getLayerId(oldLayer)) {
                    removed = false;
                }
            }
            return removed;
        });

        for (let removedLayer of removedLayers) {
            this._mapInit.then(() => {
                let id = this.getLayerId(removedLayer);
                if (this.attachedLayers[type].hasOwnProperty(id)) {
                    this.map.removeLayer(this.attachedLayers[type][id]);
                    delete this.attachedLayers[type][this.getLayerId(removedLayer)];
                }
            });
        }
    }

    getLayerId(layer: LeafLayer) {
        let id = layer.id ? layer.id : layer.url;
        if (!id) {
            throw new AureliaLeafletException("Not possible to get id for layer. Set the id or url property");
        }
        return id;
    }
}
