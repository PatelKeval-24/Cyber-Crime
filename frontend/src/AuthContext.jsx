import React, { createContext, useState, useContext ,useEffect } from "react";
import axios from 'axios'
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginStatus , setloginStatus] = useState(false)
  const [loading, setLoading] = useState(true); 
  const [role , setRole] = useState(null)
  // console.log(role, 'let role')
  const [name , setName] = useState(null);
  const [token, setToken] = useState(null);
   
  const tokeninfo = (token) => {
      setToken(token);
  } 
  // console.log(token,"jwt")

  useEffect(() => {

    axios.get("http://localhost:3000/home/verify-token", {
      withCredentials: true
    })
    .then(res => {

      setRole(res.data.user.role);
      setName(res.data.user.name);
      setloginStatus(true);

    })
    .catch(() => {

      setloginStatus(false);

    })
    .finally(() => {
      setLoading(false);   // ⭐ stop loading
    });

  }, []);

  const login = (user) => {
    setRole(user.role)
    setName(user.name)
    // console.log('login//////', user.role)
    // console.log('login//////', user)
    setloginStatus(true);
    return ;
  };
  const logout = () => {
    setloginStatus(false);
  };



// console.log('login out', role)
  return (
    <AuthContext.Provider value={{ loginStatus, login, logout, role , name , token ,tokeninfo,loading }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

