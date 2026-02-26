import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { useContext , } from "react";
import {AuthContext} from "../AuthContext"
import axios from "axios";
axios.defaults.withCredentials = true;


const Navbar2 = () => {
  
  const {loginStatus, logout , role} =  (useContext(AuthContext));
  // console.log("login222",role);

 
  
  const navigate = useNavigate()
const logoutHandle = async () =>{


  const axiosResponse = await axios.post('https://cyber-crime-desk-backend.onrender.com/home/logout',{
      headers: {
        'Content-Type': 'application/json'}
      })
      logout();
  // console.log('axiosResponse', axiosResponse)
  navigate('/');
}
  return (
    <div className="bg-indigo-950 flex justify-between items-center p-4">
      <div>
        <h1 className="text-white text-2xl font-bold">
          Crime Report Desk
        </h1>
      </div>
      <div>
        <ul className="flex space-x-10 text-white">
          <Link to="/">Home</Link>
          <Link to="/home/crime-info">Crime Info</Link>

          {loginStatus ? (
            <>
            <Link to="/home/crime-submit">Crime Submit</Link>
            <Link to="/home/crime-repository">Crime Repository</Link>
            {role === 'volunteer'?(<Link to="/home/volunteer-dashboard">Dashboard</Link>)
            :(<Link to="/home/admin-dashboard">Dashboard</Link>)}
              <button to="/" onClick={logoutHandle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/home/login">Login</Link>
              <Link to="/home/register">Register</Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar2;
