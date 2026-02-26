import React,{useContext} from "react";
import axios from 'axios';
import { AuthContext } from "../AuthContext";


const CrimeSubmit = () => {
  const inputStyle = "p-1  bg-gray-200 border-2 border-gray-500 rounded-lg "
  const hedingStyle = "text-white text-center font-bold p-3"
  const token = useContext(AuthContext);
  
  const reportsHandler =async (e) =>{
    e.preventDefault();
    const form = e.target;
    console.log(form.vemail.value)
    const reportData ={
      name: form.vname.value,
      age : form.vage.value,
      gender: form.gender.value,
      victimAddress : form.address.value,
      contact: form.vnumber.value,
      email : form.vemail.value,
      crimeType : form.crimeType.value,
      crimeCategory : form.crimeCategory.value,
      priority : form.priority.value,
      location : form.location.value,
      description : form.dtext.value,
      token:token
    }
    // console.log(token,"jwt")

    // console.log(reportData)
    const reportsended =await axios.post("https://cyber-crime-desk-backend.onrender.com/home/crime-submit",{reportData},{
      headers : {
        'Content-Type': 'application/json'
      }
    })
    console.log(reportsended)

  }



  return (
    <>
      <div className="bg-gray-900 h-screen">
        <h1 className="text-white  text-2xl font-bold text-center">
          Crime Submit
        </h1>
      <form onSubmit={reportsHandler} className="flex bg-blue-300/20 m-15 border rounded-3xl">
        
        <div className="w-1/2 p-5 flex flex-col gap-3   hover:bg-blue-400">
          <h1 className={hedingStyle} >Victim Information</h1>
        <label className="">Name :</label>
        <input type="text" name="vname" id="vname" className={inputStyle} required/>

        <label>Age</label>
        <input type="number" name="vage" id="vage" className={inputStyle} />

        <div>
        <input type="radio" id="male" name="gender" value="male" required/>
        <label htmlFor="male">Male</label>

        <input type="radio" id="female" name="gender" value="female" required/>
        <label htmlFor="female">Female</label>

        <input type="radio" id="other" name="gender" value="other"required/>
        <label htmlFor="other">Other</label>
        </div>

         <label>Address : </label>
         <input type="text" name="address" id="address" className={inputStyle} required/>

         <label>Contact Number : </label>
         <input type="number" name="vnumber" id="vnumber" className={inputStyle} required/> 
         

        <label>Email :</label>
        <input type="email" name="vemail" id="vemail" className={inputStyle} required/>

        </div>
        <div className="w-1/2 p-5 flex flex-col gap-3  hover:bg-blue-400">
          <h1 className={hedingStyle} >Crime Information</h1>

        <label>Crime Type :</label>
        <input type="text" name="crimeType" id="crimeType" className={inputStyle} />

        <label>Crime Category :</label>
        <input type="text" name="crimeCategory" id="crimeCategory" className={inputStyle} />

        <div>
        <input type="radio" id="high" name="priority" value="high" required/>
        <label htmlFor="high">High</label>

        <input type="radio" id="moderate" name="priority" value="moderate" required/>
        <label htmlFor="moderate">Moderate</label>

        <input type="radio" id="low" name="priority" value="low"required/>
        <label htmlFor="low">Low</label>
        </div>

        <label>Location : </label>
         <input type="text" name="location" id="location" className={inputStyle} required/>

        <label>Date of Crime</label>
        <input type="date" name="crimeDate" id="crimeDate" className={inputStyle}  />

        <label>Description :</label>
        <textarea name="dtext" id="dtext" className="h-1/5 bg-amber-100 border-2 border-gray-600 rounded-lg"/>

        <button type="submit" className="bg-fuchsia-400">submit</button>
        </div>
      </form>
      </div>
    </>
  );
};

export default CrimeSubmit;

// import React from "react";
// import { motion } from "framer-motion";

// const CrimeDetails = () => {
//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-6">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8"
//       >
//         {/* Header */}
//         <div className="border-b border-gray-700 pb-4 mb-6">
//           <h1 className="text-3xl font-bold text-indigo-400">
//             Cyber Fraud Report
//           </h1>
//           <p className="text-sm text-gray-400 mt-1">
//             Report ID: CR-2026-00421 • Status: <span className="text-yellow-400">Under Investigation</span>
//           </p>
//         </div>

//         {/* Grid Info */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Victim Info */}
//           <section className="space-y-3">
//             <h2 className="section-title">Victim Information</h2>
//             <Info label="Name" value="Rahul Sharma" />
//             <Info label="Gender" value="Male" />
//             <Info label="Contact" value="+91 98765 43210" />
//             <Info label="Email" value="rahul@gmail.com" />
//           </section>

//           {/* Crime Info */}
//           <section className="space-y-3">
//             <h2 className="section-title">Crime Information</h2>
//             <Info label="Crime Type" value="Online Financial Fraud" />
//             <Info label="Crime Date" value="12 Jan 2026" />
//             <Info label="Priority" value="High" />
//             <Info label="Location" value="Ahmedabad, Gujarat, India" />
//           </section>
//         </div>

//         {/* Description */}
//         <div className="mt-8">
//           <h2 className="section-title">Detailed Description</h2>
//           <p className="text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-gray-700">
//             The victim received a phishing message claiming to be from a bank.
//             After clicking the link and entering credentials, ₹45,000 was deducted
//             from the victim’s account without authorization.
//           </p>
//         </div>

//         {/* Evidence */}
//         <div className="mt-8">
//           <h2 className="section-title">Evidence</h2>
//           <div className="border border-dashed border-gray-600 rounded-xl p-4 text-gray-400 text-sm">
//             Uploaded screenshots / documents will appear here.
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-10 flex flex-col md:flex-row md:justify-between gap-4">
//           <div className="text-sm text-gray-400">
//             Submitted By: <span className="text-gray-200">Rahul Sharma</span>
//           </div>

//           <div className="flex gap-3">
//             <button className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600">
//               Download Report
//             </button>
//             <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700">
//               Mark as Reviewed
//             </button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Reusable styles */}
//       <style>{`
//         .section-title {
//           font-size: 1.1rem;
//           font-weight: 600;
//           color: #a5b4fc;
//           margin-bottom: 0.5rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// const Info = ({ label, value }) => (
//   <div className="flex justify-between border-b border-gray-700 pb-1 text-sm">
//     <span className="text-gray-400">{label}</span>
//     <span className="text-gray-200">{value}</span>
//   </div>
// );

// export default CrimeDetails;
