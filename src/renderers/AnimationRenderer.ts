import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { SimSpace } from '../SimSpace';
import { Renderer } from '../Renderer';
import { AssetManager } from '../AssetManager';
import { Schema } from '../Schema'

export class AnimationRenderer extends Renderer {

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
            let animation = entity.memory.animation;
            let animation_frames = animation.frames;

            if (!animation) { return; }
            if (!animation_frames) { return; }
            if (!entity.memory.animation_progress) { entity.memory.animation_progress = 0; }

            let animation_current_frame_index = animation.current_frame;
            let animation_current_frame = animation_frames[animation_current_frame_index];
           

            entity.memory.animation_progress += tpf;
            while (entity.memory.animation_progress > animation_current_frame.duration) {
                animation_current_frame_index++;
                entity.memory.animation_progress -= animation_current_frame.duration;
                if (animation_frames.length <= animation_current_frame_index){
                    if (animation.type === 'loop') {
                        animation_current_frame_index = 0;
                    }
                    if (animation.type === 'finish') {
                        animation_current_frame_index = animation_frames.length - 1;
                    }
                }
                animation_current_frame = animation_frames[animation_current_frame_index];
            }

            let image_path = animation_current_frame.image;
            if (!image_path) { continue; }

            let image = asset_manager.get_image(entity.render_data[this.id].image);
            renderer.drawImage(image, entity.location.x - image.width / 2, entity.location.y - image.height / 2);
        }
    }
}