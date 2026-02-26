import axios from "axios";

const Register = () => {
  // when it click it get form data and send to backend /// and then backend will send response to frontend and then frontend will show response to user
const registerHandler= async (e)=>{
  e.preventDefault();
  const form = e.target;
  const registerData={
    name: form.name.value,
    email: form.email.value,
    contectNumber: form.contectNumber.value,
    address: form.address.value,
    password: form.password.value,
    password2: form.password2.value,
    registerTime: new Date().toString()
}
 if (!registerData.name || !registerData.email || !registerData.contectNumber || !registerData.address || !registerData.password || !registerData.password2) {
  alert("Please fill all the fields");
  return;
 }else if (registerData.password !== registerData.password2) {
  alert("Password and Confirm Password do not match");
  return;
 }
 
  console.log(registerData);
  const axiosResponse = await axios.post('https://cyber-crime-desk-backend.onrender.com/home/register', registerData , {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(axiosResponse.data);

}
  return (
    <>
    <div className='flex flex-col items-center justify-center h-screen bg-[url("https://media.assettype.com/freepressjournal/2024-01/28202f26-dc29-488f-8542-8c64e1c67114/LS_lead_freepik_2_jan_7.jpg")] bg-cover'>
      <div className='flex flex-col w-1/2 text-basee m-10 p-10 rounded-lg backdrop-blur-10 bg-black/90 justify-center items-center'>
      <h1 className='text-blue-300 text-3xl font-bold mb-4 text-center'>User Registration </h1>
       <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2 text-blue-200 '>
      <form onSubmit={registerHandler}>
      <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2 '>
        <label htmlFor="name" className='text-blue-300'>User Name :</label>
        <input type="text" id='name' name='name' placeholder='User Name' className='border-b-2 rounded-md text-blue-200' />
      </div>
      <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2 '>
        <label htmlFor="email" className='text-blue-300'>Email :</label>
        <input type="email" id='email' name='email' placeholder='User Email id' className='border-b-2 rounded-md text-blue-200 ' />
      </div>
      <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2 '>
        <label htmlFor="contectNumber" className='text-blue-300'>Contact Number :</label>
        <input type="text" id='contectNumber' name='contectNumber' placeholder='User Contect Number' className='border-b-2 rounded-md text-blue-200' />
      </div>
      <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2 '>
        <label htmlFor="address" className='text-blue-300'>Address :</label>
        <input type="text" id='address' name='address' placeholder='User Address' className='border-b-2 rounded-md text-blue-200' />
      </div>
      <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2 '>
        <label htmlFor="password" className='text-blue-300'>User Password :</label>
        <input type="text" id='password' name='password' placeholder='User Password' className='border-b-2 rounded-md text-blue-200'/>
      </div>
       <div className='mb-4 justify-center items-center border-2 border-gray-300 rounded-md p-2 '>
        <label htmlFor="password2" className='text-blue-300'>Confirm Password :</label>
        <input type="text" id='password2' name='password2' placeholder='Confirm Password' className='border-b-2 rounded-md text-blue-200'/>
      </div>
      <button type='submit' className='border-2 border-gray-300 rounded-md m-2 p-2 w-24'>Register</button>
     </form>
      </div>
    </div>
    </div>
      
    </>
  )
}

export default Register
