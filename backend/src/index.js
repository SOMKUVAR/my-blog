const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { withDb } = require('./db-connection');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/api/articles',(req,res) => {
    withDb(async(db) => {
        const articles = await db.collection('articles').find({}).toArray((err, items) => {
            if (err) {
                res.send(err);
                return;
            }
            return items;});
        res.send(articles);
    },res)
})

app.get('/api/article/:name', (req, res) => {
    withDb(async (db) => {
        const articleName = req.params.name;
        const articleDetail = await db.collection('articles').findOne({ name: articleName });
        res.send(articleDetail);
    }, res);
})



app.post('/api/article/:name/add-comments', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;
    withDb(async (db) => {
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({ name: articleName }, {
            $set: {
                comments: articleInfo.comments.concat({ username, text })
            }
        })
        const updatedArticleInfo = await db.collection('articles').findOne({name:articleName});
        res.send(updatedArticleInfo);
    }, res)
}
)


app.listen(8081, () => console.log('Server is running'));