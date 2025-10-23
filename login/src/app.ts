import express from 'express';

const app = express();
app.use(express.json());
const port = 8002;

app.get('/users', async (req, res) => {
});

app.listen(port, () => {
    return console.log(`Login Service is listening at http://localhost:${port}`);
});