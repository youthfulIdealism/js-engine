import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { SimSpace } from '../SimSpace';
import { Renderer } from '../Renderer';
import { AssetManager } from '../AssetManager';
import { Schema } from '../Schema'

export class MaskRenderer extends Renderer {
    texture_image_url: string;
    move_with_camera: boolean;

    get schema(): Schema {
        return {
            'image': 'string',
        };
    }

    constructor(id: string, entity_finder: (sim_space: SimSpace) => Entity[], texture_image_url: string, move_with_camera = false) {
        super(id, entity_finder)
        this.texture_image_url = texture_image_url;
        this.move_with_camera = move_with_camera;



    }

    render(tpf: number, asset_manager: AssetManager, camera: Camera, main_canvas: HTMLCanvasElement, entities: Entity[]) {
        let mask_canvas = Renderer.request_canvas('mask', this.id);
        let mask_texture_canvas = Renderer.request_canvas('mask_texture', this.id);
        let renderer = main_canvas.getContext('2d');
        let mask_renderer = mask_canvas.getContext('2d');
        let mask_texture_renderer = mask_texture_canvas.getContext('2d');

        if (!renderer) { throw new Error('Renderer is null'); }
        if (!mask_renderer) { throw new Error('Mask Renderer is null'); }
        if (!mask_texture_renderer) { throw new Error('Mask Texture Renderer is null'); }

        renderer.imageSmoothingEnabled = false;
        mask_renderer.imageSmoothingEnabled = false;
        mask_texture_renderer.imageSmoothingEnabled = false;

        if (mask_canvas.width !== main_canvas.width) {
            let mask_texture = asset_manager.get_image(this.texture_image_url);
            if (mask_texture.width === 0 || mask_texture.height === 0) { return; }

            mask_canvas.width = main_canvas.width;
            mask_canvas.height = main_canvas.height;

            let width_counts = 0;
            let height_counts = 0;
            /*
             * set up a loopable texture
             * */
            
            while (mask_texture.width * width_counts < main_canvas.width * 2) { width_counts++; }
            while (mask_texture.height * height_counts < main_canvas.height * 2) { height_counts++; }
            mask_texture_canvas.width = mask_texture.width * width_counts;
            mask_texture_canvas.height = mask_texture.height * height_counts;

            for (let x = 0; x < width_counts; x++) {
                for (let y = 0; y < height_counts; y++) {
                    mask_texture_renderer.drawImage(mask_texture, x * mask_texture.width, y * mask_texture.height);
                }
            }
        }

        //draw the mask
        mask_renderer.resetTransform();
        mask_renderer.clearRect(0, 0, mask_canvas.width, mask_canvas.height);
        mask_renderer.globalCompositeOperation = "source-over";
        mask_renderer.translate(-camera.location.x + main_canvas.width / 2, -camera.location.y + main_canvas.height / 2);
        mask_renderer.scale(camera.zoom, camera.zoom);

        for (let entity of entities) {
            let render_data = entity.render_data[this.id];
            let image_path = render_data.image;
            if (!image_path) { continue; }
            let image = asset_manager.get_image(entity.render_data[this.id].image);

            mask_renderer.save();
            mask_renderer.translate(entity.location.x, entity.location.y);

            
            if (render_data.opacity !== undefined) { mask_renderer.globalAlpha = render_data.opacity; }
            if (render_data.rotation !== undefined) { mask_renderer.rotate(render_data.rotation); }

            if (render_data.scale !== undefined) { mask_renderer.scale(render_data.scale, render_data.scale); }
            if (render_data.scale_x !== undefined) { mask_renderer.scale(render_data.scale_x, 1); }
            if (render_data.scale_y !== undefined) { mask_renderer.scale(1, render_data.scale_y); }

            mask_renderer.translate(-image.width / 2, -image.height / 2);
            mask_renderer.drawImage(image, 0, 0);

            mask_renderer.restore();
            if (render_data.opacity !== undefined) { mask_renderer.globalAlpha = 1; }
        }

        //draw the texture image onto the mask
        mask_renderer.resetTransform();
        mask_renderer.globalCompositeOperation = "source-in";

        if (this.move_with_camera) {
            // TODO: this fails if the camera location is negative.
            mask_renderer.drawImage(mask_texture_canvas, -(camera.location.x % (mask_texture_canvas.width / 2)), -(camera.location.y % (mask_texture_canvas.height / 2)));
        } else {
            mask_renderer.drawImage(mask_texture_canvas, 0, 0);
        }

        //draw the masked texture image onto the main canvas
        renderer.resetTransform();
        renderer.drawImage(mask_canvas, 0, 0);
    }
}