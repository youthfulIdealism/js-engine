import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { SimSpace } from '../SimSpace';
import { Renderer } from '../Renderer';
import { AssetManager } from '../AssetManager';
import { Schema } from '../Schema'

export class BlockRenderer extends Renderer {

    get schema(): Schema {
        return {
            'width': 'number',
            'height': 'number',
            'color': 'string',
        };
    }

    render(tpf: number, asset_manager: AssetManager, camera: Camera, main_canvas: HTMLCanvasElement, entities: Entity[]) {
        let renderer = main_canvas.getContext('2d');
        if (!renderer) { throw new Error('Renderer is null'); }
        renderer.resetTransform();
        renderer.imageSmoothingEnabled = false;

        renderer.translate(- camera.location.x + main_canvas.width / 2, -camera.location.y + main_canvas.height / 2);
        renderer.scale(camera.zoom, camera.zoom);

        for (let entity of entities) {
            
            renderer.fillStyle = entity.render_data[this.id].color;
            let width = entity.render_data[this.id].width;
            let height = entity.render_data[this.id].height;
            renderer.fillRect(entity.location.x - width / 2, entity.location.y - height / 2, width, height);
        }
    }
}