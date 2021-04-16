import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { Renderer } from '../Renderer';
import { AssetManager } from '../AssetManager';
import { Schema } from '../Schema';
export declare class ImageRenderer extends Renderer {
    get schema(): Schema;
    render(tpf: number, asset_manager: AssetManager, camera: Camera, main_canvas: HTMLCanvasElement, entities: Entity[]): void;
}
//# sourceMappingURL=ImageRenderer.d.ts.map