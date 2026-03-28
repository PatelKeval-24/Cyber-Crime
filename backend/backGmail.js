import { sendOTPEmail } from './mailer.js';
import { getDB } from './db.js';
import bcrypt from 'bcrypt';

const adminPassword = async (email, db, otp, res) => {
  try {
    console.log('Checking Admin collection for:', email);

    // Update the Admin collection with OTP and Expiry
    const result = await db.collection('admin').updateOne(
      { email },
      { 
        $set: { 
          otp: otp, 
          otpExpiry: Date.now() + 10 * 60 * 1000 // 10 min expiry
        } 
      }
    );

    // If not found in admin either
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found in Volunteer or Admin records" });
    }

    const emailSent = await sendOTPEmail(email, otp);
    
    if (emailSent.success) {
      return res.status(200).json({ message: "OTP sent to Admin Gmail" });
    } else {
      return res.status(500).json({ message: "Failed to send email to Admin" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const db = getDB();
  
  // 1. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    // 2. Try to update Volunteer collection
    const result = await db.collection('volunteer').updateOne(
      { email: email },
      { 
        $set: { 
          otp: otp,
          otpExpiry: Date.now() + 10 * 60 * 1000 // IMPORTANT: Save the expiry!
        } 
      }
    );

    // 3. Logic Check: matchedCount tells us if the user exists
    if (result.matchedCount === 0) {
      // User not in 'volunteer', try 'admin'
      console.log("Not found in Volunteer, moving to Admin check...");
      return adminPassword(email, db, otp, res);
    }

    // 4. If matchedCount > 0, User was found and updated in volunteer
    const emailSent = await sendOTPEmail(email, otp);
    
    if (emailSent.success) {
      return res.status(200).json({ message: "OTP sent to your Gmail" });
    } else {
      return res.status(500).json({ message: "Failed to send email" });
    }

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/////////////////////////////////////////////////////
// admin otp search 
const adminOTP = async (email, db, otp, res) => {
  try {
    console.log('Checking Admin collection for:', email);

    // Update the Admin collection with OTP and Expiry
    const result = await db.collection('admin').findOne({ email });
    const dbOTP = result.otp;
    // If not found in admin either
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found in Volunteer or Admin records" });
    }

    if (otp === dbOTP) {
      return res.status(200).json({
        success:true,
        message: "OTP is verified succesfully.. . ." });
    } else {
      return res.status(500).json({ 
        success:false,
        message: "OTP is not velid " });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


//////////////////////////////////////////////////////////////
// verify otp 
export const verifyOTP = async (req , res ) =>{
  const {email,otp} = req.body;
  const db =getDB()
  console.log(email,otp,'otp verification')
  try {
    // 2. Try to update Volunteer collection
    const result = await db.collection('volunteer').findOne({ email: email } );
    console.log(result,'bvkhv')
    const dbOTP = result.otp;

    // 3. Logic Check: matchedCount tells us if the user exists
    if (result.matchedCount === 0) {
      // User not in 'volunteer', try 'admin'
      console.log("Not found in Volunteer, moving to Admin check...");
      return adminOTP(email, db, otp, res);
    }
    console.log(otp,dbOTP,'true')
    
    if (otp === dbOTP) {
      return res.status(200).json({
        success:true,
        message: "OTP is verified succesfully.. . ." });
    } else {
      console.log('false')
      return res.status(500).json({ 
        success:false,
        message: "OTP is not velid " });
    }

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: err.message });
  }
}

///////////////////////////////////////////////////////////////////
/// update the Password for admin
export const  adminPasswordUpadate = async (email ,db , otp, newPassword,res) =>{

  const hashPassword = await bcrypt.hash(newPassword, 10);

  try {
    const result = await db.collection('admin').findOne({ email: email } );
    console.log(result,'admin ')
    const dbOTP = result.otp;

    // 3. Logic Check: matchedCount tells us if the user exists
    if (result.matchedCount === 0) {
      // User not in 'volunteer', try 'admin'
      console.log("Not found in Volunteer, moving to Admin check...");
      return res.status(404).json({ message: "User not found in Volunteer or Admin records" });
    }
    console.log(otp,dbOTP,'true')
    
    if (otp === dbOTP) {
      const update = db.collection('volunteer').updateOne({email:email},{
       $set: 
       {hashPassword:hashPassword}
      });
     
    } else {
      console.log('false')
      return res.status(500).json({ 
        success:false,
        message: "error during the password update " });
    }

  } catch (error) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: err.message });
  }
} 

///////////////////////////////////////////////////////////////////
/// update the password the 
export const updatePassword = async (req ,res ) =>{
  const db =  getDB()
  const {email , otp , newPassword} = req.body ;
  const hashPassword = await bcrypt.hash(newPassword, 10);

  try {
    const result = await db.collection('volunteer').findOne({ email: email } );
    console.log(result,'bvkhv')
    const dbOTP = result.otp;

    // 3. Logic Check: matchedCount tells us if the user exists
    if (result.matchedCount === 0) {
      // User not in 'volunteer', try 'admin'
      console.log("Not found in Volunteer, moving to Admin check...");
      return adminPasswordUpadate(email, db, otp,newPassword, res);
    }
    console.log(otp,dbOTP,'true')
    
    if (otp === dbOTP) {
      const update = db.collection('volunteer').updateOne({email:email},{
       $set: 
       {hashPassword:hashPassword}
      });
      res.status(200).json({
        success:true,
        message:'password updated succesfully.'
      })
    } else {
      console.log('false')
      return res.status(500).json({ 
        success:false,
        message: "error during the password update " });
    }

  } catch (error) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: err.message });
  }
}  