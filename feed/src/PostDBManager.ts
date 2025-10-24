import { DBManager } from "@eng-sof/common";
import { Post } from "./Post.js";

export class PostDBManager extends DBManager{
    maxSize = 1000;

    constructor(){
        super();
        this.table = 'posts';
    }
    public async addPost(postData: any){
        try{
            const newPost = new Post(postData.author_id, postData.content);

            this.insert(newPost.toSchema()).then(async () => {
                try {
                        const result = await this.getPost(newPost.id);
                        
                        if (result.length == 1 && result[0].u_id == newPost.id) {
                            console.log("Post add succesfully.");
                        } else {
                            throw new Error("DB Query Error");
                        }
                    } catch (err: any) {
                        console.log(`Error adding post: ${err.message}`)
                    }
            }); 
        }catch(err){
            throw err;
        }
    }
    public async getAllPosts() : Promise<any> {
        return await this.fetchAll()
    }

    public async getPost(id: string): Promise<any> {
        return await this.fetch('u_id', id);
    }

    public async getPostsFromUser(user_id: string) : Promise<any> {
        return await this.fetch('author_id', user_id);
    }

    public async deletePost(id: string) : Promise<any> {
        return await this.delete('u_id', id);
    }
}
