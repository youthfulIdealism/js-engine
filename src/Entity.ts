import Victor from 'victor';
import uuid from 'uuid';

import { behavior_registry } from './Behavior';

export class Entity {
    id: string;
    location: Victor;
    tags: string[];
    event_listeners: { [key: string]: { [key: string]: any } };
    memory: { [key: string]: any };
    blackboard: any;
    render_data: { [key: string]: any };

    constructor(location: Victor, tags: string[] = []) {
        this.id = uuid.v4();
        this.location = location;
        this.tags = tags;
        this.event_listeners = {};
        this.memory = {};
        this.render_data = {};
        this.blackboard = {};
    }
}