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
            let render_data = entity.render_data[this.id];
            let image_path = render_data.image;
            if (!image_path) { continue; }
            let image = asset_manager.get_image(entity.render_data[this.id].image);

            renderer.save();
            renderer.translate(entity.location.x, entity.location.y);

            if (render_data.opacity !== undefined) { renderer.globalAlpha = render_data.opacity; }
            if (render_data.rotation !== undefined) { renderer.rotate(render_data.rotation); }
            if (render_data.scale !== undefined) { renderer.scale(render_data.scale, render_data.scale); }
            if (render_data.scale_x !== undefined) { renderer.scale(render_data.scale_x, 1); }
            if (render_data.scale_y !== undefined) { renderer.scale(1, render_data.scale_y); }

            renderer.translate(-image.width / 2, -image.height / 2);
            renderer.translate(0, 0);

            
            renderer.drawImage(image, 0, 0);
            renderer.restore();
            if (render_data.opacity !== undefined) { renderer.globalAlpha = 1; }
        }
    }
}