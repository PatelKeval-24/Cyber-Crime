  import React from "react";
import { motion } from "framer-motion";



const CrimeInfo = () => {

  const Info = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-700 pb-1 text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-200">{value}</span>
  </div>
);
  return (
    <>
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8"
      >
        {/* Header */}
        <div className="border-b border-gray-700 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-indigo-400">
            Cyber Fraud Report
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Report ID: CR-2026-00421 • Status: <span className="text-yellow-400">Under Investigation</span>
          </p>
        </div>

        {/* Grid Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Victim Info */}
          <section className="space-y-3">
            <h2 className="section-title">Victim Information</h2>
            <Info label="Name" value="Rahul Sharma" />
            <Info label="Gender" value="Male" />
            <Info label="Contact" value="+91 98765 43210" />
            <Info label="Email" value="rahul@gmail.com" />
          </section>

          {/* Crime Info */}
          <section className="space-y-3">
            <h2 className="section-title">Crime Information</h2>
            <Info label="Crime Type" value="Online Financial Fraud" />
            <Info label="Crime Date" value="12 Jan 2026" />
            <Info label="Priority" value="High" />
            <Info label="Location" value="Ahmedabad, Gujarat, India" />
          </section>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="section-title">Detailed Description</h2>
          <p className="text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-gray-700">
            The victim received a phishing message claiming to be from a bank.
            After clicking the link and entering credentials, ₹45,000 was deducted
            from the victim’s account without authorization.
          </p>
        </div>

        {/* Evidence */}
        <div className="mt-8">
          <h2 className="section-title">Evidence</h2>
          <div className="border border-dashed border-gray-600 rounded-xl p-4 text-gray-400 text-sm">
            Uploaded screenshots / documents will appear here.
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col md:flex-row md:justify-between gap-4">
          <div className="text-sm text-gray-400">
            Submitted By: <span className="text-gray-200">Rahul Sharma</span>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600">
              Download Report
            </button>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700">
              Mark as Reviewed
            </button>
          </div>
        </div>
      </motion.div>

      {/* Reusable styles */}
      <style>{`
        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #a5b4fc;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>


      
    </>
  )
}

export default CrimeInfo
