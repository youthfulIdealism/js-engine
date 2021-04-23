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
            if (!entity.memory.animation_current_frame) { entity.memory.animation_current_frame = 0; }

            let animation_current_frame_index = entity.memory.animation_current_frame;
            let current_frame = animation_frames[animation_current_frame_index];
           

            entity.memory.animation_progress += tpf;
            while (entity.memory.animation_progress > current_frame.duration) {
                animation_current_frame_index++;
                entity.memory.animation_progress -= current_frame.duration;
                if (animation_current_frame_index >= animation_frames.length) {
                    if (entity.memory.queued_animation) {
                        animation_current_frame_index = 0;
                        entity.memory.animation_progress = 0;
                        entity.memory.animation_current_frame = 0;
                        entity.memory.animation = entity.memory.animations[entity.memory.queued_animation];
                        entity.memory.animation_progress = 0;
                    }
                    else if (animation.type === 'loop') {
                        animation_current_frame_index = 0;
                    }
                    else if (animation.type === 'stick') {
                        animation_current_frame_index = animation_frames.length - 1;
                    }
                }
                current_frame = animation_frames[animation_current_frame_index];
                entity.memory.animation_current_frame = animation_current_frame_index;
            }

            let image_path = current_frame.image;
            if (!image_path) { continue; }
            let image = asset_manager.get_image(image_path);
            let render_data = entity.render_data[this.id];

            renderer.save();
            renderer.translate(entity.location.x, entity.location.y);

            if (render_data.opacity !== undefined) { renderer.globalAlpha = render_data.opacity; }
            if (render_data.rotation !== undefined) { renderer.rotate(render_data.rotation); }
            if (render_data.scale !== undefined) { renderer.scale(render_data.scale, render_data.scale); }
            renderer.translate(-image.width, -image.height);

            
            renderer.drawImage(image, 0, 0);
            renderer.restore();
            if (render_data.opacity !== undefined) { renderer.globalAlpha = 1; }
        }
    }
}