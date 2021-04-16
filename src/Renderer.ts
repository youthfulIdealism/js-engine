import { Entity } from './Entity';
import { Camera } from './Camera';
import { SimSpace } from './SimSpace';
import { AssetManager } from './AssetManager';
import { Schema } from './Schema'
import uuid from 'uuid';


export let renderer_registry: { [key: string]: Renderer } = {};

export abstract class Renderer {
    entity_finder: (sim_space: SimSpace) => Entity[];
    id: string;

    static request_canvas(canvas_id: string, my_uid: string): HTMLCanvasElement {
        let doc_id = canvas_id + '_' + my_uid;
        let canvas = document.getElementById(doc_id) as HTMLCanvasElement;
        if (canvas) { return canvas; }

        //no canvas was found; generate one.
        let internal_area = document.getElementById('hidden_area_for_js_engine_internals');
        if (!internal_area) { throw Error('hidden internals area not found on dom.') }

        canvas = document.createElement('canvas');
        canvas.id = doc_id;
        canvas.style.imageRendering = 'pixelated';
        internal_area.appendChild(canvas);
        return canvas;
    }

    constructor(id: string, entity_finder: (sim_space: SimSpace) => Entity[]) {
        this.id = id;
        this.entity_finder = entity_finder;

        if (renderer_registry[id]) { throw new Error(`duplicate renderer id ${id}`); }
        renderer_registry[id] = this;
    }

    abstract get schema(): Schema
    abstract render(tpf: number, asset_manager: AssetManager, camera: Camera, main_canvas: HTMLCanvasElement, entities: Entity[]) : void
}