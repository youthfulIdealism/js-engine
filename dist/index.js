'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var uuid = require('uuid');
var Victor = require('victor');
require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var uuid__default = /*#__PURE__*/_interopDefaultLegacy(uuid);
var Victor__default = /*#__PURE__*/_interopDefaultLegacy(Victor);

class Entity {
    constructor(location, tags = []) {
        this.id = uuid__default['default'].v4();
        this.location = location;
        this.tags = tags;
        this.event_listeners = {};
        this.memory = {};
        this.render_data = {};
        this.blackboard = {};
    }
}

class AssetManager {
    constructor() {
        this.images = {};
    }
    get_image(path) {
        let image = this.images[path];
        if (!image) {
            image = new Image();
            image.src = path;
            this.images[path] = image;
        }
        return this.images[path];
    }
}

let behavior_registry = {};
class Behavior {
    constructor(id, trigger, schema) {
        this.id = id;
        this.schema = schema;
        if (behavior_registry[id]) {
            throw new Error(`duplicate behavior id ${id}`);
        }
        behavior_registry[id] = this;
        this.trigger = trigger;
    }
}

function parse_json_victor(key, value) {
    return new Victor__default['default'](value.x, value.y);
}
function parse(key, value) {
    let num_parameters = Object.keys(value).length;
    if (value.x !== undefined && value.y !== undefined && num_parameters == 2) {
        parse_json_victor(key, value);
        return parse_json_victor(key, value);
    }
    return value;
}

