import rect,{useContext} from 'react'
import { AuthContext } from './AuthContext'
import { replace } from 'react-router-dom';
import { Navigate } from 'react-router-dom';



const ProtectedRoute = ({children, roles}) => {

  const {role , loginStatus} =useContext(AuthContext)
  console.log("protected route : ", roles, role)

  if(!loginStatus){
    return <Navigate to='/home/login' replace />;
  }
  if(!roles.includes(role)){
   return <Navigate to='/unauthorized' replace />;

  }else{
    if(role === 'admin'){
     <Navigate to='/home/admin-dashboard'  replace />;
    }else{
      <Navigate to='/home/volunteer-dashboard' replace />;
    } 
    return children; 
  }

}

export default ProtectedRoute
