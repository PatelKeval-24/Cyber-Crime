import { MongoClient } from "mongodb";
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'cyberCrime'; 
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