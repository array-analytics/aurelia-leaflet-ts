import { customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-dependency-injection";


@autoinject()
@customElement("au-leaflet")
export class AULeafletCustomElement {
    private _eventBus: EventAggregator;

    constructor(pEventAggregator: EventAggregator) {
        this._eventBus = pEventAggregator;
    }

    mapContainer: HTMLElement;

    public attached(): Promise<any> {
        console.log(this.mapContainer);
        return Promise.resolve();
    }
}