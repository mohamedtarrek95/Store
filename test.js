const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://mohamedhossam1640_db_user:13467955@cluster0.snzno24.mongodb.net/store?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected!");
  await client.close();
}

run().catch(console.error);