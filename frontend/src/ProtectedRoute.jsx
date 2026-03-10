import rect,{useContext} from 'react'
import { AuthContext } from './AuthContext'
import { Navigate } from 'react-router-dom';



const ProtectedRoute = ({children, roles}) => {

  const {role , loginStatus,loading} =useContext(AuthContext)
  console.log("protected route : ", roles, role)

  if (loading) {
    return <div>Loading...</div>;   // wait until auth check finishes
  }

  if(!loginStatus){
    return <Navigate to='/home/login' replace />;
  }
  if(!roles.includes(role)){
   return <Navigate to='/unauthorized' replace />;

  }

  return children; 
  

}

export default ProtectedRoute
