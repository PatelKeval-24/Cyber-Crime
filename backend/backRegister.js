import express from 'express';
var app = express();
import bcrypt from 'bcrypt';
import axios from 'axios';




import { getDB } from './db.js';


// router.post('/crime-submit', upload.single('evidence'), backReport);
const backRegisterHandle = async (req,res)=>{
    
    const {name,email,contectNumber, role = "volunteer",status = "pending",address,password,registerTime} = req.body;
    //// data inserting in to the database 
    try {
        const clientIp = '152.59.36.71' || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // 2. Fetch ISP and Location info using a Geolocation API
        // Note: For production, use a paid service or one with higher limits
        const response = await axios.get(`http://ip-api.com/json/${clientIp}?fields=status,message,country,city,isp,org,as,query`);
        // console.log(response.data,'isp')
        
        if (response.data.status === 'fail') {
            return res.status(400).json({ error: 'Could not detect IP information' });
        }
        const ispProvider = response.data ;
        //user location where he register
        try {
            const token = 'pk.38b7eb673f5d6468f4e6417008f4a665';
            let Latitude = '21.133514'// get realtime value
            let Longitude = '73.1222'
            const location = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${token}&lat=${Latitude}&lon=${Longitude}&format=json&`)
            // console.log("location22",location.data)
            // console.log("location22",location.data.display_name)
            // console.log("location22",location.data.address)
            const userRegisterLocation=location.data.display_name;
            const objUserRegisterLocation=location.data.address;
            try{
            const hashPassword = await bcrypt.hash(password, 10);
            
            const db = getDB();
            const collection = db.collection('volunteer');
            const result = await collection.insertOne({name,email,contectNumber,role,status,address,hashPassword,registerTime,userRegisterLocation,objUserRegisterLocation,ispProvider});
            res.send('User Register Successfully');
            // console.log("Insertion result:", result);
            }catch(error){
                console.error("Error during registration:", error);
                res.status(500).send('An error occurred during registration');
            }
        } catch (error) {
          console.log(error)  
        }

        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export default backRegisterHandle;
