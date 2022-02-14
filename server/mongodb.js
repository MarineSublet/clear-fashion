const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://Marine:Marine@clusterclearfashion.fnohe.mongodb.net?retryWrites=true&writeConcern=majority'
;
const MONGODB_DB_NAME = 'ClusterClearFashion';

let db=null;

const connect = module.exports.connect = async () => { 
    try {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME)
    //console.log(db);
    console.log("connecting");
    }
    catch(error){
        console.error(error);
    }
}

//connect()

const insert = module.exports.insert = async products => { 
    try {
        //db = await connect()
        const collection = db.collection('products');
        const result = collection.insertMany(products,{'ordered': false});
      
        return result;
    }
    catch(error){
        console.error(error);
    return null;}
}