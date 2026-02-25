import React from 'react'

const ReportAccessedLog = () => {
  return (
    <>
    <h1 className="text-white text-center text-2xl font-bold">
            ReportAccessedLog
          </h1>
          <div className="grid grid-cols">

            <div className="flex gap-10 mt-4 ml-4 ">

              <div className="w-5/17 ml-6 bg-gray-800 h-40 rounded-lg shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                <h1 className="text-white text-center text-xl font-bold mt-4">
                  Total Requests
                </h1>
                <p className="text-white text-center text-2xl font-bold mt-4">
                  100
                </p>
              </div>

              <div className="w-5/17 bg-gray-800 h-40 rounded-lg shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                <h1 className="text-white text-center text-xl font-bold mt-4">
                  Total Volunteers
                </h1>
                <p className="text-white text-center text-2xl font-bold mt-4">
                  50
                </p>
              </div>

              <div className="w-5/17 bg-gray-800 h-40 rounded-lg shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                <h1 className="text-white text-center text-xl font-bold mt-4">
                  Total Admins
                </h1>
                <p className="text-white text-center text-2xl font-bold mt-4">
                  10
                </p>
              </div>
              
            </div>

          </div>
      
    </>
  )
}

export default ReportAccessedLog
