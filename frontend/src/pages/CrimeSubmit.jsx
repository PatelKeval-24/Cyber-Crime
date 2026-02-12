import React from 'react'

const CrimeSubmit = () => {
  return (
    <>
    <div className='bg-gray-900 h-screen'>
        <h1 className='text-white text-2xl font-bold text-center'>Crime Submit</h1>
      
      <div className=' flex justify-center  border-2 border-red-500'>
        <form className='w-[60%] m-7 bg-cyan-500 backdrop-blur-xl   flex flex-col space-y-1 p-4 rounded-2xl shadow-cyan-700 shadow-lg'>

          <label htmlFor="victim">Victim Name:</label>
          <input type="text" id="victim" className='p-1 rounded bg-gray-800 text-white ' />

          <label htmlFor="contact">Contact Number:</label>
          <input type="tel" id="contact" className='p-1 rounded bg-gray-800 text-white' />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" className='p-1 rounded bg-gray-800 text-white' />

          <label htmlFor="address">Address:</label>
          <input type="text" id="address" className='p-1 rounded bg-gray-800 text-white' />

          <label htmlFor="date">Date of Crime:</label>
          <input type="date" id="date" className='p-1 rounded bg-gray-800 text-white' />

          <label htmlFor="crimeType">Crime Type:</label>
          <input type="text" id="crimeType" className='p-1 rounded bg-gray-800 text-white' />

          <label htmlFor="description">Description:</label>
          <textarea id="description" className='p-1 rounded bg-gray-800 text-white' />

          <label htmlFor="submitedBy">Submited By:</label>
          <input type="text" id="submitedBy" className='p-1 rounded bg-gray-800 text-white' />

          <button type="submit" className='bg-indigo-500 text-white p-1 m-3 rounded'>Submit</button>

        </form>
      </div>
    </div>
    </>
  )
}

export default CrimeSubmit
