import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const Login = ()=> {
  const navigate = useNavigate()
  function handleLogin(e) {
    e.preventDefault()
    console.log("login clicked");
    
    navigate('/')
    
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


export default Login
