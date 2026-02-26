import React from 'react'
import { connectDB, getDB } from './db.js';
import { log } from 'node:console';


connectDB();

export const backReport = async (req,res) =>{
  
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
    token
  } = req.body.reportData;
  //submited by = ******
  // console.log('jwt token',token.name);
  // console.log('jwt token',token.email);
  const submitedBy= token.name;
  
  const addReport = db.collection('report').insertOne(
    {name, age,gender,victimAddress,contact,email,crimeType, crimeCategory,priority,location,description,reportStatus,date,submitedBy
    }) 
    // console.log(req);
    
      res.send("data get it succesfully")
      
  }
  if (collection.length>0){
    reportData();
  }else{
    db.createCollection("report")
    reportData();
  }


}

export const giveReports =async (req , res) =>{
  console.log('got it')
  const db = getDB();
  const getPendingReports =await db.collection('report').find({reportStatus : "pending"}).toArray()
  console.log(getPendingReports);

  res.status(200).json({
    pendingReport : getPendingReports
  })

}