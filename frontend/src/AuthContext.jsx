import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginStatus , setloginStatus] = useState(false)
  const login = () => {
    setloginStatus(true);
  };
  const logout = () => {
    setloginStatus(false);
  };
  return (
    <AuthContext.Provider value={{ loginStatus, login, logout }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};
// export const useAuth = () => {
//   return useContext(AuthContext);
// };
