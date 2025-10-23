import { Entity } from './Entity.js';
import { EntityType } from './EntityType.js';

import { encryptPassword } from './Encryption.js';

export class User extends Entity{
    
    username: string;
    email: string;
    password: string;

    constructor(username: string, email: string, password: string) {
        super(EntityType.USER);
        this.username = username;
        this.email = email;
        this.password = encryptPassword(password);
    }
}