import { SimSpace } from './SimSpace';

export class InputManager {
    sim_space: SimSpace;
    keyboard: {
        [key: string]: {
            is_down: boolean,
            went_down: boolean,
            went_up: boolean,
        }
    };

    constructor(sim_space: SimSpace) {
        this.sim_space = sim_space;
        this.keyboard = {};

        window.addEventListener("keydown", this.on_key_down.bind(this));
        window.addEventListener("keyup", this.on_key_up.bind(this));
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
    }

    destroy() {
        window.removeEventListener("keydown", this.on_key_down);
        window.removeEventListener("keyup", this.on_key_up);
    }
}


