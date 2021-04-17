import { SimSpace } from './SimSpace';
import Victor from 'victor';

export class InputManager {
    sim_space: SimSpace;
    keyboard: {
        [key: string]: {
            is_down: boolean,
            went_down: boolean,
            went_up: boolean,
        }
    };
    mouse: {
        location: Victor
        mouse1: {
            is_down: boolean,
            went_down: boolean,
            went_up: boolean,
        },
        mouse2: {
            is_down: boolean,
            went_down: boolean,
            went_up: boolean,
        }
    };

    constructor(sim_space: SimSpace) {
        this.sim_space = sim_space;
        this.keyboard = {};
        this.mouse = {
            location: new Victor(0, 0),
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

    on_key_down(event: KeyboardEvent) {
        let key = event.key;
        if (!this.keyboard[key]) {
            this.keyboard[key] = {
                is_down: true,
                went_down: true,
                went_up: false,
            }
        }

        this.keyboard[key].is_down = true;
        this.keyboard[key].went_down = true;
    }

    on_key_up(event: KeyboardEvent) {
        let key = event.key;

        if (!this.keyboard[key]) {
            this.keyboard[key] = {
                is_down: false,
                went_down: false,
                went_up: true,
            }
        }

        this.keyboard[key].is_down = false;
        this.keyboard[key].went_up = true;
    }

    on_mouse_down(event: MouseEvent) {
        if (isNaN(event.clientX) || event.clientX === null || event.clientX === undefined || isNaN(event.clientY) || event.clientY === null || event.clientY === undefined) { return; }

        let mouse = undefined;
        if (event.button === 0) { mouse = this.mouse.mouse1; }
        if (event.button === 2) { mouse = this.mouse.mouse2; }

        if (mouse) {
            mouse.is_down = true;
            mouse.went_down = true;
        }
    }

    on_mouse_up(event: MouseEvent) {
        let mouse = undefined;
        if (event.button === 0) { mouse = this.mouse.mouse1; }
        if (event.button === 2) { mouse = this.mouse.mouse2; }

        if (mouse) {
            mouse.is_down = false;
            mouse.went_up = true;
        }
    }

    on_mouse_move(event: MouseEvent) {
        this.mouse.location = new Victor(event.clientX, event.clientY);
    }

    is_key_down(key: string): boolean {
        if (!this.keyboard[key]) { return false; }
        return this.keyboard[key].is_down;
    }

    is_key_up(key: string): boolean {
        if (!this.keyboard[key]) { return true; }
        return !this.keyboard[key].is_down;
    }

    is_key_went_down(key: string): boolean {
        if (!this.keyboard[key]) { return false; }
        return this.keyboard[key].went_down;
    }

    is_key_went_up(key: string): boolean {
        if (!this.keyboard[key]) { return false; }
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


