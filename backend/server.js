import express from 'express';
var app = express();
import cors from 'cors';
import backRegisterHandle from './backRegister.js';
import { verifyToken, logoutHandle, backLoginHandle, } from './backLogin.js';
import { aprovedBack, getRequestHandler, makeAdmin, makeAdminFromVolunteer, volunteerData } from './Oprequest.js';
import {uploadFields,approvedReport, backReport, gaveApprovedReport, giveReports, investigate, joinInvestigation, myIvestigation, draftReport, getDraftReport, addEvidance, saveReport, getSubmitedReport, againInvestigate, leaveInvestigation} from './backReports.js';
import requestIp from "request-ip";
import axios from 'axios';
import cookieParser from "cookie-parser";
import {connectDB,getDB} from './db.js';
import multer from 'multer';
import { rejectBack, rejectedReport } from './BackReject.js';
import { forgotPassword, updatePassword, verifyOTP } from './backGmail.js';

import http from 'http'; // Add this
import { Server } from 'socket.io'; // Add this
import { getAuditLogsFromDB } from './auditLog.js';
import { getCount, updateProfile } from './backDashboard.js';

connectDB();
const PORT =process.env.PORT || 3000;
const url = process.env.FRONTURL || 'http://localhost:5173';

app.use(cors({
    origin: url,
    credentials: true
   
}));
{
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// const upload = multer({ storage: multer.memoryStorage() });


app.post("/home/register",backRegisterHandle);
app.post('/home/login',backLoginHandle);
app.use(verifyToken);
app.get('/home/logout',logoutHandle);

app.get("/home/request",verifyToken, getRequestHandler);

app.post("/home/request/approved",verifyToken, aprovedBack);

app.post("/home/request/rejected",verifyToken, rejectBack);

app.get("/home/admin-dashboard/volunteer",verifyToken, volunteerData);


app.get("/home/admin-dashboard/make-admin",verifyToken, makeAdmin);

app.post("/home/admin-dashboard/make-admin/approved-to-admin",verifyToken, makeAdminFromVolunteer);

// const upload = multer({ storage: multer.memoryStorage() });

// Add the middleware before your controller
// router.post('/crime-submit', backReport);
app.post("/home/crime-submit",verifyToken, uploadFields, backReport );

app.get("/home/admin-dashboard/report",verifyToken, giveReports);

app.patch("/home/admin-dashboard/repot-approved",verifyToken, approvedReport); 

app.patch("/home/admin-dashboard/repot-rejected",verifyToken, rejectedReport); 
 
app.get("/home/admin-dashboard/submited",verifyToken, getSubmitedReport); 

app.get("/home/crime-repository" ,verifyToken, gaveApprovedReport);

app.patch("/home/crime-repository/investigation",verifyToken,investigate);

app.patch("/home/crime-repository/joininvestigation",verifyToken,joinInvestigation);

app.patch("/home/crime-repository/leaveinvestigation",verifyToken,leaveInvestigation);


app.get("/home/volunteer-dashboard/myinvestigation",verifyToken,myIvestigation);

// const reportDraft = multer({ dest: "reportDraft/" });
app.post("/home/volunteer-dashboard/myinvestigation/saved",verifyToken,addEvidance ,draftReport);

app.get("/home/volunteer-dashboard/myinvestigation/saved/:reportId",verifyToken,getDraftReport);

app.get("/home/volunteer-dashboard/myinvestigation/submit/:reportId",verifyToken,saveReport)

app.get("/home/admin-dashboard/againInvestigate/:reportId",verifyToken,againInvestigate);

app.get("/home/admin-dashboard/audit-logs",verifyToken,getAuditLogsFromDB);

app.get("/home/admin-dashboard/profile",verifyToken,getCount);

app.post("/home/admin-dashboard/profile/update",verifyToken,updateProfile);

}

app.post('/auth/forgot-password',forgotPassword);
app.post('/auth/verify-otp',verifyOTP);
app.post('/auth/reset-password',updatePassword)

// app.post('/auth/reset-password',verifyToken,resetPasswordHandle);

