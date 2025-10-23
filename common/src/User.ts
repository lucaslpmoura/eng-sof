import { Entity } from './Entity.js';
import { EntityType } from './EntityType.js';

import { encryptPassword } from './Encryption.js';

export class User extends Entity{
    
    username: string;
    email: string;
    password: string;

    sqlColumns: string[] = ['u_id','createdtime','e_type','username','email','pword'];

    constructor(username: string, email: string, password: string) {
        super(EntityType.USER);
        this.username = username;
        this.email = email;
        this.password = encryptPassword(password);
    }

    public toSchema() : any {
        return {
            'u_id': this.id,
            'createdtime': this.createdTime,
            'e_type': this.type,
            'username': this.username,
            'email': this.email,
            'pword': this.password
        }
    }
}