import express from 'express';
var app = express();
import cors from 'cors';
import backRegisterHandle from './backRegister.js';
import { verifyToken, logoutHandle, backLoginHandle } from './backLogin.js';
import { aprovedBack, getRequestHandler, rejectBack, volunteerData } from './Oprequest.js';
import {backReport, giveReports} from './backReports.js';

const PORT = 3000;

app.use(cors({
    origin: 'https://cyber-crime-desk-frontend.onrender.com',
    credentials: true
   
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(backRegisterHandle);
app.use(backLoginHandle);
app.use(verifyToken);
app.use(logoutHandle);

app.get("/home/request", getRequestHandler);
app.post("/home/request/approved", aprovedBack);
app.post("/home/request/rejected", rejectBack);
app.get("/home/admin-dashboard/volunteer", volunteerData);
app.post("/home/crime-submit", backReport );
app.get("/home/admin-dashboard/report", giveReports)





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}) 

// https://cyber-crime-desk.onrender.com