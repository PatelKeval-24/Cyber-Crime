import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo.png'

const Navbar = () => {
  return (
    <div className='bg-indigo-400 flex justify-between items-center p-4'>
      <div className='flex items-center'>
        {/* <img src={logo} className="w-26 h-16" /> */}
        <h1 className="text-white text-2xl font-bold">Cybercrime Reporting & Awareness Platform</h1>
      </div>
      <div>
        <ul className='flex space-x-10 text-white'>
          <Link  to="/">Home</Link>
          <Link  to="/home/crime-info" >Crime Info</Link>
          <Link  to="/home/login" >Login</Link>
          <Link  to="/home/register" >Register</Link>
        </ul>
      </div>
    </div>
  )
}

const homeHandle = () => {
  console.log("home clicked");
}

export default Navbar
