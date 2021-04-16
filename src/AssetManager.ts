
export class AssetManager {
    images:  { [key: string]: HTMLImageElement };

    constructor() {
        this.images = {};
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
}