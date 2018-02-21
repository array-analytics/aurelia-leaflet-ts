System.register(["aurelia-event-aggregator", "aurelia-dependency-injection", "aurelia-templating", "leaflet", "./layer-factory", "./au-leaflet-exception", "./leaflet-ext"], function (exports_1, context_1) {
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
    var __moduleName = context_1 && context_1.id;
    var aurelia_event_aggregator_1, aurelia_dependency_injection_1, aurelia_templating_1, leaflet_1, layer_factory_1, au_leaflet_exception_1, leaflet_ext_1, AULeafletCustomElement;
    return {
        setters: [
            function (aurelia_event_aggregator_1_1) {
                aurelia_event_aggregator_1 = aurelia_event_aggregator_1_1;
            },
            function (aurelia_dependency_injection_1_1) {
                aurelia_dependency_injection_1 = aurelia_dependency_injection_1_1;
            },
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            },
            function (leaflet_1_1) {
                leaflet_1 = leaflet_1_1;
            },
            function (layer_factory_1_1) {
                layer_factory_1 = layer_factory_1_1;
            },
            function (au_leaflet_exception_1_1) {
                au_leaflet_exception_1 = au_leaflet_exception_1_1;
            },
            function (leaflet_ext_1_1) {
                leaflet_ext_1 = leaflet_ext_1_1;
            }
        ],
        execute: function () {
            AULeafletCustomElement = (function () {
                function AULeafletCustomElement(pEventAgg, pLayerFactory) {
                    var _this = this;
                    this._defaultMapOptions = {
                        center: {
                            lat: 47.3686498,
                            lng: 8.53918250
                        },
                        zoom: 13
                    };
                    this.attachedLayers = {};
                    this._eventAggregator = pEventAgg;
                    this._layerFactory = pLayerFactory;
                    this._mapInit = new Promise(function (resolve, reject) {
                        _this._mapInitResolve = resolve;
                        _this._mapInitReject = reject;
                    });
                    this._eventsBound = new Promise(function (resolve, reject) {
                        _this._eventsBoundResolve = resolve;
                        _this._eventsBoundReject = reject;
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
                AULeafletCustomElement.prototype._layersChanged = function (newLayers, oldLayers) {
                    if (oldLayers && oldLayers !== null) {
                        this.removeOldLayers(oldLayers.base, "base");
                        this.removeOldLayers(oldLayers.overlay, "overlay");
                    }
                    this.attachLayers();
                };
                AULeafletCustomElement.prototype._mapOptionsChanged = function (newOptions, oldOptions) {
                    var _this = this;
                    this.mapOptions = Object.assign(this._defaultMapOptions, newOptions);
                    this._mapInit.then(function () {
                        if (oldOptions) {
                            if (_this.mapOptions.center !== oldOptions.center) {
                                _this.map.setView(_this.mapOptions.center, _this.mapOptions.zoom);
                            }
                            if (_this.mapOptions.maxBounds !== oldOptions.maxBounds) {
                                _this.map.setMaxBounds(_this.mapOptions.maxBounds);
                            }
                        }
                    });
                };
                AULeafletCustomElement.prototype._mapEventsChanged = function (newEvents, oldEvents) {
                    var _this = this;
                    this._mapInit.then(function () {
                        if (newEvents && newEvents.length) {
                            for (var _i = 0, newEvents_1 = newEvents; _i < newEvents_1.length; _i++) {
                                var eventName = newEvents_1[_i];
                                _this.map.on(eventName, function (e) { return _this._eventAggregator.publish("aurelia-leaflet", Object.assign(e, { map: _this.map })); });
                            }
                        }
                        if (oldEvents !== null && oldEvents !== undefined) {
                            for (var _a = 0, _b = oldEvents.filter(function (e) { return newEvents.indexOf(e) === -1; }); _a < _b.length; _a++) {
                                var removedEvent = _b[_a];
                                _this.map.off(removedEvent);
                            }
                        }
                        _this._eventsBoundResolve();
                    });
                };
                AULeafletCustomElement.prototype.withLayerControlChanged = function (newValue) {
                    var _this = this;
                    if (newValue === false) {
                        this._mapInit.then(function () {
                            if (_this.layerControl) {
                                _this.map.removeControl(_this.layerControl);
                            }
                        });
                    }
                    else {
                        this._mapInit.then(function () {
                            if (_this.layerControl) {
                                _this.map.removeControl(_this.layerControl);
                            }
                            _this.layerControl = leaflet_ext_1.createLayersControl(_this.attachedLayers.base, _this.attachedLayers.overlay, newValue).addTo(_this.map);
                        });
                    }
                };
                AULeafletCustomElement.prototype.withScaleControlChanged = function (newValue) {
                    var _this = this;
                    if (newValue === false) {
                        this._mapInit.then(function () {
                            if (_this.scaleControl) {
                                _this.map.removeControl(_this.scaleControl);
                            }
                        });
                    }
                    else {
                        this._mapInit.then(function () {
                            if (_this.scaleControl) {
                                _this.map.removeControl(_this.scaleControl);
                            }
                            _this.scaleControl = leaflet_ext_1.createScaleControl(newValue).addTo(_this.map);
                        });
                    }
                };
                AULeafletCustomElement.prototype.attached = function () {
                    var _this = this;
                    this.attachLayers();
                    return new Promise(function (resolve, reject) {
                        var center = _this.mapOptions.center;
                        delete _this.mapOptions.center;
                        if (!_this.map) {
                            _this.map = new leaflet_1.Map(_this.mapContainer, _this.mapOptions);
                        }
                        _this.mapOptions.center = center;
                        if (_this.map) {
                            _this._mapInitResolve();
                        }
                        else {
                            _this._mapInitReject();
                            reject();
                        }
                        resolve();
                        if (_this.mapEvents) {
                            _this._eventsBound.then(function () {
                                _this.map.setView(_this.mapOptions.center, _this.mapOptions.zoom);
                            });
                        }
                        else {
                            _this.map.setView(_this.mapOptions.center, _this.mapOptions.zoom);
                        }
                    });
                };
                AULeafletCustomElement.prototype.attachLayers = function () {
                    var _this = this;
                    var layersToAttach = {
                        base: {},
                        overlay: {}
                    };
                    if (this.layers.hasOwnProperty("base")) {
                        for (var _i = 0, _a = this.layers.base; _i < _a.length; _i++) {
                            var layer = _a[_i];
                            layersToAttach.base[this.getLayerId(layer)] = this._layerFactory.getLayer(layer);
                        }
                    }
                    if (this.layers.hasOwnProperty("overlay")) {
                        for (var _b = 0, _c = this.layers.overlay; _b < _c.length; _b++) {
                            var layer = _c[_b];
                            layersToAttach.overlay[this.getLayerId(layer)] = this._layerFactory.getLayer(layer);
                        }
                    }
                    this._mapInit.then(function () {
                        for (var layerId in layersToAttach.base) {
                            _this.attachedLayers.base[layerId] = layersToAttach.base[layerId].addTo(_this.map);
                        }
                        for (var layerId in layersToAttach.overlay) {
                            _this.attachedLayers.overlay[layerId] = layersToAttach.overlay[layerId].addTo(_this.map);
                        }
                    });
                };
                AULeafletCustomElement.prototype.removeOldLayers = function (oldLayers, type) {
                    var _this = this;
                    if (!oldLayers || !oldLayers.length) {
                        return;
                    }
                    var removedLayers = oldLayers.filter(function (oldLayer) {
                        var removed = true;
                        if (!_this.layers.hasOwnProperty(type)) {
                            return true;
                        }
                        for (var _i = 0, _a = _this.layers[type]; _i < _a.length; _i++) {
                            var newLayer = _a[_i];
                            if (_this.getLayerId(newLayer) === _this.getLayerId(oldLayer)) {
                                removed = false;
                            }
                        }
                        return removed;
                    });
                    var _loop_1 = function (removedLayer) {
                        this_1._mapInit.then(function () {
                            var id = _this.getLayerId(removedLayer);
                            if (_this.attachedLayers[type].hasOwnProperty(id)) {
                                _this.map.removeLayer(_this.attachedLayers[type][id]);
                                delete _this.attachedLayers[type][_this.getLayerId(removedLayer)];
                            }
                        });
                    };
                    var this_1 = this;
                    for (var _i = 0, removedLayers_1 = removedLayers; _i < removedLayers_1.length; _i++) {
                        var removedLayer = removedLayers_1[_i];
                        _loop_1(removedLayer);
                    }
                };
                AULeafletCustomElement.prototype.getLayerId = function (layer) {
                    var id = layer.id ? layer.id : layer.url;
                    if (!id) {
                        throw new au_leaflet_exception_1.AureliaLeafletException("Not possible to get id for layer. Set the id or url property");
                    }
                    return id;
                };
                __decorate([
                    aurelia_templating_1.bindable({ changeHandler: "_layersChanged" }),
                    __metadata("design:type", Object)
                ], AULeafletCustomElement.prototype, "layers", void 0);
                __decorate([
                    aurelia_templating_1.bindable({ changeHandler: "_mapEventsChanged" }),
                    __metadata("design:type", Array)
                ], AULeafletCustomElement.prototype, "mapEvents", void 0);
                __decorate([
                    aurelia_templating_1.bindable({ changeHandler: "_mapOptionsChanged" }),
                    __metadata("design:type", Object)
                ], AULeafletCustomElement.prototype, "mapOptions", void 0);
                __decorate([
                    aurelia_templating_1.bindable,
                    __metadata("design:type", Boolean)
                ], AULeafletCustomElement.prototype, "withLayerControl", void 0);
                __decorate([
                    aurelia_templating_1.bindable,
                    __metadata("design:type", Object)
                ], AULeafletCustomElement.prototype, "withScaleControl", void 0);
                AULeafletCustomElement = __decorate([
                    aurelia_dependency_injection_1.autoinject(),
                    aurelia_templating_1.customElement("au-leaflet"),
                    __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, layer_factory_1.LayerFactory])
                ], AULeafletCustomElement);
                return AULeafletCustomElement;
            }());
            exports_1("AULeafletCustomElement", AULeafletCustomElement);
        }
    };
});
//# sourceMappingURL=au-leaflet.js.map