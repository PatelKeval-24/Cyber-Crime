import { MongoClient } from "mongodb";
const url = process.env.URL || 'mongodb+srv://Cyber-Crime:Cyber-Crime@cybercrime.x57ijnd.mongodb.net/';
const client = new MongoClient(url);
const dbName = process.env.DBNAME || 'cyberCrime'; 
let db;



const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

const getDB = () => db;
// const expo = { connectDB, getDB };

export { connectDB, getDB };