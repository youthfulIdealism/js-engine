import Victor from 'victor';
import { SimSpace } from './SimSpace';
export declare abstract class Camera {
    location: Victor;
    zoom: number;
    constructor(location: Victor);
    screen_location_to_world_location(canvas: HTMLCanvasElement, location: Victor): Victor;
    abstract update(tpf: number, sim_space: SimSpace): void;
}
//# sourceMappingURL=Camera.d.ts.map