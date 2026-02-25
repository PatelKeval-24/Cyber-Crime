import React from 'react'

function Reports() {
  return (
    <>
    <h1 className='text-white font-bold text-3xl text-center'>Reports that are sumbited</h1>

    <div className='h-1/4 w-1/3 m-10 bg-sky-500 border border-fuchsia-500'>
        <div className=' p-3 flex justify-between'>
          <h1>Name</h1>
          <span>Open || close</span>
        </div>
        <div className='p-3  flex justify-baseline '>
          <h1>Category</h1>
          <h1>Types</h1>
        </div>
        <div>
          <h1>Description</h1>
          <p></p>
        </div>
    </div>
      
    </>
  )
}

export default Reports
