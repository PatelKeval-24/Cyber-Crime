import {useContext} from 'react'
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;


export const Login = ()=> {
  const { login } = useContext(AuthContext);
  const { userName } = useContext(AuthContext);

  const navigate = useNavigate()
  async function handleLogin (e) {
    e.preventDefault()
    // Perform login logic here (e.g., API call to authenticate user)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log("front",email, password);

    const axiosResponse = await axios.post('http://localhost:3000/home/login',{email,password},{
      headers: {
        'Content-Type': 'application/json'}
      })
      // console.log(axiosResponse.data);
      // console.log(axiosResponse.cooki);

      if(axiosResponse.data.success){
        alert("Login Successful: " + axiosResponse.data.message);
       
        const token = axiosResponse.data.token;
        // console.log('tokennn',token);
        if(token){
          const tokenverify = await axios.post('http://localhost:3000/home/verify-token',{token:token},{
            headers: {
              'Content-Type': 'application/json'
            }
          })
          console.log("token data",tokenverify.data);
          // console.log("token role",tokenverify.data.user.role);
          if(tokenverify.data.success === true && tokenverify.data.user.role){
            // const role = tokenverify.data.user.role;
            // console.log(tokenverify.data.user.role)
            // console.log(tokenverify.data.user.name)
            login(tokenverify.data.user);
            navigate(`/home/${tokenverify.data.user.role}-dashboard`);
          }else{
            alert("Token verification failed: " + tokenverify.data.message);
          }
        }
        
      }else{
        alert("Login Failed: " + axiosResponse.data.message);
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

          <button onClick={handleLogin} className='border-2 border-gray-300 rounded-md m-2 p-2 w-24'>Login</button>
        </div>
      </div>
    </>
  )
}
