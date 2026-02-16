import React from 'react'
import icon from '../img/lock2.png'


const Crimetypes = (props) => {
  return (
    <>
      <div className='border-2 w-11/12 shadow-lg shadow-blue-500/50 rounded-lg p-5 bg-gray-800 text-white hover:scale-105 transition-transform duration-300 ease-in-out'>
        <img src={icon} alt="lock icon" className="w-10 h-10 mx-auto mb-2 animate-pulse backdrop-blur-sm shadow rounded-full shadow-blue-400 inset-shadow-sm inset-shadow-indigo-500" />
        <h1 className="text-2xl font-bold text-white text-center pb-2">{props.attackName}</h1>
        <p className='text-center'>{props.about}</p>
      </div>
    </>
  )
}

export default Crimetypes
