import react, { useContext } from "react"
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../AuthContext";


const VolunteerDashboard = () => {


const {name} = useContext(AuthContext)

  return (
    <div className="bg-gray-900 h-full ">
     
      {/* admin menu */}
      <div className="">
        <div className=" fixed w-64 bg-[#111827] h-[calc(100vh-4rem)]x">
          <h1 className="text-white text-center p-2 h-10 m-5 bg-purple-700">{name}</h1>

          <div className="flex flex-col gap-4 mt-4 ml-4 w-6/7">
              <Link to='' className=" text-white rounded-2xl bg-blue-600  p-2 transition duration-300 ease-in-out transform hover:scale-110  shadow-[0_0_20px_3px_rgba(96,165,250,0.4)] ">
                Dashboard
              </Link>
              <Link to='all-reports' className="text-white rounded-2xl bg-blue-600 p-2 transition duration-300 ease-in-out transform hover:scale-110  shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                All Reports
              </Link>
              <Link to='my-investigation' className="text-white rounded-2xl bg-blue-600 p-2 transition duration-300 ease-in-out transform hover:scale-110  shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                My Investigation 
              </Link>
              
              <Link to='Dishable-Account' className="text-white rounded-2xl bg-blue-600 p-2 transition duration-300 ease-in-out transform hover:scale-110  shadow-[0_0_20px_3px_rgba(96,165,250,0.4)]">
                Dishable Account
              </Link>
            
          </div>
        </div>
        {/* display content */}
        <div className="ml-64 bg-neutral-950 min-h-screen p-6">
        <Outlet/>
        </div>
      </div>
    </div>
  );
};


export default VolunteerDashboard;
