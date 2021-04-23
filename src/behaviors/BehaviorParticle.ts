import { SimSpace } from '../SimSpace';
import { Entity } from '../Entity';
import { Schema } from '../Schema'
import { Behavior } from '../Behavior'
import Victor from 'victor';

function lerp(v0: number, v1: number, t: number): number {
    return v0 * (1 - t) + v1 * t
}

export let behavior_particle = new Behavior('particle', (entity: Entity, sim_space: SimSpace, behavior_parameters: any, context: any): boolean => {
    if (!behavior_parameters.renderer) { return false; }
    if (!behavior_parameters.duration) { return false; }
    if (!behavior_parameters.current_time) { behavior_parameters.current_time = 0; }
    if (behavior_parameters.current_time > behavior_parameters.duration) { sim_space.remove_entity(entity); return true; }

    let current_entity_location = entity.location;
    let tpf = context.tpf ? context.tpf : 1;
    let render_data = entity.render_data[behavior_parameters.renderer];
    let lerp_factor = behavior_parameters.current_time / behavior_parameters.duration;
    behavior_parameters.current_time += tpf;

    let start_scale = behavior_parameters.start_scale;
    let end_scale = behavior_parameters.end_scale;
    let start_opacity = behavior_parameters.start_opacity;
    let end_opacity = behavior_parameters.end_opacity;
    let start_rotation = behavior_parameters.start_rotation;
    let end_rotation = behavior_parameters.end_rotation;

    if (render_data) {
        if (start_scale !== undefined && end_scale !== undefined) {
            render_data.scale = lerp(start_scale, end_scale, lerp_factor);
        }

        if (start_opacity !== undefined && end_opacity !== undefined) {
            render_data.opacity = lerp(start_opacity, end_opacity, lerp_factor);
        }

        if (start_rotation !== undefined && end_rotation !== undefined) {
            if (!behavior_parameters.rotation_before_particle) { behavior_parameters.rotation_before_particle = render_data.rotation ? render_data.rotation : 0; }
            if (!behavior_parameters.current_rotation_modifier) { behavior_parameters.current_rotation_modifier = 0; }
            behavior_parameters.current_rotation_modifier = lerp(start_rotation, end_rotation, lerp_factor);
            render_data.rotation = behavior_parameters.rotation_before_particle + behavior_parameters.current_rotation_modifier;
        }
    }

    if (behavior_parameters.velocity) {
        if (!behavior_parameters.acceleration) { behavior_parameters.acceleration = 1; }
        let acceleration = behavior_parameters.acceleration;
        behavior_parameters.velocity *= acceleration;
        let delta_location = behavior_parameters.direction.clone().multiply(new Victor(behavior_parameters.velocity, behavior_parameters.velocity)).multiply(new Victor(tpf, tpf));
        current_entity_location.add(delta_location)
    }

    return false;

}, {
    'renderer': 'string',
    'start_scale': 'number',
    'end_scale': 'number',
    'start_opacity': 'number',
    'end_opacity': 'number',
    'start_rotation': 'number',
    'end_rotation': 'number',
    'current_rotation_modifier': 'number',
    'direction': { x: 'number', y: 'number' },
    'velocity': 'number',
    'acceleration': 'number',
    'duration': 'number',
    'current_time': 'number',
});
    