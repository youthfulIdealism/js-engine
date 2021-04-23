export declare class AssetManager {
    images: {
        [key: string]: HTMLImageElement;
    };
    sounds: {
        [key: string]: HTMLAudioElement;
    };
    constructor();
    get_image(path: string): HTMLImageElement;
    get_sound(path: string): HTMLAudioElement;
}
//# sourceMappingURL=AssetManager.d.ts.map