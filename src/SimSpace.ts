import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { Entity } from './Entity';
import { AssetManager } from './AssetManager';
import { behavior_registry } from './Behavior';
import { parse } from './serialization/serialization_helper';

export class SimSpace {
    entities: { [key: string]: Entity }
    key_map: { [key: string]: { [key: string]: Entity } }
    events_map: { [key: string]: { [key: string]: Entity } }
    cameras: Camera[];
    renderers: Renderer[];
    renderer_memory: { [key: string]: any }
    asset_manager: AssetManager;

    constructor() {
        this.entities = {};
        this.key_map = {};
        this.events_map = {};
        this.cameras = [];
        this.renderers = [];
        this.renderer_memory = {};
        this.asset_manager = new AssetManager();
    }

    from_json(json_string: string) {
        let world_data = JSON.parse(json_string, parse);

        let entity_datas = Object.values(world_data.entities);

        for (let entity_data of entity_datas) {
            // @ts-ignore
            let entity = new Entity(entity_data.location, entity_data.tags);
            Object.assign(entity, entity_data);
            this.add_entity(entity);
        }
    }

    to_json(): string {
        let world_serialization: any = {};
        world_serialization.entities = this.entities;
        return JSON.stringify(world_serialization);
    }

    update(tpf: number) {
        this.fire_event('update', { tpf: tpf });
        for (let camera of this.cameras) {
            camera.update(tpf, this);
        }
    }

    get_entities_with_tag(tag: string) {
        let entities_with_tag = this.key_map[tag];
        if (entities_with_tag) {
            return Object.values(entities_with_tag);
        }
        return [];
    }

    get_entity_by_id(id: string) {
        return this.entities[id];
    }

    push_renderer(renderer: Renderer, camera: Camera) {
        this.renderers.push(renderer);
        if (!this.renderer_memory[renderer.id]) { this.renderer_memory[renderer.id] = { camera: camera }; }
        if (camera && !this.cameras.includes(camera)) { this.push_camera(camera); }

    }

    push_camera(camera: Camera) {
        this.cameras.push(camera);
    }

    fire_event(event_name: string, context: any) {
        if (this.events_map[event_name]) {
            for (let entity of Object.values(this.events_map[event_name])) {
                if (entity.event_listeners[event_name]) {
                    for (let [behavior_id, behavior_parameters] of Object.entries(entity.event_listeners[event_name])) {
                        let behavior_memory = entity.memory[behavior_id];
                        let override_break = behavior_registry[behavior_id].trigger(entity, this, behavior_parameters, behavior_memory, context);
                        if (behavior_parameters.break || override_break) { break; }
                    } 
                }
            }
        } else {
            console.warn(`Firing event ${event_name}, but no entities listening to that event have been found.`)
        }
    }

   

    add_entity(entity: Entity) {
        this.entities[entity.id] = entity;

        for (let tag of entity.tags) {
            if (!this.key_map[tag]) {
                this.key_map[tag] = {};
            }
            this.key_map[tag][entity.id] = entity;
        }

        for (let event_type of Object.keys(entity.event_listeners)) {
            if (!this.events_map[event_type]) {
                this.events_map[event_type] = {};
            }
            this.events_map[event_type][entity.id] = entity;
        }
    }

    remove_entity(entity: Entity) {
        delete this.entities[entity.id];
        for (let tag of entity.tags) {
            if (!this.key_map[tag]) {
                throw new Error('tag desync: entity has tag, but tag is not present in simspace key_map.')
            }
            delete this.key_map[tag][entity.id];
        }

        for (let event_type of Object.keys(entity.event_listeners)) {
            if (!this.events_map[event_type]) {
                throw new Error('tag desync: entity has event listener, but listener is not present in simspace key_map.');
            }
            delete this.events_map[event_type][entity.id];
        }

        this.fire_event('remove_entity', { entity: entity });
    }

    entity_add_tag(entity: Entity, tag: string) {
        if (!this.entities[entity.id]) { throw new Error(`entity ${entity.id} is not in this SimSpace.`) }
        entity.tags.push(tag);

        if (!this.key_map[tag]) {
            this.key_map[tag] = {};
        }
        this.key_map[tag][entity.id] = entity;
    }

    entity_remove_tag(entity: Entity, tag: string) {
        if (!this.entities[entity.id]) { throw new Error(`entity ${entity.id} is not in this SimSpace.`) }
        entity.tags = entity.tags.filter(ele => ele !== tag);

        if (!this.key_map[tag]) {
            throw new Error('tag desync: entity has tag, but tag is not present in simspace key_map.')
        }
        delete this.key_map[tag][entity.id];
    }

    entity_add_event_listener(entity: Entity, event_name: string, behavior_id: string, behavior_parameters: any) {
        if (!behavior_registry[behavior_id]) { throw new Error(`Behavior ${behavior_id} has not been registered. Please create the behavior before assigning the player to it,`); }
        if (!entity.event_listeners[event_name]) {
            entity.event_listeners[event_name] = {};
        }

        if (entity.event_listeners[event_name][behavior_id]) {
            throw new Error(`You have already registered the behavior ${behavior_id} for the event ${event_name} to that entity.`)
        }

        entity.event_listeners[event_name][behavior_id] = behavior_parameters;

        if (!entity.memory[behavior_id]) {
            entity.memory[behavior_id] = {};
        }

        if (!this.events_map[event_name]) {
            this.events_map[event_name] = {};
        }
        this.events_map[event_name][entity.id] = entity;
    }

    draw(tpf: number, canvas: HTMLCanvasElement) {
        for (let renderer of this.renderers) {
            renderer.render(tpf, this.asset_manager, this.renderer_memory[renderer.id].camera, canvas, renderer.entity_finder(this));
        }
    }
}