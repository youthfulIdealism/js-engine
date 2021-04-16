import { SimSpace } from './SimSpace';
export declare class InputManager {
    sim_space: SimSpace;
    keyboard: {
        [key: string]: {
            is_down: boolean;
            went_down: boolean;
            went_up: boolean;
        };
    };
    constructor(sim_space: SimSpace);
    on_key_down(event: KeyboardEvent): void;
    on_key_up(event: KeyboardEvent): void;
    is_key_down(key: string): boolean;
    is_key_up(key: string): boolean;
    is_key_went_down(key: string): boolean;
    is_key_went_up(key: string): boolean;
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=InputManager.d.ts.map