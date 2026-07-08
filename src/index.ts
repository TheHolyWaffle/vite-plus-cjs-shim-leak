import { resolve } from 'node:path';

export function under(dir: string): string {
    return resolve(dir, 'sub');
}