app.post("/userInfo", async(req ,res) =>{

 console.log("request header",req.headers)
 const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // If testing locally, this might show "::1" (which means localhost)
    console.log("User IP is:", userIp);
    const clientIp = requestIp.getClientIp(req);
    console.log(clientIp,"new ");

    try {
        // 2. Fetch ISP and Location info using a Geolocation API
        // Note: For production, use a paid service or one with higher limits
        const response = await axios.get(`http://ip-api.com/json/${clientIp}?fields=status,message,country,city,isp,org,as,query`);
        
        if (response.data.status === 'fail') {
            return res.status(400).json({ error: 'Could not detect IP information' });
        }

        res.json({
            ip: response.data.query,
            isp: response.data.isp,
            location: `${response.data.city}, ${response.data.country}`,
            organization: response.data.org
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

})


///////////////////////// ip address and isp and location 
app.get('/api/user-info', async (req, res) => {
    // 1. Get client IP (handles proxies/load balancers)
    const clientIp = '152.59.34.136' || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // 2. Fetch ISP and Location info using a Geolocation API
        // Note: For production, use a paid service or one with higher limits
        const response = await axios.get(`http://ip-api.com/json/${clientIp}?fields=status,message,country,city,isp,org,as,query`);
        console.log(response.data,'isp')
        
        if (response.data.status === 'fail') {
            return res.status(400).json({ error: 'Could not detect IP information' });
        }

        res.json({
            ip: response.data.query,
            isp: response.data.isp,
            location: `${response.data.city}, ${response.data.country}`,
            organization: response.data.org
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
        const token = 'pk.38b7eb673f5d6468f4e6417008f4a665';
        let Latitude = '21.1414356722688'
        let Longitude = '72.78052985867461'
        const location = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${token}&lat=${Latitude}&lon=${Longitude}&format=json&`)
        console.log("location22",location.data)
        
    } catch (error) {
      console.log(error)  
    }
    

//////////////////////////////////////////////////////////
/// VPN      
    const clientIp2 = "103.249.24.34";

    try {
        // ipapi.is has a generous free tier for developers
        const response = await axios.get(`https://vpnapi.io/api/146.70.246.166?key=f03b06ba96c04165a59c4c8babd83a18`);
        
        // console.log('vpn ', response);
        
        
        
    } catch (error) {
        console.log(error);
        
        // res.status(500).json({ error: "Security check failed" });
    }
});



// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`);
// }) 

//// access token pk.38b7eb673f5d6468f4e6417008f4a665
// --- SOCKET.IO SETUP START ---
const server = http.createServer(app); // Create the combined server
const io = new Server(server, {
    cors: {
        origin: url, // Uses your existing FRONTURL variable
        credentials: true
    }
});

io.on('connection', (socket) => {
    // When a user logs in, frontend sends 'go-online' with their ID
    socket.on('go-online', async (email) => {
    try {
        socket.userEmail = email; // Store email on the socket object
        const db = getDB();
        
        // Update status in BOTH potential collections
        const collections = ['volunteer', 'admin'];
        for (const col of collections) {
            await db.collection(col).updateOne(
                { email: email },
                { $set: { isOnline: true, lastSeen: new Date() } }
            );
        }

        // Broadcast to all other connected clients
        io.emit('user-status-change', { email, isOnline: true });
        console.log(`User ${email} is now Online`);
    } catch (err) {
        console.error("Socket Online Error:", err.message);
    }
});

socket.on('disconnect', async () => {
    if (socket.userEmail) {
        try {
            const db = getDB();
            const collections = ['volunteer', 'admin'];
            for (const col of collections) {
                await db.collection(col).updateOne(
                    { email: socket.userEmail },
                    { $set: { isOnline: false, lastSeen: new Date() } }
                );
            }

            io.emit('user-status-change', { email: socket.userEmail, isOnline: false });
            console.log(`User ${socket.userEmail} went Offline`);
        } catch (err) {
            console.error("Socket Offline Error:", err.message);
        }
    }
});
});
// --- SOCKET.IO SETUP END ---

// IMPORTANT: Change app.listen to server.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});