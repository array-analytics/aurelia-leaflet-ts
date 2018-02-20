import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-dependency-injection";
import { bindable, customElement } from "aurelia-templating";
import {
    Map, MapOptions, LayersControl, ScaleControl, LayersObject, Layer, LayersOptions, ScaleOptions, TileLayer,
    TileLayerConfig, LayerConfig, LayerWithIdInstance, LayerId
} from "leaflet";
import { LayerFactory } from "./layer-factory";
import { AureliaLeafletException } from "./au-leaflet-exception";
import { createLayersControl, createScaleControl } from "./leaflet-ext";
import { bindingMode } from "aurelia-binding";

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

    constructor(pEventAgg: EventAggregator) {
        this._eventAggregator = pEventAgg;
        
        this._layerFactory = new LayerFactory();

        this._mapInit = new Promise((resolve, reject) => {
            this._mapInitResolve = resolve;
            this._mapInitReject = reject;
        });

        this._eventsBound = new Promise((resolve, reject) => {
            this._eventsBoundResolve = resolve;
            this._eventsBoundReject = reject;
        });

        this.mapOptions = this._defaultMapOptions;

        this.baseLayerConfigs.push({
                        id: "OSM Tiles",
                        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
                            attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        });
    
    }

    @bindable({ changeHandler: "_baseLayersChanged" })
    public baseLayerConfigs: Array<TileLayerConfig> = new Array<TileLayerConfig>();

    @bindable({ changeHandler: "_overlayLayersChanged" })
    public overlayLayerConfigs: Array<LayerConfig> = new Array<LayerConfig>();

    @bindable({ defaultBindingMode: bindingMode.toView })
    public baseLayers: Array<TileLayer> = new Array<TileLayer>();

    @bindable({ defaultBindingMode: bindingMode.toView })
    public overlayLayers: Array<Layer> = new Array<Layer>();

    @bindable({ changeHandler: "_mapEventsChanged" })
    public mapEvents: string[]
    @bindable({ changeHandler: "_mapOptionsChanged" })
    public mapOptions: MapOptions;
    @bindable
    public withLayerControl: LayersOptions | false = false;
    @bindable
    public withScaleControl: ScaleOptions | false = false;

    public map: Map

    public layerControl: LayersControl;

    public scaleControl: ScaleControl;

    public mapContainer: HTMLElement;

    private _baseLayersChanged(newLayers: Array<TileLayerConfig>, oldLayers: Array<TileLayerConfig>) {
        if (oldLayers && oldLayers !== null) {
            //let layerIds: Array<ILayerId> = oldLayers.map((pLayer: TileLayerConfig) => { return <ILayerId>{ id: pLayer.id, _leaflet_id: pLayer._leaflet_id }; });
            this.removeOldLayers(oldLayers);
        }
        this.attachLayers();
    }

    private _overlayLayersChanged(newLayers: Array<LayerConfig>, oldLayers: Array<LayerConfig>) {
        if (oldLayers && oldLayers !== null) {
            this.removeOldLayers(oldLayers);
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

    withLayerControlChanged(newValue: LayersOptions | false) {
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
                let baseLayersObj: LayersObject = {};
                for (let baseLayerConfig of this.baseLayerConfigs) {
                    let layerId = this.getLayerId(baseLayerConfig);
                    let layerInstance = this.getLayerById(layerId);
                    baseLayersObj[layerId] = layerInstance;
                }
                let overlayLayersObj: LayersObject = {};
                for (let overlayLayer of this.overlayLayerConfigs) {
                    let layerId = this.getLayerId(overlayLayer);
                    let layerInstance = this.getLayerById(layerId);
                    overlayLayersObj[layerId] = layerInstance;
                }
                this.layerControl = createLayersControl(baseLayersObj, overlayLayersObj, newValue).addTo(this.map);
            });
        }
    }

    withScaleControlChanged(newValue: ScaleOptions | false) {
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

    private created() {
        this.attachLayers();
    }

    attached() {
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

    public getLayerById(pLayerID: string | number): LayerWithIdInstance {
        let baseLayer = this.baseLayers.find((pLayer: LayerWithIdInstance) => pLayer.id === pLayerID);
        let overlayLayer = this.overlayLayers.find((pLayer: LayerWithIdInstance) => pLayer.id === pLayerID);

        return baseLayer ? baseLayer : overlayLayer;
    }

    attachLayers() {
        this._mapInit.then(() => {
            if (this.baseLayerConfigs && this.baseLayerConfigs.length) {
                for (let baseLayerConfig of this.baseLayerConfigs) {
                    this.baseLayers.push(this._layerFactory.getLayer(baseLayerConfig));
            }
        }
            if (this.overlayLayerConfigs && this.overlayLayerConfigs.length) {
                for (let overlayLayerConfig of this.overlayLayerConfigs) {
                    this.overlayLayers.push(this._layerFactory.getLayer(overlayLayerConfig));
            }
        }
        });
    }

    removeOldLayers(oldLayers: Array<LayerId>) {

        let baseLayersToRemove = oldLayers.filter((pOldLayer: LayerId) => {
            return this.baseLayers.some((pNewLayer: LayerWithIdInstance) => {
                return this.getLayerId(pOldLayer) === this.getLayerId(pNewLayer);
        });
        });
        let overlayLayersToRemove = oldLayers.filter((pOldLayer: LayerId) => {
            return this.overlayLayers.some((pNewLayer: LayerWithIdInstance) => {
                return this.getLayerId(pOldLayer) === this.getLayerId(pNewLayer);
            });
        });

        for (let removedLayer of baseLayersToRemove) {
            this._mapInit.then(() => {
                let layerInstance: LayerWithIdInstance = removedLayer as LayerWithIdInstance;
                this.map.removeLayer(layerInstance);
                removeLayers(this.baseLayers, layerInstance);
            });
                }

        for (let removedLayer of overlayLayersToRemove) {
            this._mapInit.then(() => {
                let layerInstance: LayerWithIdInstance = removedLayer as LayerWithIdInstance;
                this.map.removeLayer(layerInstance);
                removeLayers(this.overlayLayers, layerInstance);
            });
        }

        function removeLayers(pLayersSource: Array<Layer>, pLayerToRemove: LayerWithIdInstance) {
            let layerIndex = pLayersSource.indexOf(pLayerToRemove);
            if (layerIndex === -1)
                throw new AureliaLeafletException(`Expected layer '${pLayerToRemove.id}' not found in source.`);
            pLayersSource.splice(layerIndex, 1);
    }
    }

    getLayerId(layer: LayerId) {
        let id = layer.id ? layer.id : layer._leaflet_id;
        if (!id) {
            throw new AureliaLeafletException("Not possible to get id for layer. Set the id or verify _leaflet_id property.");
        }
        return id;
    }
}
