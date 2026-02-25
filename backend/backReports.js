import React from 'react'
import { connectDB, getDB } from './db.js';

connectDB();


const backReport = async (req,res) =>{
  

  const db = getDB();
  const collection = await db.listCollections({name : "report"}).toArray();
  const reportData = () => {
      const {name,
    age,
    gender,
    victimAddress,
    contact,
    email,
    crimeType,
    crimeCategory,
    priority,
    location,
    description,
    reportStatus = "pending",
    date = new Date().toString(), 
  } = req.body.reportData;
  //submited by = ******
  console.log(name,
    age,
    gender,
    victimAddress,
    contact,
    email,
    crimeType,
    crimeCategory,
    priority,
    location,
    description, 'report data');
  
  const addReport = db.collection('report').insertOne(
    {name, age,gender,victimAddress,contact,email,crimeType, crimeCategory,priority,location,description,reportStatus,date
    }) 
    console.log(req);
    
      res.send("data get it succesfully")
      
  }
  if (collection.length>0){
    reportData();
  }else{
    db.createCollection("report")
    reportData();
  }


}

export default backReport
//admin