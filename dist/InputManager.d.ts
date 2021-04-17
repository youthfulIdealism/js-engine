import { SimSpace } from './SimSpace';
import Victor from 'victor';
export declare class InputManager {
    sim_space: SimSpace;
    keyboard: {
        [key: string]: {
            is_down: boolean;
            went_down: boolean;
            went_up: boolean;
        };
    };
    mouse: {
        location: Victor;
        mouse1: {
            is_down: boolean;
            went_down: boolean;
            went_up: boolean;
        };
        mouse2: {
            is_down: boolean;
            went_down: boolean;
            went_up: boolean;
        };
    };
    constructor(sim_space: SimSpace);
    on_key_down(event: KeyboardEvent): void;
    on_key_up(event: KeyboardEvent): void;
    on_mouse_down(event: MouseEvent): void;
    on_mouse_up(event: MouseEvent): void;
    on_mouse_move(event: MouseEvent): void;
    is_key_down(key: string): boolean;
    is_key_up(key: string): boolean;
    is_key_went_down(key: string): boolean;
    is_key_went_up(key: string): boolean;
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=InputManager.d.ts.map