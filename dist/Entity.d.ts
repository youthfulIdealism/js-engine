import Victor from 'victor';
export declare class Entity {
    id: string;
    location: Victor;
    tags: string[];
    event_listeners: {
        [key: string]: {
            [key: string]: any;
        };
    };
    memory: {
        [key: string]: any;
    };
    blackboard: any;
    render_data: {
        [key: string]: any;
    };
    constructor(location: Victor, tags?: string[]);
}
//# sourceMappingURL=Entity.d.ts.map