import { Entity, EntityType } from "@eng-sof/common";
import { User } from '@eng-sof/common';

export class Post extends Entity {

    author_id: string;
    content: string;

    constructor(author_id: string, content: string) {
        super(EntityType.POST);


        if (content.length > 1024) {
            throw new PostError('Maximum Content Length is 1024', PostErrorType.TOO_LONG);
        }

        this.content = content;
        this.author_id = author_id;

    }

    public toSchema() : any {
        return {
            u_id: this.id,
            createdtime: this.createdTime,
            e_type: this.type,
            p_content: this.content,
            author_id: this.author_id
        }
    }

    public static fromSchema(schema : any) : Post {
        let post = new Post(
            schema.author_id, schema.p_content
        );
        post.createdTime = schema.createdtime;
        post.id = schema.u_id;

        return post;
    }
}

class PostError extends Error {
    type: PostErrorType;

    constructor(msg: string, type: PostErrorType) {
        super(msg);
        this.type = type;
    }
}

enum PostErrorType {
    TOO_LONG
}