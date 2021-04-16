import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { Renderer } from '../Renderer';
import { AssetManager } from '../AssetManager';
import { Schema } from '../Schema';
export declare class BlockRenderer extends Renderer {
    get schema(): Schema;
    render(tpf: number, asset_manager: AssetManager, camera: Camera, main_canvas: HTMLCanvasElement, entities: Entity[]): void;
}
//# sourceMappingURL=BlockRenderer.d.ts.map