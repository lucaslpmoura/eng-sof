import { EntityType } from "./EntityType.js";
import { generateEntityId } from "./UUIDGenerator.js";

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