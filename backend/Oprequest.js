import {  getDB } from './db.js';
import { ObjectId } from 'mongodb';


//////////////////////////////////////////////////////////

export const getRequestHandler = (async (req , res)=>{
  
  const db = getDB();
  const collection = db.collection('volunteer');

  const requestData = await collection.find({status : "pending"}).toArray()
  res.status(200).json({
   result: requestData
  })
  });

////////////////////////////////////////////////////////////

export const aprovedBack = ( async (req , res) => {
  console.log("back start")
  const db = getDB();
  const collection = db.collection('volunteer');
  const {email} = req.body;

  try {
    await collection.updateOne({email:email},{
    $set:{
      status : "approved"
    }
  })
  } catch (error) {
    console.log("error in aproval",error)
  }

//  console.log("data is get it",req.body)

res.status(200).send('volunteer Approved  succesfully..');

})


///////////////////////////////////////////////////////////

export const rejectBack = ( async (req , res) => {
  console.log("back start")
  const db = getDB();
  const collection = db.collection('volunteer');

  const statusAproved = await collection.updateOne({email:email},{
    $set:{
      status : "aproved"
    }
  })

 console.log("data is get it",req.body , req.header)
})


////////////////////////////////////////////////////
// volunteer data gettin from back-end

export const  volunteerData = ( async (req , res) =>{

  const db = getDB()
  const collection = db.collection('volunteer')

  const volunteerInfo = await collection.find({}).toArray()
  if(!volunteerInfo){
    res.status(200).send('data not found')
  }else{
    try {
      res.status(200).json({
        volunteer : volunteerInfo
      })
    } catch (error) {
      console.log(error)
    }
  }

}

)