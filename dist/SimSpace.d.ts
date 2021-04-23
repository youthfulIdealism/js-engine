import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { Entity } from './Entity';
import { AssetManager } from './AssetManager';
export declare class SimSpace {
    entities: {
        [key: string]: Entity;
    };
    key_map: {
        [key: string]: {
            [key: string]: Entity;
        };
    };
    events_map: {
        [key: string]: {
            [key: string]: Entity;
        };
    };
    cameras: Camera[];
    renderers: Renderer[];
    renderer_memory: {
        [key: string]: any;
    };
    asset_manager: AssetManager;
    constructor();
    from_json(json_string: string): void;
    to_json(): string;
    update(tpf: number): void;
    get_entities_with_tag(tag: string): Entity[];
    get_entity_by_id(id: string): Entity;
    push_renderer(renderer: Renderer, camera: Camera): void;
    push_camera(camera: Camera): void;
    fire_event(event_name: string, context: any): void;
    add_entity(entity: Entity): void;
    remove_entity(entity: Entity): void;
    entity_add_tag(entity: Entity, tag: string): void;
    entity_remove_tag(entity: Entity, tag: string): void;
    entity_add_event_listener(entity: Entity, event_name: string, behavior_id: string, behavior_parameters: any): void;
    draw(tpf: number, canvas: HTMLCanvasElement): void;
}
//# sourceMappingURL=SimSpace.d.ts.map