import Victor from 'victor';

export function parse_json_victor(key: string, value: any): any {
    return new Victor(value.x, value.y);
}

export function parse(key: string, value: any): any {
    let num_parameters = Object.keys(value).length;
    if (value.x !== undefined && value.y !== undefined && num_parameters == 2) { parse_json_victor(key, value); return parse_json_victor(key, value); }
    return value;
}