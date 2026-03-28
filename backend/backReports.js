import { getDB } from './db.js';
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


// 1. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});


// cludinary storage 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // 1. Determine the folder
    let folderName = 'crime_reports/general_evidence';
    if (file.fieldname === 'userPhoto') {
      folderName = 'crime_reports/identity_verification';
    }

    // 2. Check the extension/mimetype
    // Images use 'image', everything else (PDF, Doc, etc.) must use 'raw'
    const isImage = file.mimetype.startsWith('image/');

    return {
      folder: folderName,
      // If it's an image, use 'image'. If it's a PDF/File, use 'raw'.
      resource_type: isImage ? 'image' : 'raw', 
      public_id: `${file.fieldname}_${Date.now()}`,
      // Remove allowed_formats here so Cloudinary doesn't force 'image' type
    };
  },
});

// create stoarge 
export const uploadFields = multer({ storage: storage }).fields([
  { name: 'evidence', maxCount: 5 },
  { name: 'userPhoto', maxCount: 1 }
]);

////////////////////////////////////////////////////////////////////////////
// fist time report was submited 

export const backReport = async (req,res) =>{
  // console.log('Request Body:', req.body);
  console.log('Files Received:', req.cookies);
  const decoded = jwt.verify(req.cookies.token, process.env.JWTKEY ||"secretkey");
  
  try {
    const db = getDB();

    // 1. Process Evidence Files (Multiple)
    const evidenceFiles = req.files['evidence'] || [];
    const evidenceList = evidenceFiles.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      uploadedAt: new Date()
    }));

    // 2. Process User Identity Photo (Single)
    const identityFile = req.files['userPhoto'] ? req.files['userPhoto'][0] : null;
    const verificationData = identityFile ? {
      url: identityFile.path,
      publicId: identityFile.filename,
      capturedAt: new Date(),
      isVerified: true // Since it passed the frontend face-api check
    } : null;

    // 3. Extract Text Data
    const { 
      name, age, gender, victimAddress, contact, email, 
      crimeType, crimeCategory, priority, location, 
      crimeDate, description 
    } = req.body;
    // user information 
    const submitedByName = decoded.name;
    const submitedByEmail = decoded.email;

    // 4. Construct Separated Document Structure
    const newReport = {
      // Victim Details
        name,
        age,
        gender,
        contact,
        email,
        victimAddress: victimAddress,
      // Crime Details
        crimeType: crimeType,
        crimeCategory: crimeCategory,
        priority,
        crimeDate,
        location,
        submitedBy:submitedByName,
        submitedByEmail:submitedByEmail,
        description,
      // SEPARATED FILES
      evidenceFiles: evidenceList,      // Array of URLs
      identityVerification: verificationData, // Single Identity Object
      
      // Meta Data
      status: "Open",
      reportStatus: "pending",
      date: new Date().toString()
    };

    // 5. Save to MongoDB
    await db.collection('report').insertOne(newReport);
    
    res.status(200).json({ 
      success: true, 
      message: "Report and Identity photo saved separately." 
    });

  } catch (error) {
    console.error("Error in backReport:", error);
    res.status(500).json({ error: "Server Error during report submission" });
  }
  // const db = getDB();
  // const collection = await db.listCollections({name : "report"}).toArray();
  // const reportData = () => {
  //     const {name,
  //   age,
  //   gender,
  //   victimAddress,
  //   contact,
  //   email,
  //   crimeType,
  //   crimeCategory,
  //   priority,
  //   location,
  //   crimeDate,
  //   evidence,
  //   description,
  //   status = "Open",
  //   reportStatus = "pending",
  //   date = new Date().toString(),
  //   token
  // } = req.body;
  // //submited by = ******
  // // console.log('jwt token',token.name);
  // // console.log('jwt token',token.email);
  // // const submitedBy= token.;
  
  // const addReport = db.collection('report').insertOne(
  //   {name, age,gender,victimAddress,contact,email,crimeType, crimeCategory,priority,location,crimeDate,evidence,description,status,reportStatus,date,submitedBy
  //   }) 
  //   // console.log(req);
    
  //     res.send("data get it succesfully")
      
  // }
  // if (collection.length>0){
  //   reportData();
  // }else{
  //   db.createCollection("report")
  //   reportData();
  // }


}

////////////////////////////////////////
// report that needed to approved by the damin, it only show the pending reports
export const giveReports =async (req , res) =>{
  // console.log('got it')
  const db = getDB();
  const getPendingReports =await db.collection('report').find({reportStatus : "pending"}).toArray()
  // console.log(getPendingReports);

  res.status(200).json({
    pendingReport : getPendingReports
  })

}

/////////////////////////////////////////
// report approved by the admin that show in the admin report page this is for the only approval
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
// crimerepository reports it show the report on crimerepository
export const gaveApprovedReport = async (req,res) => {
 try {
  const db = getDB();
  const approvedReport = await db.collection('report').find({reportStatus : "approved"}).toArray()
//  console.log(approvedReport)
  res.status(200).json({
    status : "succes",
    report : approvedReport,
    message : "here the reports that approved"
  })
 } catch (error) {
  res.status(200).json({
    status : "faild",
    message:  error
  })
 }
}

