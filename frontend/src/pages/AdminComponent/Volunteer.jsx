import React,{useState,useEffect} from 'react'
import axios from 'axios'

const Volunteer = () => {
const [volunteerData , setvolunteerData] = useState([]) 

useEffect( () =>{
const  volunteerGet = async () =>{
     
    const response =await axios.get('https://cyber-crime-desk-backend.onrender.com/home/admin-dashboard/volunteer')

    console.log('res ;;;' ,response.data.volunteer)
    setvolunteerData(response.data.volunteer)
  }
  volunteerGet();
},[])
console.log(volunteerData)
  const Info = ({label , value}) =>(
      <div className='mr-4 ml-4 flex justify-between border-b-2 border-gray-600'>
          <spam className="" >{label}</spam>
          <spam className="" >{value}</spam>
         </div>
   )

  
  return (
    <>
    <h1 className="text-white text-center text-2xl font-bold">Volunteer </h1>
    <div className='grid grid-cols-3'>

    {volunteerData.length>0 ? (volunteerData.map((elem)=>(
    <div className='m-10  w-10/12 bg-indigo-200 border-2 border-yellow-100 rounded-3xl'>
      <div className='p-2'>
         <Info label='Name :' value= {elem.name} />
         <Info label='Email :' value={elem.email} />
         <Info label='Contact :' value= {elem.contectNumber} />
         <Info label='Address :' value={elem.address} />
         <Info label='Role :' value={elem.role} />
         <Info label='Status :' value={elem.status} />
      </div>
      </div> 
    ))) : (
      <p>loding..</p>
    )}
    </div>
    </>
  )
}
 

export default Volunteer
