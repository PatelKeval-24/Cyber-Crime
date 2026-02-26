import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginStatus , setloginStatus] = useState(false)
  const [role , setRole] = useState(null)
  // console.log(role, 'let role')
  const [name , setName] = useState(null);
  const [token, setToken] = useState(null);
   
  const tokeninfo = (token) => {
      setToken(token);
  } 
  // console.log(token,"jwt")
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



console.log('login out', role)
  return (
    <AuthContext.Provider value={{ loginStatus, login, logout, role , name , token ,tokeninfo }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

