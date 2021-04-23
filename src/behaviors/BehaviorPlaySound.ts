import { SimSpace } from '../SimSpace';
import { Entity } from '../Entity';
import { Schema } from '../Schema'
import { Behavior } from '../Behavior'

export let behavior_play_sound = new Behavior('play_sound', (entity: Entity, sim_space: SimSpace, behavior_parameters: any, context: any): boolean => {
    if (!behavior_parameters.sounds) { return false; }
    let sound_path = (behavior_parameters.sounds[Math.floor(Math.random() * behavior_parameters.sounds.length)]).path;
    let sound = sim_space.asset_manager.get_sound(sound_path);
    sound.play();

    return false;

}, { 'sounds': [{ 'path': 'string'}]});