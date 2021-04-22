import { SimSpace } from '../SimSpace';
import { Entity } from '../Entity';
import { Schema } from '../Schema'
import { Behavior } from '../Behavior'

export let behavior_change_animation = new Behavior('change_animation', (entity: Entity, sim_space: SimSpace, behavior_parameters: any, context: any): boolean => {
    if (!behavior_parameters.change_to) { return false; }
    if (!behavior_parameters.priority) { behavior_parameters.priority = 0; }
    if (!entity.memory.animations) { console.log(`no animation found.`);  return false; }
    if (!entity.memory.animations[behavior_parameters.change_to]) { console.log(`animation ${behavior_parameters.change_to} not found.`); return false; }
    if (entity.memory.animation.interruptable === false || entity.memory.priority > behavior_parameters.priority) { return false; }
    entity.memory.animation = entity.memory.animation = entity.memory.animations[behavior_parameters.change_to];
    entity.memory.animation_progress = 0;

    return false;

}, { 'change_to': 'string', 'priority': 'number'});