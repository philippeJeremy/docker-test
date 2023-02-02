const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
let count;

MongoClient.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}db`, { useUnifiedTopology: true },
    (err, client) => {
        if (err) {
            console.error(err);
        } else {
            console.info('CONNEXION DB OK');
            count = client.db('test').collection('count');
        }
    }
);

app.get('/', (req, res) => {
    count
        .findOneAndUpdate({}, { $inc: { count: 1 } }, { returnNewDocument: true, upsert: true })
        .then((doc) => {
            const count = doc.value;
            res.status(200).json(count ? count.count : 0);
        });
});

app.listen(80);