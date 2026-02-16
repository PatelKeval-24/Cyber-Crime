import Body1 from "./public-page/Body1";
import Navbar2 from "./public-page/Navbar2";
import CrimeInfo from "./public-page/CrimeInfo";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashbord from "./pages/dashbord";
import CrimeSubmit from "./pages/crimeSubmit";
import CrimeRepository from "./pages/CrimeRepository";
import {Login} from "./public-page/Login";
import Register from "./public-page/Register";

import { AuthProvider } from './AuthContext';

function App() {

  return (
    <>
 
    <BrowserRouter>
    <AuthProvider>
    <Navbar2/>
    {/* </AuthProvider> */}
    <Routes>
      <Route path="/" element={<Body1 />} />
      <Route path="/home/crime-info" element={<CrimeInfo />} />
      <Route path="/home/crime-submit" element={<CrimeSubmit />} />
      <Route path="/home/crime-repository" element={<CrimeRepository />} />
      <Route path="/home/dashbord" element={<Dashbord />} />
    
      <Route path="/home/login" element={<Login />} />
      <Route path="/home/register" element={<Register />} />
    </Routes>
    </AuthProvider>
    </BrowserRouter>
  
   

    </>
  )
}

export default App
