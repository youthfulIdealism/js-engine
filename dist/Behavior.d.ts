import { SimSpace } from './SimSpace';
import { Entity } from './Entity';
import { Schema } from './Schema';
export declare let behavior_registry: {
    [key: string]: Behavior;
};
export declare class Behavior {
    id: string;
    trigger: (entity: Entity, sim_space: SimSpace, behavior_parameters: any, memory: any, context: any) => boolean;
    schema: Schema;
    constructor(id: string, trigger: (entity: Entity, sim_space: SimSpace, behavior_parameters: any, context: any) => boolean, schema: Schema);
}
//# sourceMappingURL=Behavior.d.ts.map