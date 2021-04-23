import { Entity } from './Entity';
import { SimSpace } from './SimSpace';
import { Behavior, behavior_registry } from './Behavior';
import { Renderer, renderer_registry } from './Renderer';
import { Camera } from './Camera';
import { InputManager } from './InputManager';
import { ImageRenderer } from './renderers/ImageRenderer';
import { BlockRenderer } from './renderers/BlockRenderer';
import { AnimationRenderer } from './renderers/AnimationRenderer';
import { MaskRenderer } from './renderers/MaskRenderer';
import { WholeScreenRenderer } from './renderers/WholeScreenRenderer';
import { ChaseCamera } from './cameras/ChaseCamera';
import { behavior_change_animation } from './behaviors/BehaviorChangeAnimation';
import { behavior_play_sound } from './behaviors/BehaviorPlaySound';

export { Entity, SimSpace, Behavior, Renderer, Camera, ImageRenderer, BlockRenderer, MaskRenderer, ChaseCamera, InputManager, WholeScreenRenderer, AnimationRenderer, behavior_registry, renderer_registry, behavior_change_animation, behavior_play_sound };

let hidden_area = document.createElement('div');
hidden_area.id = 'hidden_area_for_js_engine_internals';
hidden_area.style.display = 'none';
document.body.appendChild(hidden_area);