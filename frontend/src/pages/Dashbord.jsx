import React from "react";

const Dashbord = () => {
  return (
    <div className="bg-gray-900 h-screen">
     
      {/* admin menu */}
      <div className="flex">
        <div className="w-1/5 bg-gray-800 h-screen">
          <h1 className="text-white">Name____</h1>
          <div>
            <ul className="flex flex-col gap-4 mt-4 ml-4 w-6/7">
              <li className="text-white rounded-2xl bg-cyan-600 p-2 shadow-[0_0_20px_3px_rgba(96,165,250,0.4)] ">
                Dashboard
              </li>
              <li className="text-white rounded-2xl bg-cyan-600 p-2 shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                Request
              </li>
              <li className="text-white rounded-2xl bg-cyan-600 p-2 shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                Volunteer
              </li>
              <li className="text-white rounded-2xl bg-cyan-600 p-2 shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                Make admin
              </li>
              <li className="text-white rounded-2xl bg-cyan-600 p-2 shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                Bloack volunteer
              </li>
              <li className="text-white rounded-2xl bg-cyan-600 p-2 shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                Report Accessed log
              </li>
              <li className="text-white rounded-2xl bg-cyan-600 p-2 shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                Audit logs
              </li>
              <li className="text-white rounded-2xl bg-cyan-600 p-2 shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                Dishable Account
              </li>
            </ul>
          </div>
        </div>
        {/* display content */}
        <div className="w-5/6 bg-gray-700 h-screen">
          <h1 className="text-white text-center text-2xl font-bold">
            Overview
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
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
