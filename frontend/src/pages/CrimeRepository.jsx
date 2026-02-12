import React from 'react'
import Report from './Report'

const CrimeRepository = () => {
  return (
    <div className='bg-gray-900 h-full'>
      <h1 className='text-white text-2xl font-bold text-center'>Crime Repository</h1>
      <div className='m-5 h-16 flex justify-center items-center border-2 border-red-500 '>
        <input type="text" placeholder='Search...' className='p-1 rounded bg-gray-800 text-white w-[40%]' />
        <button className='bg-indigo-500 text-white p-1 m-3 rounded'>Search</button>
      </div>

      <div className='m-5 grid grid-cols-2 border-2 border-red-500 overflow-y-scroll'>
        <Report />
        <Report />
        <Report />
        <Report />
        <Report />
        <Report />
        <Report />
        <Report />
        <Report />


      </div>

    </div>
  )
}

export default CrimeRepository
