import { EntityType } from "./EntityType";
import { generateEntityId } from "./UUIDGenerator";

export abstract class Entity {
    id: string;
    createdTime: string;
    type: EntityType;

    constructor(type: EntityType){
        this.id = generateEntityId();
        this.createdTime = Date.now().toString();
        this.type = type;

    }
}