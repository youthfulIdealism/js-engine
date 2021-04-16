import Victor from 'victor';
import { Camera } from '../Camera';
import { SimSpace } from '../SimSpace';
export declare class ChaseCamera extends Camera {
    entity_id: string;
    constructor(location: Victor, entity_id: string);
    update(tpf: number, sim_space: SimSpace): void;
}
//# sourceMappingURL=ChaseCamera.d.ts.map