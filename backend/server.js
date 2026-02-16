import express from 'express';
var app = express();
import cors from 'cors';
import backRegisterHandle from './backRegister.js';
import { verifyToken, logoutHandle, backLoginHandle } from './backLogin.js';

const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
   
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(backRegisterHandle);
app.use(backLoginHandle);
app.use(verifyToken);
app.use(logoutHandle);





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}) 
