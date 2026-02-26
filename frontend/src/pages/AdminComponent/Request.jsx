import React,{useState,useEffect} from 'react'
import axios from 'axios'



export const Request = () => {
  const [data ,setData] =useState([]);
  
  // it show the request at admin dashboard
  useEffect(()=>{
  const getRequestHandler = async () =>{
  const axiosResponse = await axios.get('https://cyber-crime-desk.onrender.com/home/request',
    {headers: {
                'Content-Type': 'application/json'
              }})
  console.log('getData',axiosResponse.data.result);
  console.log( "first" ,data);
  
  setData(axiosResponse.data.result)
  // (prev) => prev.filter((data) => data._id !== user._id)
 console.log( "first2" ,data);
  }
  getRequestHandler();
},[])

// console.log("data after refresh ", data);
 const aproved = async(user) =>{
  const name =  user.name;
  const email = user.email;
  const aprove = 'aproved'

  try {
      const res =await  axios.post('https://cyber-crime-desk.onrender.com/home/request/approved',{name,email,aprove},
    {
      headers: {
                'Content-Type': 'application/json'
              }
    })

    setData((prev) => prev.filter((data) => data._id !== user._id))
    alert("approved successfully..");
    console.log(res);
  } catch (error) {
    console.log(error); 
  }
 }


 
 const reject = async(user) =>{
  const name =  user.name;
  const email = user.email;
  const aprove = 'reject'

  const res =await  axios.post('https://cyber-crime-desk.onrender.com/home/request/rejected',{name,email,aprove},
    {
      headers: {
                'Content-Type': 'application/json'
              }
    }
  )
 }

  return (
    <>
    <h1 className="text-white text-center text-2xl font-bold">
            Request
          </h1>
          {data.map((user)=>(
            <div key={user._id} className='flex justify-between items-center bg-blue-300 p-3 m-8 border rounded-2xl'>
            <div>
              <h1 className='' name='name' >Name: {user.name}</h1>
              <h1 className='' name='email' >Email: {user.email}</h1>
            </div>

            <div>
            <button onClick={() => aproved(user)} name='status' className='h-8 mr-2 w-30 text-amber-50 border-2 rounded-2xl bg-emerald-800'>Aprove</button>
            <button onClick={() => reject(user)} name='status' className='h-8 w-30  text-amber-50 border-2 rounded-2xl bg-red-500'>Reject</button>
            </div>
          </div>
          )  
          )} 
    </>
  )

}



