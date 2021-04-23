
export class AssetManager {
    images: { [key: string]: HTMLImageElement };
    sounds: { [key: string]: HTMLAudioElement };

    constructor() {
        this.images = {};
        this.sounds = {};
    }

    get_image(path: string): HTMLImageElement {
        let image = this.images[path]
        if (!image) {
            image = new Image();
            image.src = path;
            this.images[path] = image;
        }

        return this.images[path];
    }

    get_sound(path: string): HTMLAudioElement {
        let sound = this.sounds[path]
        if (!sound) {
            sound = new Audio();
            sound.src = path;
            this.sounds[path] = sound;
        }

        return this.sounds[path];
    }
}