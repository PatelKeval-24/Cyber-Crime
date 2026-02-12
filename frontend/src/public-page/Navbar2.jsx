import React from 'react'
import { Link } from 'react-router-dom'

const Navbar2 = () => {
  return (
    <div className='bg-indigo-400 flex justify-between items-center p-4'>
      <div>
        <h1 className="text-white text-2xl font-bold">Crime Repository . . . .  .</h1>
      </div>
      <div>
        <ul className='flex space-x-10 text-white'>
          <Link  to="/">Home</Link>
          <Link  to="/home/crime-info" >Crime Info</Link>
          <Link  to="/home/crime-submit" >Crime Submit</Link>
          <Link  to="/home/crime-repository" >Crime Repository</Link>
          <Link  to="/home/dashbord" >Dashbord</Link>
          <Link  to="/" >Logout</Link>
        </ul>
      </div>
    </div>
  )
}

const homeHandle = () => {
  console.log("home clicked");
}

export default Navbar2
