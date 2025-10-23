import { sha256 } from 'js-sha256';

export function encryptPassword(password: string){
    return sha256(password);
}