import { getDB } from './db.js';
import { ObjectId } from "mongodb";
import { report } from 'node:process';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



////////////////////////////////////////////////////////////////////////////
// fist time report was submited 
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
    crimeDate,
    description,
    status = "Open",
    reportStatus = "pending",
    date = new Date().toString(),
    token
  } = req.body.reportData;
  //submited by = ******
  // console.log('jwt token',token.name);
  // console.log('jwt token',token.email);
  const submitedBy= token.name;
  
  const addReport = db.collection('report').insertOne(
    {name, age,gender,victimAddress,contact,email,crimeType, crimeCategory,priority,location,crimeDate,description,status,reportStatus,date,submitedBy
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
  // console.log('got it')
  const db = getDB();
  const getPendingReports =await db.collection('report').find({reportStatus : "pending"}).toArray()
  console.log(getPendingReports);

  res.status(200).json({
    pendingReport : getPendingReports
  })

}

/////////////////////////////////////////
// report approved

export const approvedReport = async (req ,res) =>{
  // console.log('got it')
  const id = req.body.id
  // console.log(id);
  
  try {
    const db = getDB();
    const updateReportstatus = await db.collection('report').updateOne({
       _id: new ObjectId(id)},{
        $set:{
          reportStatus : "approved"
        }
      })
    // const rq = await db.collection('report').find({id})
    //   console.log(rq)
    res.status(200).json({
      status : "succes",
      message : "report approved succesfully..  ."
    })
    console.log("status ",updateReportstatus);
    
  } catch (error) {
    console.log(error);
    res.json({
      status :"faild",
      message : error
    })
  }
}

//////////////////////////////////////////////////////////
// crimerepository reports 

export const gaveApprovedReport = async (req,res) => {
 try {
  const db = getDB();
  const approvedReport = await db.collection('report').find({reportStatus : "approved"}).toArray()
//  console.log(approvedReport)
  res.status(200).json({
    status : "succes",
    report : approvedReport,
    message : "heare the reports that approved"
  })
 } catch (error) {
  res.status(200).json({
    status : "faild",
    message:  error
  })
 }
}

/////////////////////////////////////////////////////////////////////
// report is selected for investigation

export const investigate = async (req, res) => {
  const db =getDB();
  try {
    const reportId = req.body.id;
    const decoded = jwt.verify(req.body.token.token, "secretkey");
  //  console.log(decoded.email);
    const nameOfInvestigator = [{name :req.body.token.name,
      role:req.body.role,
      email :decoded.email,
      investigationjoinDate : Date().toString()
    }];
  
    console.log(reportId , nameOfInvestigator,req.body.token)
  
    const investigation = await db.collection('report').updateOne({
      _id: new ObjectId(reportId)},
    {
      $set : {
        status :"Under Investigation"
      }
    })
    const investigationDetail = await db.collection('investigation').insertOne({reportId,nameOfInvestigator})

    res.status(200).json({
      status : "succes",
      message : "Task Assigned succesfully"
    })
    
  } catch (error) {
    console.log(error,"error.. .. .. .. .. . . . . . .  .")
    res.status(200).json({
    status : "faild",
    message:  error
    
  })}
}

///////////////////////////////////////////////////////////////////////
// displayed investigation 

export const myIvestigation = async (req , res) => {
  
}
