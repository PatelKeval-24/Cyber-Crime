import { getDB } from './db.js';
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';

//////////////////////////////////////////////////
// reject the volunnter request
export const rejectBack = async (req,res) =>{
  console.log("back start")
  const db = getDB();
  const collection = db.collection('volunteer');
  const {email} = req.body;

  try {
    await collection.updateOne({email:email},{
    $set:{
      status : "rejected"
    }
  })
  } catch (error) {
    console.log("error in aproval",error)
  }
//  console.log("data is get it",req.body)
res.status(200).send('volunteer rejected  succesfully..');
}

////////////////////////////////////////////////////
//reject the report 
export const rejectedReport = async (req ,res) =>{
  // console.log('got it')
  const id = req.body.id
  // console.log(id);
  
  try {
    const db = getDB();
    const updateReportstatus = await db.collection('report').updateOne({
       _id: new ObjectId(id)},{
        $set:{
          reportStatus : "rejected"
        }
      })
    // const rq = await db.collection('report').find({id})
    //   console.log(rq)
    res.status(200).json({
      status : "succes",
      message : "report rejected succesfully..  ."
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