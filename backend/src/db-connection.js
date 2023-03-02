const {MongoClient} = require('mongodb');

const connectionString = 'mongodb+srv://iuc:iuc@cluster0.usc6ocs.mongodb.net/my-blog';

const withDb = async(operation,res) =>{
    try{
         const client = await MongoClient.connect(connectionString,{useNewUrlParser:true});
         const db = client.db('my-blog');
         await operation(db);
         client.close();
    }
    catch(err){
          res.send('Server error');
          console.log(err);
    }
}

module.exports = {withDb};