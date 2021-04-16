import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { SimSpace } from '../SimSpace';
import { Renderer } from '../Renderer';
import { AssetManager } from '../AssetManager';
import { Schema } from '../Schema';
export declare class WholeScreenRenderer extends Renderer {
    texture_image_url: string;
    move_with_camera: boolean;
    get schema(): Schema;
    constructor(id: string, entity_finder: (sim_space: SimSpace) => Entity[], texture_image_url: string, move_with_camera?: boolean);
    render(tpf: number, asset_manager: AssetManager, camera: Camera, main_canvas: HTMLCanvasElement, entities: Entity[]): void;
}
//# sourceMappingURL=WholeScreenRenderer.d.ts.map