import uuid from 'uuid';
import { SimSpace } from './SimSpace';
import { Entity } from './Entity';
import { Schema } from './Schema'


export let behavior_registry: { [key: string]: Behavior } = {};



export class Behavior {
    id: string;
    trigger: (entity: Entity, sim_space: SimSpace, behavior_parameters: any, memory: any, context: any) => boolean;
    schema: Schema;

    constructor(id: string, trigger: (entity: Entity, sim_space: SimSpace, behavior_parameters: any, context: any) => boolean, schema: Schema) {
        this.id = id;
        this.schema = schema;

        if (behavior_registry[id]) { throw new Error(`duplicate behavior id ${id}`); }
        behavior_registry[id] = this;

        this.trigger = trigger;
    }
}