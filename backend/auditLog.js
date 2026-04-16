import {getDB} from './db.js';
import jwt from 'jsonwebtoken';
import { getUserAuditData } from './info.js';


export const getAuditData = async (req,action,manualEmail=null) => {
  console.log("Audit Log Triggered for action:", action);
  const db = getDB();
  const collection =await db.collection('auditLogs');
// 1. Define variable in the function scope (not inside if/else)
    let userEmail = "Unknown User";

    // 2. Logic to assign the value
    if (manualEmail) {
        userEmail = manualEmail;
    } else if (req.cookies && req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWTKEY || "secretkey");
            userEmail = decoded.email;
        } catch (err) {
            console.error("JWT Verify Error:", err.message);
            userEmail = "Invalid Token User";
        }
    }

  const logintime = new Date(); // Capture the current timestamp for the log entry
  const userDevise =await getUserAuditData(req);
  try {
    const auditData = await collection.insertOne({
      action,
      userEmail,
      logintime,
      userDevise,
      timestamp: new Date()
    });
    console.log("Audit log inserted:", auditData);
    return auditData;
  } catch (error) {
    console.error("Error inserting audit data:", error);
    throw error;
  }
 
}

export const getAuditLogsFromDB = async (req, res) => {
  console.log("Fetching audit logs from DB...");
  const db = getDB();
  const collection = db.collection('auditLogs');
  try {
    const logs = await collection.find({}).sort({ timestamp: -1 }).toArray();
    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
  }
}

////////////////////////////////
// ip information & device information done


////////////////////////////
// volunteer frist register log done

///////////////////////////////
// volunter approved log done

//////////////////////////////////
// volunteer rejected log done

////////////////////////////
// make admin log  done

///////////////////////////
// block volnteer log

///////////////////////////////
// report approved log

/////////////////////////////
//selected the report log

////////////////////////////
// join investigation log

////////////////////////////
// Leave investigation log

/////////////////////////////
// submied report log 