class SimSpace {
    constructor() {
        this.entities = {};
        this.key_map = {};
        this.events_map = {};
        this.cameras = [];
        this.renderers = [];
        this.renderer_memory = {};
        this.asset_manager = new AssetManager();
    }
    from_json(json_string) {
        let world_data = JSON.parse(json_string, parse);
        let entity_datas = Object.values(world_data.entities);
        for (let entity_data of entity_datas) {
            // @ts-ignore
            let entity = new Entity(entity_data.location, entity_data.tags);
            Object.assign(entity, entity_data);
            this.add_entity(entity);
        }
    }
    to_json() {
        let world_serialization = {};
        world_serialization.entities = this.entities;
        return JSON.stringify(world_serialization);
    }
    update(tpf) {
        this.fire_event('update', { tpf: tpf });
        for (let camera of this.cameras) {
            camera.update(tpf, this);
        }
    }
    get_entities_with_tag(tag) {
        let entities_with_tag = this.key_map[tag];
        if (entities_with_tag) {
            return Object.values(entities_with_tag);
        }
        return [];
    }
    get_entity_by_id(id) {
        return this.entities[id];
    }
    push_renderer(renderer, camera) {
        this.renderers.push(renderer);
        if (!this.renderer_memory[renderer.id]) {
            this.renderer_memory[renderer.id] = { camera: camera };
        }
        if (camera && !this.cameras.includes(camera)) {
            this.push_camera(camera);
        }
    }
    push_camera(camera) {
        this.cameras.push(camera);
    }
    fire_event(event_name, context) {
        if (this.events_map[event_name]) {
            for (let entity of Object.values(this.events_map[event_name])) {
                if (entity.event_listeners[event_name]) {
                    for (let [behavior_id, behavior_parameters] of Object.entries(entity.event_listeners[event_name])) {
                        let behavior_memory = entity.memory[behavior_id];
                        let override_break = behavior_registry[behavior_id].trigger(entity, this, behavior_parameters, behavior_memory, context);
                        if (behavior_parameters.break || override_break) {
                            break;
                        }
                    }
                }
            }
        }
        else {
            console.warn(`Firing event ${event_name}, but no entities listening to that event have been found.`);
        }
    }
    add_entity(entity) {
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
    remove_entity(entity) {
        delete this.entities[entity.id];
        for (let tag of entity.tags) {
            if (!this.key_map[tag]) {
                throw new Error('tag desync: entity has tag, but tag is not present in simspace key_map.');
            }
            delete this.key_map[tag][entity.id];
        }
        for (let event_type of Object.keys(entity.event_listeners)) {
            if (!this.events_map[event_type]) {
                throw new Error('tag desync: entity has event listener, but listener is not present in simspace key_map.');
            }
            delete this.events_map[event_type][entity.id];
        }
    }
    entity_add_tag(entity, tag) {
        if (!this.entities[entity.id]) {
            throw new Error(`entity ${entity.id} is not in this SimSpace.`);
        }
        entity.tags.push(tag);
        if (!this.key_map[tag]) {
            this.key_map[tag] = {};
        }
        this.key_map[tag][entity.id] = entity;
    }
    entity_remove_tag(entity, tag) {
        if (!this.entities[entity.id]) {
            throw new Error(`entity ${entity.id} is not in this SimSpace.`);
        }
        entity.tags = entity.tags.filter(ele => ele !== tag);
        if (!this.key_map[tag]) {
            throw new Error('tag desync: entity has tag, but tag is not present in simspace key_map.');
        }
        delete this.key_map[tag][entity.id];
    }
    entity_add_event_listener(entity, event_name, behavior_id, behavior_parameters) {
        if (!behavior_registry[behavior_id]) {
            throw new Error(`Behavior ${behavior_id} has not been registered. Please create the behavior before assigning the player to it,`);
        }
        if (!entity.event_listeners[event_name]) {
            entity.event_listeners[event_name] = {};
        }
        if (entity.event_listeners[event_name][behavior_id]) {
            throw new Error(`You have already registered the behavior ${behavior_id} for the event ${event_name} to that entity.`);
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
    draw(tpf, canvas) {
        for (let renderer of this.renderers) {
            renderer.render(tpf, this.asset_manager, this.renderer_memory[renderer.id].camera, canvas, renderer.entity_finder(this));
        }
    }
}

let renderer_registry = {};
class Renderer {
    constructor(id, entity_finder) {
        this.id = id;
        this.entity_finder = entity_finder;
        if (renderer_registry[id]) {
            throw new Error(`duplicate renderer id ${id}`);
        }
        renderer_registry[id] = this;
    }
    static request_canvas(canvas_id, my_uid) {
        let doc_id = canvas_id + '_' + my_uid;
        let canvas = document.getElementById(doc_id);
        if (canvas) {
            return canvas;
        }
        //no canvas was found; generate one.
        let internal_area = document.getElementById('hidden_area_for_js_engine_internals');
        if (!internal_area) {
            throw Error('hidden internals area not found on dom.');
        }
        canvas = document.createElement('canvas');
        canvas.id = doc_id;
        canvas.style.imageRendering = 'pixelated';
        internal_area.appendChild(canvas);
        return canvas;
    }
}

class Camera {
    constructor(location) {
        this.location = location;
        this.zoom = 1;
    }
    screen_location_to_world_location(canvas, location) {
        const rect = canvas.getBoundingClientRect();
        let half_width = (canvas.width / this.zoom) / 2;
        let half_height = (canvas.height / this.zoom) / 2;
        let location_zoomed_x = location.x / this.zoom;
        let location_zoomed_y = location.y / this.zoom;
        return new Victor__default['default'](location_zoomed_x - rect.left + this.location.x / this.zoom - half_width, location_zoomed_y - rect.top + this.location.y / this.zoom - half_height);
    }
}

class InputManager {
    constructor(sim_space) {
        this.sim_space = sim_space;
        this.keyboard = {};
        this.mouse = {
            location: new Victor__default['default'](0, 0),
            mouse1: {
                is_down: false,
                went_down: false,
                went_up: false,
            },
            mouse2: {
                is_down: false,
                went_down: false,
                went_up: false,
            }
        };
        window.addEventListener("keydown", this.on_key_down.bind(this));
        window.addEventListener("keyup", this.on_key_up.bind(this));
        window.addEventListener('mousedown', this.on_mouse_down.bind(this));
        window.addEventListener('mouseup', this.on_mouse_up.bind(this));
        window.addEventListener('mousemove', this.on_mouse_move.bind(this));
    }
    on_key_down(event) {
        let key = event.key;
        if (!this.keyboard[key]) {
            this.keyboard[key] = {
                is_down: true,
                went_down: true,
                went_up: false,
            };
        }
        this.keyboard[key].is_down = true;
        this.keyboard[key].went_down = true;
    }
    on_key_up(event) {
        let key = event.key;
        if (!this.keyboard[key]) {
            this.keyboard[key] = {
                is_down: false,
                went_down: false,
                went_up: true,
            };
        }
        this.keyboard[key].is_down = false;
        this.keyboard[key].went_up = true;
    }
    on_mouse_down(event) {
        if (isNaN(event.clientX) || event.clientX === null || event.clientX === undefined || isNaN(event.clientY) || event.clientY === null || event.clientY === undefined) {
            return;
        }
        let mouse = undefined;
        if (event.button === 0) {
            mouse = this.mouse.mouse1;
        }
        if (event.button === 2) {
            mouse = this.mouse.mouse2;
        }
        if (mouse) {
            mouse.is_down = true;
            mouse.went_down = true;
        }
    }
    on_mouse_up(event) {
        let mouse = undefined;
        if (event.button === 0) {
            mouse = this.mouse.mouse1;
        }
        if (event.button === 2) {
            mouse = this.mouse.mouse2;
        }
        if (mouse) {
            mouse.is_down = false;
            mouse.went_up = true;
        }
    }
    on_mouse_move(event) {
        this.mouse.location = new Victor__default['default'](event.clientX, event.clientY);
    }
    is_key_down(key) {
        if (!this.keyboard[key]) {
            return false;
        }
        return this.keyboard[key].is_down;
    }
    is_key_up(key) {
        if (!this.keyboard[key]) {
            return true;
        }
        return !this.keyboard[key].is_down;
    }
    is_key_went_down(key) {
        if (!this.keyboard[key]) {
            return false;
        }
        return this.keyboard[key].went_down;
    }
    is_key_went_up(key) {
        if (!this.keyboard[key]) {
            return false;
        }
        return this.keyboard[key].went_up;
    }
    update() {
        for (let keydata of Object.values(this.keyboard)) {
            keydata.went_down = false;
            keydata.went_up = false;
        }
        this.mouse.mouse1.went_down = false;
        this.mouse.mouse1.went_up = false;
        this.mouse.mouse2.went_down = false;
        this.mouse.mouse2.went_up = false;
    }
    destroy() {
        window.removeEventListener("keydown", this.on_key_down);
        window.removeEventListener("keyup", this.on_key_up);
        window.removeEventListener("mousedown", this.on_mouse_down);
        window.removeEventListener("mouseup", this.on_mouse_up);
        window.removeEventListener("mousemove", this.on_mouse_move);
    }
}

class ImageRenderer extends Renderer {
    get schema() {
        return {
            'image': 'string',
        };
    }
    render(tpf, asset_manager, camera, main_canvas, entities) {
        let renderer = main_canvas.getContext('2d');
        if (!renderer) {
            throw new Error('Renderer is null');
        }
        renderer.resetTransform();
        renderer.imageSmoothingEnabled = false;
        renderer.translate(-camera.location.x + main_canvas.width / 2, -camera.location.y + main_canvas.height / 2);
        renderer.scale(camera.zoom, camera.zoom);
        for (let entity of entities) {
            let image_path = entity.render_data[this.id].image;
            if (!image_path) {
                continue;
            }
            let image = asset_manager.get_image(entity.render_data[this.id].image);
            renderer.drawImage(image, entity.location.x - image.width / 2, entity.location.y - image.height / 2);
        }
    }
}

class BlockRenderer extends Renderer {
    get schema() {
        return {
            'width': 'number',
            'height': 'number',
            'color': 'string',
        };
    }
    render(tpf, asset_manager, camera, main_canvas, entities) {
        let renderer = main_canvas.getContext('2d');
        if (!renderer) {
            throw new Error('Renderer is null');
        }
        renderer.resetTransform();
        renderer.imageSmoothingEnabled = false;
        renderer.translate(-camera.location.x + main_canvas.width / 2, -camera.location.y + main_canvas.height / 2);
        renderer.scale(camera.zoom, camera.zoom);
        for (let entity of entities) {
            renderer.fillStyle = entity.render_data[this.id].color;
            let width = entity.render_data[this.id].width;
            let height = entity.render_data[this.id].height;
            renderer.fillRect(entity.location.x - width / 2, entity.location.y - height / 2, width, height);
        }
    }
}

class AnimationRenderer extends Renderer {
    get schema() {
        return {
            'image': 'string',
        };
    }
    render(tpf, asset_manager, camera, main_canvas, entities) {
        let renderer = main_canvas.getContext('2d');
        if (!renderer) {
            throw new Error('Renderer is null');
        }
        renderer.resetTransform();
        renderer.imageSmoothingEnabled = false;
        renderer.translate(-camera.location.x + main_canvas.width / 2, -camera.location.y + main_canvas.height / 2);
        renderer.scale(camera.zoom, camera.zoom);
        for (let entity of entities) {
            let animation = entity.memory.animation;
            let animation_frames = animation.frames;
            if (!animation) {
                return;
            }
            if (!animation_frames) {
                return;
            }
            if (!entity.memory.animation_progress) {
                entity.memory.animation_progress = 0;
            }
            if (!entity.memory.animation_current_frame) {
                entity.memory.animation_current_frame = 0;
            }
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
            if (!image_path) {
                continue;
            }
            let image = asset_manager.get_image(image_path);
            renderer.drawImage(image, entity.location.x - image.width / 2, entity.location.y - image.height / 2);
        }
    }
}

class MaskRenderer extends Renderer {
    constructor(id, entity_finder, texture_image_url, move_with_camera = false) {
        super(id, entity_finder);
        this.texture_image_url = texture_image_url;
        this.move_with_camera = move_with_camera;
    }
    get schema() {
        return {
            'image': 'string',
        };
    }
    render(tpf, asset_manager, camera, main_canvas, entities) {
        let mask_canvas = Renderer.request_canvas('mask', this.id);
        let mask_texture_canvas = Renderer.request_canvas('mask_texture', this.id);
        let renderer = main_canvas.getContext('2d');
        let mask_renderer = mask_canvas.getContext('2d');
        let mask_texture_renderer = mask_texture_canvas.getContext('2d');
        if (!renderer) {
            throw new Error('Renderer is null');
        }
        if (!mask_renderer) {
            throw new Error('Mask Renderer is null');
        }
        if (!mask_texture_renderer) {
            throw new Error('Mask Texture Renderer is null');
        }
        renderer.imageSmoothingEnabled = false;
        mask_renderer.imageSmoothingEnabled = false;
        mask_texture_renderer.imageSmoothingEnabled = false;
        if (mask_canvas.width !== main_canvas.width) {
            let mask_texture = asset_manager.get_image(this.texture_image_url);
            if (mask_texture.width === 0 || mask_texture.height === 0) {
                return;
            }
            mask_canvas.width = main_canvas.width;
            mask_canvas.height = main_canvas.height;
            let width_counts = 0;
            let height_counts = 0;
            /*
             * set up a loopable texture
             * */
            while (mask_texture.width * width_counts < main_canvas.width * 2) {
                width_counts++;
            }
            while (mask_texture.height * height_counts < main_canvas.height * 2) {
                height_counts++;
            }
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
            let image_path = entity.render_data[this.id].image;
            if (!image_path) {
                continue;
            }
            let image = asset_manager.get_image(entity.render_data[this.id].image);
            mask_renderer.drawImage(image, entity.location.x - image.width / 2, entity.location.y - image.height / 2);
        }
        //draw the texture image onto the mask
        mask_renderer.resetTransform();
        mask_renderer.globalCompositeOperation = "source-in";
        if (this.move_with_camera) {
            // TODO: this fails if the camera location is negative.
            mask_renderer.drawImage(mask_texture_canvas, -(camera.location.x % (mask_texture_canvas.width / 2)), -(camera.location.y % (mask_texture_canvas.height / 2)));
        }
        else {
            mask_renderer.drawImage(mask_texture_canvas, 0, 0);
        }
        //draw the masked texture image onto the main canvas
        renderer.resetTransform();
        renderer.drawImage(mask_canvas, 0, 0);
    }
}

class WholeScreenRenderer extends Renderer {
    constructor(id, entity_finder, texture_image_url, move_with_camera = false) {
        super(id, entity_finder);
        this.texture_image_url = texture_image_url;
        this.move_with_camera = move_with_camera;
    }
    get schema() {
        return {
            'image': 'string',
        };
    }
    render(tpf, asset_manager, camera, main_canvas, entities) {
        let renderer = main_canvas.getContext('2d');
        if (!renderer) {
            throw new Error('Renderer is null');
        }
        let image = asset_manager.get_image(this.texture_image_url);
        if (image.width === 0 || image.height === 0) {
            console.log('no image');
            return;
        }
        renderer.imageSmoothingEnabled = false;
        let width_counts = 0;
        let height_counts = 0;
        while (image.width * width_counts < main_canvas.width * 2) {
            width_counts++;
        }
        while (image.height * height_counts < main_canvas.height * 2) {
            height_counts++;
        }
        //draw the mask
        renderer.resetTransform();
        if (this.move_with_camera) {
            // TODO: this fails if the camera location is negative.
            for (let x = 0; x < width_counts; x++) {
                for (let y = 0; y < height_counts; y++) {
                    renderer.drawImage(image, -(camera.location.x % image.width) + x * image.width, -(camera.location.y % image.height) + y * image.height);
                }
            }
        }
        else {
            console.log('draw here');
            renderer.drawImage(image, 0, 0);
            for (let x = 0; x < width_counts; x++) {
                for (let y = 0; y < height_counts; y++) {
                    renderer.drawImage(image, x * image.width, y * image.height);
                }
            }
        }
    }
}

class ChaseCamera extends Camera {
    constructor(location, entity_id) {
        super(location);
        this.entity_id = entity_id;
    }
    update(tpf, sim_space) {
        let entity = sim_space.get_entity_by_id(this.entity_id);
        this.location = entity.location.clone().multiply(new Victor__default['default'](this.zoom, this.zoom));
    }
}

let behavior_change_animation = new Behavior('change_animation', (entity, sim_space, behavior_parameters, context) => {
    if (!behavior_parameters.change_to) {
        return false;
    }
    if (!behavior_parameters.priority) {
        behavior_parameters.priority = 0;
    }
    if (!entity.memory.animations) {
        console.log(`no animation found.`);
        return false;
    }
    if (!entity.memory.animations[behavior_parameters.change_to]) {
        console.log(`animation ${behavior_parameters.change_to} not found.`);
        return false;
    }
    if (entity.memory.animation.interruptable === false || entity.memory.priority > behavior_parameters.priority) {
        return false;
    }
    entity.memory.animation = entity.memory.animation = entity.memory.animations[behavior_parameters.change_to];
    entity.memory.animation_progress = 0;
    return false;
}, { 'change_to': 'string', 'priority': 'number' });

let hidden_area = document.createElement('div');
hidden_area.id = 'hidden_area_for_js_engine_internals';
hidden_area.style.display = 'none';
document.body.appendChild(hidden_area);

exports.AnimationRenderer = AnimationRenderer;
exports.Behavior = Behavior;
exports.BlockRenderer = BlockRenderer;
exports.Camera = Camera;
exports.ChaseCamera = ChaseCamera;
exports.Entity = Entity;
exports.ImageRenderer = ImageRenderer;
exports.InputManager = InputManager;
exports.MaskRenderer = MaskRenderer;
exports.Renderer = Renderer;
exports.SimSpace = SimSpace;
exports.WholeScreenRenderer = WholeScreenRenderer;
exports.behavior_change_animation = behavior_change_animation;
exports.behavior_registry = behavior_registry;
exports.renderer_registry = renderer_registry;
