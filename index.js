const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whnxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('connected to database');
        const database = client.db('car_machanuic')
        const servicesCollection = database.collection('services');

        //GET API

        app.get('/services',async(req, res)=>{
           
           const cursor = servicesCollection.find({})
           const services = await cursor.toArray();
           res.send(services);

        })


   //Get single service
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('gitting sjjsf', id)
            const query = {_id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        //post api
        app.post('/services', async(req,res)=>{
            const service = req.body;
           console.log('hit the api',service)

             const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result)
        });

        //delete api
        app.delete('/services/:id', async(req,res)=>{
          const id = req.params.id; 
          const query ={_id:ObjectId(id)};
          const result = await servicesCollection.deleteOne(query)
          res.json(result)
        })


    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req, res) => {
res.send('Running Genius Server')
});
app.listen(port, ()=>{
    console.log('Running Genius Server on port',port);

});




 
