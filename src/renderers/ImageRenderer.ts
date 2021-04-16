import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { SimSpace } from '../SimSpace';
import { Renderer } from '../Renderer';
import { AssetManager } from '../AssetManager';
import { Schema } from '../Schema'

export class ImageRenderer extends Renderer {

    get schema(): Schema {
        return {
            'image': 'string',
        };
    }

    render(tpf: number, asset_manager: AssetManager, camera: Camera, main_canvas: HTMLCanvasElement, entities: Entity[]) {
        let renderer = main_canvas.getContext('2d');
        if (!renderer) { throw new Error('Renderer is null'); }
        renderer.resetTransform();
        renderer.imageSmoothingEnabled = false;

        renderer.translate(-camera.location.x + main_canvas.width / 2, -camera.location.y + main_canvas.height / 2);
        renderer.scale(camera.zoom, camera.zoom);

        for (let entity of entities) {
            let image_path = entity.render_data[this.id].image;
            if (!image_path) { continue; }

            let image = asset_manager.get_image(entity.render_data[this.id].image);
            renderer.drawImage(image, entity.location.x - image.width / 2, entity.location.y - image.height / 2);
        }
    }
}