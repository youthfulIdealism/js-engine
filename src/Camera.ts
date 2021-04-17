import Victor from 'victor';
import { SimSpace } from './SimSpace';

export abstract class Camera {
    location: Victor;
    zoom: number;

    constructor(location: Victor) {
        this.location = location;
        this.zoom = 1;
    }

    screen_location_to_world_location(canvas: HTMLCanvasElement, location: Victor): Victor {
        const rect = canvas.getBoundingClientRect()

        let half_width = (canvas.width / this.zoom) / 2;
        let half_height =( canvas.height / this.zoom) / 2;

        let location_zoomed_x = location.x / this.zoom;
        let location_zoomed_y = location.y / this.zoom;


        return new Victor(location_zoomed_x - rect.left + this.location.x / this.zoom - half_width, location_zoomed_y - rect.top + this.location.y / this.zoom - half_height);
    }

    abstract update(tpf: number, sim_space: SimSpace): void
}