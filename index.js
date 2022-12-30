const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { json } = require('express/lib/response');
const uri = "mongodb+srv://taskUser:FmFSKfGXgKRjNDK8@cluster0.j88am2v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function run() {
    try {
        const taskCollection = client.db("taskManager").collection("tasks");
        const completeCollection = client.db("taskManager").collection("complete");

        app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find({}).toArray();
            res.send(result);
        })
        app.get('/completed', async (req, res) => {
            const result = await completeCollection.find({}).toArray();
            res.send(result);
        })
        app.post('/completed', async (req, res) => {
            const task = req.body;
            const result = await completeCollection.insertOne(task);
            res.send(result);
        })
        app.get('/completed/:email', async (req, res) => {
            const id = req.params.email;
            const query = { email: id };
            const result = await completeCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/tasks/:email', async (req, res) => {
            const id = req.params.email;
            const query = { email: id };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })
        app.delete("/tasks/:id", async (req, res) => {
            const { id } = req.params;
            const result = await taskCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });
        app.delete("/completed/:id", async (req, res) => {
            const { id } = req.params;
            const result = await completeCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

    }
    finally {

    }
}

run();


app.get('/', (req, res) => {
    res.send('This is task server')
})
app.listen(port, () => {
    console.log('Server is running at ', port)
})