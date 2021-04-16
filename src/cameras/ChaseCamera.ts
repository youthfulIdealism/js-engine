import Victor from 'victor';

import { Entity } from '../Entity';
import { Camera } from '../Camera';
import { SimSpace } from '../SimSpace';
import { Renderer } from '../Renderer';


export class ChaseCamera extends Camera {
    entity_id: string;

    constructor(location: Victor, entity_id: string) 
    {
        super(location);
        this.entity_id = entity_id;
    }

    update(tpf: number, sim_space: SimSpace) {
        let entity = sim_space.get_entity_by_id(this.entity_id);
        this.location = entity.location.clone().multiply(new Victor(this.zoom, this.zoom));
    }
}