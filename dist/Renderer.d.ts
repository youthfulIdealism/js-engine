import { Entity } from './Entity';
import { Camera } from './Camera';
import { SimSpace } from './SimSpace';
import { AssetManager } from './AssetManager';
import { Schema } from './Schema';
export declare let renderer_registry: {
    [key: string]: Renderer;
};
export declare abstract class Renderer {
    entity_finder: (sim_space: SimSpace) => Entity[];
    id: string;
    static request_canvas(canvas_id: string, my_uid: string): HTMLCanvasElement;
    constructor(id: string, entity_finder: (sim_space: SimSpace) => Entity[]);
    abstract get schema(): Schema;
    abstract render(tpf: number, asset_manager: AssetManager, camera: Camera, main_canvas: HTMLCanvasElement, entities: Entity[]): void;
}
//# sourceMappingURL=Renderer.d.ts.map