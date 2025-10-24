import { Auth, User, UserDBManager } from '@eng-sof/common';
import { PostDBManager } from './PostDBManager.js';

import express from 'express';
import { Post } from './Post.js';


const app = express();
app.use(express.json());
const port = 8003;

const postManager = new PostDBManager();
const userManager = new UserDBManager();

app.use('/*splat', Auth.validateToken);

app.get('/post', async (req, res) => {
    let status = 500;
    let msg = 'Internal server error.';

    try {
        let result: any[] = [];

        if (req.query.id) {
            result = await postManager.getPost(req.query.id.toString());
            result = result[0];
        } else if (req.query.user) {
            result = await postManager.getPostsFromUser(req.query.user.toString());
            result = result[0];
        } else {
            result = await postManager.getAllPosts();
        }

        status = 200;
        res.status(status);
        res.send({ status: status, message: 'Got post(s)', posts: result });
        return;
    } catch (err: any) {
        console.log(`Failed to get post(s): ${err.message}`);
        msg = err.msg;
        status = 400;
    }

    res.status(status);
    res.send({status: status, message: msg});
});


app.post('/post', async (req, res) => {
    let status = 500;
    let msg = 'Failed to post.';


    try {
        if (!req.body || !req.body.content) {
            throw new Error('No content provided');
        }
        const userEmail = req.get('user');
        if (userEmail) {
            const result = await userManager.getUser(userEmail);

            if (result.length == 1) {
                const author = result[0];
                await postManager.addPost({ author_id: author.u_id, content: req.body.content });
                status = 200;
                msg = 'Posted.'
            }


        }
    } catch (err: any) {
        console.log(`Failed to create post ${err.message}`);
        status = 400;
        msg = 'Invalid Parameters.';
    }


    res.status(status);
    res.send({ message: msg });

});

app.delete('/post', async (req, res) => {
    let status = 500;
    let msg = 'Internal Server Error';
    let postId = '';
    try {

        if (!req.query.id) {
            throw new Error("No Post ID specified.");
        }
        postId = req.query.id.toString();
        const posts = await postManager.getPost(postId);

        if (posts.length > 0) { 
            const post = Post.fromSchema(posts[0]);


            const userEmail = req.get('user');
            if (userEmail) {
                const result = await userManager.getUser(userEmail);
                if (result.length == 1) {
                    const author = User.fromSchema(result[0]);
                    console.log(author);
                    console.log(post);

                    if (author.isAdmin || author.id == post.author_id) {
                        await postManager.deletePost(postId);
                        status = 200;
                        msg = 'Posted.'
                    } else {
                        status = 401;
                        msg = 'You do not have authorization to perform this operation!';
                    }
                }
            } else {
                status = 400;
                msg = "Credentials not specified.";
            }
        } else {
            throw new Error("No such post.");
        }





    } catch (err: any) {
        console.error(`Failed to delete post ${postId}: ${err.message}`);
        status = 400;
        msg = 'Invalid parameters';
    }

    res.status(status);
    res.send(msg);
})

app.listen(port, () => {
    return console.log(`Feed is listening at http://localhost:${port}`);
});