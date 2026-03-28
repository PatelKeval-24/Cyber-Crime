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
// volunteer approved 
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

////////////////////////////////////////////////////
// volunteer data gettin from back-end

export const  volunteerData = ( async (req , res) =>{
 try {
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
       res.status(200).json({
         message : error
       })
     }
   }
  
 } catch (error) {
  console.log(error)
       res.status(200).json({
         message : error
       })
 }
})

////////////////////////////////////////////////////////
// making the volunnteer admin 
export const makeAdmin = (async (req,res) =>{
  try {
    const db = getDB();
    const volunteer = await db.collection('volunteer').find({status : "approved"}).toArray();
    // console.log(volunteer)
    if(!volunteer){
      res.status(200).send('data not found')
    }else{
      try {
        res.status(200).json({
          volunteer : volunteer
        })
      } catch (error) {
        console.log(error)
       res.status(200).json({
         message : error
       })
      }
    }
    
  } catch (error) {
    console.log(error)
       res.status(200).json({
         message : error
       })
  }
})

////////////////////////////////////////////////////////////////////
// fatch the volunteer from volunteer db and save it in the admin db
export const makeAdminFromVolunteer =async (req,res) => {
  console.log(req.body.email,'user')
  // const email = req.body.email
  try {
    const db = getDB();
    const volunteer = await db.collection('volunteer').find({email:req.body.email}).toArray();
    // console.log(volunteer,'db ')
    const [{name,email,contectNumber,address,password,registerTime,status,adminDate= new Date().toString() }] =volunteer
    const role = 'admin'
    if (!volunteer || volunteer.length === 0) {
    return res.status(404).json({ message: 'No data found' });
}else{
    try {
      const admin = await db.collection('admin').insertOne({name,email,contectNumber,address,password,registerTime,role,status,adminDate })
      res.status(200).json({ 
        message:'succesfully volunteer pramoted to admin'
      })
      try {
      const volunteer = await db.collection('volunteer').deleteOne({email:req.body.email})
      } catch (error) {
        console.log(error) 
       res.status(200).json({
         message : error
       })
      }

    } catch (error) {
      console.log(error)
       res.status(200).json({
         message : error
       })
    }}
    
  } catch (error) {
    console.log(error)
       res.status(200).json({
         message : error
       })
  }
}  