import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { useContext , } from "react";
// import {AuthContext} from "./Login"
import {AuthContext} from "../AuthContext"
import axios from "axios";
axios.defaults.withCredentials = true;


const Navbar2 = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // console.log(isLoggedIn,'isLogin')
  const {loginStatus,logout} =  (useContext(AuthContext));
  console.log("login222",loginStatus);
  // setIsLoggedIn(value);
  
  const navigate = useNavigate()
const logoutHandle = async () =>{
  // const navigate = useNavigate()

  const axiosResponse = await axios.post('http://localhost:3000/home/logout',{
      headers: {
        'Content-Type': 'application/json'}
      })
      logout();
  console.log('axiosResponse', axiosResponse)
  navigate('/');
}


  return (
    <div className="bg-indigo-950 flex justify-between items-center p-4">
      <div>
        <h1 className="text-white text-2xl font-bold">
          Crime Repository . . . . .
        </h1>
      </div>
      <div>
        <ul className="flex space-x-10 text-white">
          <Link to="/">Home</Link>
          <Link to="/home/crime-info">Crime Info</Link>

          <Link to="/home/crime-submit">Crime Submit</Link>
          <Link to="/home/crime-repository">Crime Repository</Link>
          <Link to="/home/dashbord">Dashbord</Link>
          {loginStatus ? (
            <>
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
