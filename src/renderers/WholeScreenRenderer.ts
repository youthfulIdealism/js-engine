import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { SimSpace } from '../SimSpace';
import { Renderer } from '../Renderer';
import { AssetManager } from '../AssetManager';
import { Schema } from '../Schema'

export class WholeScreenRenderer extends Renderer {
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
        let renderer = main_canvas.getContext('2d');

        if (!renderer) { throw new Error('Renderer is null'); }
        let image = asset_manager.get_image(this.texture_image_url);
        if (image.width === 0 || image.height === 0) { console.log('no image'); return; }

        renderer.imageSmoothingEnabled = false;

        let width_counts = 0;
        let height_counts = 0;
        while (image.width * width_counts < main_canvas.width * 2) { width_counts++; }
        while (image.height * height_counts < main_canvas.height * 2) { height_counts++; }

        //draw the mask
        renderer.resetTransform();
        if (this.move_with_camera) {
            // TODO: this fails if the camera location is negative.
            for (let x = 0; x < width_counts; x++) {
                for (let y = 0; y < height_counts; y++) {
                    renderer.drawImage(image, -(camera.location.x % image.width) + x * image.width, -(camera.location.y % image.height) + y * image.height);
                }
            }
        } else {
            console.log('draw here')
            renderer.drawImage(image, 0, 0);
            for (let x = 0; x < width_counts; x++) {
                for (let y = 0; y < height_counts; y++) {
                    renderer.drawImage(image, x * image.width,  y * image.height);
                }
            }
        }

        
    }
}