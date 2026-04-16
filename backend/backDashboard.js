import { getDB } from './db.js';
import { getAuditData } from './auditLog.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


///////////////////////////////////////////
// Dashboard total report count
export const getCount = async (req , res) =>{
  const db = getDB();
  console.log("Dashboard count API called");

  try {
    // report status pending
    const pendingCount = await db.collection('report').countDocuments({ reportStatus: 'approved' });//"reportStatus": "pending" report status approved

    const pendingCount1 = await db.collection('report').countDocuments({ reportStatus: 'pending' });//"reportStatus": "pending" report status pending

    const pendingCount2 = await db.collection('report').countDocuments({ reportStatus: 'rejected' });//"reportStatus": "pending" report status rejected

    // report status under investigation
    const investigationCount = await db.collection('investigation').countDocuments({});
    // report status under investigation

    // const investigationCount2 = await db.collection('report').countDocuments({ reportStatus: 'under investigation' });

    const closedCount = await db.collection('submited').countDocuments({ status: 'closed' });

    const volunteerRequestCount = await db.collection('volunteer').countDocuments({ status: 'pending' });

    const volunteerCount = await db.collection('volunteer').countDocuments({ status: 'approved' });

    const adminCount = await db.collection('admin').countDocuments({});

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWTKEY);
    const userEmail = decoded.email;

    let profileData = await db.collection('admin').findOne({ email:userEmail});

    if (!profileData) {
      profileData = await db.collection('volunteer').findOne({ email:userEmail});
    }

    console.log("Profile Data:", profileData);

    console.log({
      
      pendingCount,
      pendingCount1,
      pendingCount2,
      investigationCount,
      closedCount,
      volunteerRequestCount,
      volunteerCount,
      adminCount
    });




    res.json({
       pendingCount,
      pendingCount1,
      pendingCount2,
      investigationCount,
      closedCount,
      volunteerRequestCount,
      volunteerCount,
      adminCount,
      profileData
    });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


///////////////////////////////////////////////////////////////////////////
/// Dashboard profile data update

export const updateProfile = async (req, res) =>  {
  console.log("Update profile API called");
  const db = getDB();
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWTKEY);
  const userEmail = decoded.email;
  const { name, contactNumber, email } = req.body;

  try {
    const result = await db.collection('admin').updateOne(
      { email: userEmail },
      { $set: {
        name: name,
        contactNumber: contactNumber,
        email: email
      } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Profile update failed' });
    } 
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

///////////////////////////////////////////////////////////////
// password update for admin
export const adminPasswordUpadate = async (req, res) => {
  try {
  const db = getDB();
  const {currentPassword , newPassword } = req.body;

  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWTKEY);
  const userEmail = decoded.email;

  const adminData = await db.collection('admin').findOne({ email: userEmail });

  
  } catch (error) {
    
  }
  

}




//////////////////////////////////////////
// Dashboard pending report count

//////////////////////////////////////////
// Dashboard investigation report count

//////////////////////////////////////////
// Dashboard closed report count

///////////////////////////////////////////
// Dashboard volunteer request count

//////////////////////////////////////////
// Dashboard volunteer count

/////////////////////////////////////////
// Dashboard admin count

////////////////////////////////////////
// Dashboard recent volunteer active log

/////////////////////////////////////////