/////////////////////////////////////////////////////////////////////
// report is selected for investigation at crime-repository
export const investigate = async (req, res) => {
  const db =getDB();
  try {
    const reportId = req.body.id;
    const decoded = jwt.verify(req.cookies.token,process.env.JWTKEY || "secretkey");
   console.log(decoded,'crime investigator');
    const nameOfInvestigator = [{name :req.body.token.name,
      role:decoded.role,
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
    // gaveApprovedReport();
  } catch (error) {
    console.log(error,"error.. .. .. .. .. . . . . . .  .")
    res.status(200).json({
    status : "faild",
    message:  error
    
  })}
}

////////////////////////////////////////////////////////////////////////////
// join the investigation at crime-repository
export const joinInvestigation = async (req , res) =>{
  const db = getDB()
  // console.log(req.body.token.token,'token ')
  try {
    const reportId = req.body.id;
    const decoded = jwt.verify(req.body.token.token,process.env.JWTKEY || "secretkey");
   console.log(decoded,'crime investigator');
    const nameOfInvestigator = {name :req.body.token.name,
      role:decoded.role,
      email :decoded.email,
      investigationjoinDate : Date().toString()
    };
    const joined = await db.collection('investigation').updateOne({reportId},{
      $push:{
        nameOfInvestigator
      }
    })
  } catch (error) {
    console.log(error);
  }
}




///////////////////////////////////////////////////////////////////////
// displayed investigation 

export const myIvestigation = async (req , res) => {

  // const allReport =async (myReport) =>{
  //   myReport.map(
  //     const reportData =  db.collection('report').findOne({_id: id});
      
  //   )
  //   {

  //   }
  // }
  const db = getDB();
  
  try {
    
    const decoded = jwt.verify(req.cookies.token,process.env.JWTKEY || "secretkey");
  //  console.log(decoded,'crime investigator');
  const email = decoded.email;
  const myReport = await db.collection('investigation').find({"nameOfInvestigator.email": email}).toArray();
    // console.log(myReport,'reports');
    const allReport = myReport.map( async (r) => {
      const id = new ObjectId(r.reportId)
      return await db.collection('report').findOne({_id: id})
      
      
    })
    const allReportsData = await Promise.all(allReport);

    // console.log(allReportsData,'it worked')
    res.status(200).json({
      status : "succes",
      report : allReportsData,
      message : "You  are workin on this .."
    })
  // console.log(reportData, 'report');
  } catch (error) {
    console.log(error)
  }
}

// storage 
export const addEvidance = multer({ storage: storage }).fields([
  { name: 'files', maxCount: 5 },
 
]);

////////////////////////////////////////////////////////////
// se
export const draftReport = async (req, res) => {
  try {
    const db = getDB();
    const { reportId, summary } = req.body;

    // 1. Check req.files['files'] (Matches the middleware)
    const newFiles = req.files['files'] || []; 
    
    const newEvidenceList = newFiles.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      resourceType: file.resource_type || (file.mimetype === 'application/pdf' ? 'raw' : 'image'),
      uploadedAt: new Date()
    }));

    const existingEvidence = req.body.existingEvidence ? JSON.parse(req.body.existingEvidence) : [];
    const finalEvidence = [...existingEvidence, ...newEvidenceList];

    await db.collection("investigation").updateOne(
      { reportId:reportId },
      { 
        $set: { 
          reportId:reportId,
          summary, 
          criminalInfo: JSON.parse(req.body.criminals || "[]"), 
          evidence: finalEvidence,
           
        } 
      },
      { upsert: true }
    );

    // Stop execution here with a return to prevent header errors
    return res.status(200).json({ message: "Saved successfully" });

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
       return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};


//////////////////////////////////////////////////////////
// getting the draft report data 
export const getDraftReport = async (req , res) =>{
   const id = req.body;
   
  try {
    const db = getDB();
    const reportGet = await db.collection('investigation').findOne({ 
      reportId: req.params.reportId });
console.log(reportGet,'getting the report');
      res.json(reportGet);
  } catch (error) {
    console.log(error)
  }
}

//////////////////////////////////////////////////////////////
// submit the report 
export const saveReport = async (req, res) => {
  try {
    const db = getDB();
    const reportIdParam = req.params.reportId;
    const token = req.cookies.token;

    const submited = jwt.verify(token, process.env.JWTKEY ||"secretkey");

    const finalSubmitedBy = submited.name;
    const finalSubmitedEmail = submited.email;

    // Correct way to handle ObjectId
    const idObject = new ObjectId(reportIdParam);

    // 1. Fetch the data
    const InvestigationReport = await db.collection('investigation').findOne({ 
      reportId: reportIdParam 
    });
    
    const report = await db.collection('report').findOne({ 
      _id: idObject // Use _id if reportId is the primary key in 'report' collection
    });

    if (!InvestigationReport || !report) {
      return res.status(404).json({ success: false, message: "Records not found" });
    }

    // 2. Insert into submitted collection
    await db.collection('submited').insertOne({ 
      InvestigationReport, 
      report,
      submittedAt: new Date(),
      finalSubmitedBy,
      finalSubmitedEmail
    });

    // 3. Delete the old records after successful submission
    await db.collection('investigation').deleteOne({ reportId: reportIdParam });
    await db.collection('report').deleteOne({ _id: idObject });

    // 4. Send the final response (Use .status(200).json, NOT .send(200).json)
    return res.status(200).json({
      success: true,
      message: "Report has been submitted successfully."
    });

  } catch (error) {
    console.log("Error in saveReport:", error);
    
    // Only send error if we haven't sent a response yet
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  }
};

///////////////////////////////////////////////////////////
// getting the final report from the db
export const getSubmitedReport = async (req , res) =>{
  const db = getDB();
  try {
  const reports = await db.collection('submited').find().toArray();

  
  res.status(200).json({
    success:true,
    reports:reports,
    message:"report are send"
  })
  } catch (error) {
  console.log(error);
  res.status(200).json({
    success:false,
    message:error
  })
  } 
}