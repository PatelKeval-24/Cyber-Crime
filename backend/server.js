import express from 'express';
var app = express();
import cors from 'cors';
import backRegisterHandle from './backRegister.js';
import { verifyToken, logoutHandle, backLoginHandle, verifyTokenFunction } from './backLogin.js';
import { aprovedBack, getRequestHandler, rejectBack, volunteerData } from './Oprequest.js';
import {approvedReport, backReport, gaveApprovedReport, giveReports, investigate, myIvestigation} from './backReports.js';
import requestIp from "request-ip";
import axios from 'axios';
import cookieParser from "cookie-parser";
import {connectDB} from './db.js'

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


app.use(backRegisterHandle);
app.use(backLoginHandle);
app.use(verifyToken);
app.use(logoutHandle);

app.get("/home/request",verifyToken, getRequestHandler);

app.post("/home/request/approved",verifyToken, aprovedBack);

app.post("/home/request/rejected",verifyToken, rejectBack);

app.get("/home/admin-dashboard/volunteer",verifyToken, volunteerData);

app.post("/home/crime-submit",verifyToken, backReport );

app.get("/home/admin-dashboard/report",verifyToken, giveReports);

app.patch("/home/admin-dashboard/repor-approved",verifyToken, approvedReport);

app.get("/home/crime-repository" ,verifyToken, gaveApprovedReport);

app.patch("/home/crime-repository/investigation",verifyToken,investigate);

app.get("/home/volunteer-dashboard/myinvestigation",verifyToken,myIvestigation);
}
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
    const clientIp = '152.59.36.71' || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

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

    // try {
    //     const token = 'pk.38b7eb673f5d6468f4e6417008f4a665';
    //     let Latitude = '21.133514'
    //     let Longitude = '73.1222'
    //     const location = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${token}&lat=${Latitude}&lon=${Longitude}&format=json&`)
    //     console.log("location22",location.data)
        
    // } catch (error) {
    //   console.log(error)  
    // }
    

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





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}) 

//// access token pk.38b7eb673f5d6468f4e6417008f4a665