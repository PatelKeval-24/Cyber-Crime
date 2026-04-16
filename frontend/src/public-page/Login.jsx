import {useContext,useState} from 'react'
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { socket } from './socket';


export const Login = ()=> {
  const { login } = useContext(AuthContext);
  const { tokeninfo } = useContext(AuthContext);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  const navigate = useNavigate()
  async function handleLogin (e) {
    e.preventDefault()
    
    // Perform login logic here (e.g., API call to authenticate user)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log("front",email, password);

    navigator.geolocation.getCurrentPosition(async(position) => {
      const { latitude, longitude } = position.coords;

      console.log("User Location:", latitude, longitude);
    }, (error) => {
      console.error("User denied location access", error);
    });
    try {
    const axiosResponse = await axios.post('http://localhost:3000/home/login',{email,password,latitude,longitude},{
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'}
      })
      // console.log(axiosResponse.data);
      console.log(axiosResponse , 'login worked');

      if(axiosResponse.data.success){
        
        const token = axiosResponse.data.token;
        // console.log('tokennn',token);
        if(token){
          const tokenverify = await axios.get('http://localhost:3000/home/verify-token',{
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          })
          console.log("token data",tokenverify.data);
          console.log("token role",tokenverify.data.user.role);
          if(tokenverify.data.success === true && tokenverify.data.user.role){
            // const role = tokenverify.data.user.role;
            // console.log(tokenverify.data.user.role)
            // console.log(tokenverify.data.user.name)
            // This tells the AWS server "I am online" using the email
            socket.emit('go-online', email);
            tokeninfo(token)
            login(tokenverify.data.user);
            console.log(tokenverify.data.user,'verify mynk');
            
            alert("Login Successful: " + axiosResponse.data.message);
            navigate(`/home/${tokenverify.data.user.role}-dashboard`);
          }else{
            alert("Token verification failed: " + tokenverify.data.message);
          }
        }
        
      }
    }catch (error) {
        // This code runs if the backend sends 401, 404, 500, etc.
    if (error.response) {
      // The server responded with a status code (like 401)
      alert("Login Failed: " + error.response.data.message);
    } else if (error.request) {
      // The request was made but no response was received (Server down)
      alert("No response from server. Please check if your backend is running.");
    } else {
      // Something happened in setting up the request
      alert("Error: " + error.message);
    }
    console.error("Axios Error Details:", error);
      }
    
  }


  
  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen bg-[url("https://www.teahub.io/photos/full/88-886260_cyber-crime.jpg")] bg-cover' >
        <div className='flex flex-col w-1/2 text-basee m-10 p-10 rounded-lg backdrop-blur-10 bg-white/30 justify-center items-center'>
          <h1 className='text-black text-3xl font-bold mb-4 text-center'>Login to Your Account</h1>

          <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2 '>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder='User Email' className='border-b-2 rounded-md'/>
          </div>

          <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2'>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder='Password' className='border-b-2 rounded-md'/>
          </div>

          <button onClick={handleLogin} className='border-none rounded-md m-2 p-2 w-24 bg-gray-900/40 '>Login</button>
          <p>If you do not have account.<Link className='text-black-300 underline underline-offset-2' to="/home/register">Register</Link></p>
          <p>If you do not remember the password.<Link className='text-black-300 underline underline-offset-2' to="/home/forgot">Forgot</Link></p>
        </div>
      </div>
    </>
  )
}
