import React, { useContext, useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { AuthContext } from "../AuthContext";



const dataURLtoBlob = (dataURL) => {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const CrimeSubmit = () => {
  const token = useContext(AuthContext);
  const formRef = useRef();
  const videoRef = useRef();
  const [isVerifying, setIsVerifying] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null); 

  // 1. Load Models (Do this in useEffect)
  useEffect(() => {
    const loadModels = async () => {
    try {
      // Use the absolute path from the public folder
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      console.log("Face API Models Loaded Successfully");
    } catch (err) {
      console.error("Failed to load models:", err);
    }
  };
  loadModels();
  }, []);

  const startVerification = async () => {
    setIsVerifying(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const verifyAndCapture = async () => {
    // 2. Detect Faces
    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions(),
    );

    if (detections.length === 1) {
      // 3. Take a Snapshot
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

      const photoBlob = canvas.toDataURL("image/jpeg");
      setUserPhoto(photoBlob);
      alert("Verification successful! Human detected.");
      stopCamera();
    } else if (detections.length > 1) {
      alert("Error: Multiple people detected. Please be alone.");
    } else {
      alert("Error: No human detected.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    stream.getTracks().forEach((track) => track.stop());
    setIsVerifying(false);
  };

  // Update your reportsHandler to include 'userPhoto' in the FormData

  const reportsHandler = async (e) => {
  e.preventDefault();
  const form = e.target;

  // 1. Show overlay and start camera
  setIsVerifying(true);
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  } catch (err) {
    alert("Camera access denied. Please allow camera to submit.");
    setIsVerifying(false);
    return;
  }

  // 2. Wait for camera warm-up and detect
  setTimeout(async () => {
    try {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length !== 1) {
        alert(detections.length === 0 ? "No face detected. Try again." : "Multiple faces detected. Please be alone.");
        stopCameraFromStream(stream);
        return;
      }

      // 3. Capture Photo
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      const photoBase64 = canvas.toDataURL("image/jpeg");
      const photoBlob = dataURLtoBlob(photoBase64);

      // 4. Build FormData
      const formData = new FormData();
      formData.append("name", form.vname.value);
      formData.append("age", form.vage.value);
      formData.append("gender", form.gender.value);
      formData.append("victimAddress", form.address.value);
      formData.append("contact", form.vnumber.value);
      formData.append("email", form.vemail.value);
      formData.append("crimeType", form.crimeType.value);
      formData.append("crimeCategory", form.crimeCategory.value);
      formData.append("priority", form.priority.value);
      formData.append("location", form.location.value);
      formData.append("crimeDate", form.crimeDate.value);
      formData.append("description", form.dtext.value);

      if (form.file.files) {
        Array.from(form.file.files).forEach(file => {
    formData.append("evidence", file); 
  });
      }

      // Append the identity photo
      formData.append("userPhoto", photoBlob, "identity_check.jpg");

      navigator.geolocation.getCurrentPosition(async(position) => {
      const { latitude, longitude } = position.coords;

      console.log("User Location:", latitude, longitude);
    }, (error) => {
      console.error("User denied location access", error);
    });

      // 5. Submit to Backend
      await axios.post("http://localhost:3000/home/crime-submit", formData,{latitude,longitude}, {
        headers: { Authorization: token.token },
        withCredentials: true,
      });

      alert("Report submitted successfully!");
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      alert("Error during submission.");
    } finally {
      stopCameraFromStream(stream);
    }
  }, 2000);
};

// Helper to stop camera properly
const stopCameraFromStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  setIsVerifying(false);
};

    // const reportData = {
    //   name: form.vname.value,
    //   age: form.vage.value,
    //   gender: form.gender.value,
    //   victimAddress: form.address.value,
    //   contact: form.vnumber.value,
    //   email: form.vemail.value,
    //   crimeType: form.crimeType.value,
    //   crimeCategory: form.crimeCategory.value,
    //   priority: form.priority.value,
    //   location: form.location.value,
    //   evidence:form.file.value,
    //   crimeDate: form.crimeDate.value,
    //   description: form.dtext.value,
    //   token: token,
    // };

  //   const reportsended = await axios.post(
  //     "http://localhost:3000/home/crime-submit",
  //     formData,
  //     {
  //       headers: {
  //         withCredentials: true,
  //         Authorization: token.token,
  //       },
  //     },
  //   );
  //   console.log(reportsended);
  //   alert("Report submitted");
  //   formRef.current.reset();
  // };

  const inputCls =
    "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm";

  const labelCls =
    "block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1";

  const fieldCls = "flex flex-col gap-1";

  return (
    <>
   
      {/* --- NEW: Verification Overlay --- */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Verifying Identity...</h2>
          <div className="relative rounded-2xl overflow-hidden border-4 border-blue-500 max-w-md">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-auto" />
            <div className="absolute inset-0 border-40 border-black/40 pointer-events-none rounded-full scale-150" />
          </div>
          <p className="mt-4 text-gray-400">Please keep your face clearly visible</p>
        </div>
      )}
    <div className="min-h-screen bg-gray-950 text-gray-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 bg-blue-500 rounded-full" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Crime Report
          </h1>
        </div>
        <p className="text-gray-500 text-sm ml-4">
          Submit a new incident report securely
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={reportsHandler}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Victim Information */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-[0_0_0_1px_rgba(96,165,250,0.08),0_0_20px_4px_rgba(96,165,250,0.06),0_0_50px_10px_rgba(96,165,250,0.03)]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Victim Information
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <div className={fieldCls}>
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  name="vname"
                  className={inputCls}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={fieldCls}>
                  <label className={labelCls}>Age</label>
                  <input
                    type="number"
                    name="vage"
                    className={inputCls}
                    placeholder="Age"
                    min="0"
                    max="120"
                  />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls}>Gender</label>
                  <div className="flex gap-3 items-center h-9">
                    {["Male", "Female", "Other"].map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-1.5 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g.toLowerCase()}
                          required
                          className="accent-blue-500 cursor-pointer"
                        />
                        <span className="text-gray-400 text-xs group-hover:text-gray-200 transition-colors">
                          {g}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={fieldCls}>
                <label className={labelCls}>Address</label>
                <input
                  type="text"
                  name="address"
                  className={inputCls}
                  placeholder="Residential address"
                  required
                />
              </div>

              <div className={fieldCls}>
                <label className={labelCls}>Contact Number</label>
                <input
                  type="number"
                  name="vnumber"
                  className={inputCls}
                  placeholder="Phone number"
                  required
                />
              </div>

              <div className={fieldCls}>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  name="vemail"
                  className={inputCls}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Crime Information */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-[0_0_0_1px_rgba(96,165,250,0.08),0_0_20px_4px_rgba(96,165,250,0.06),0_0_50px_10px_rgba(96,165,250,0.03)]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
              <svg
                className="w-4 h-4 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Crime Information
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3">
                <div className={fieldCls}>
                  <label className={labelCls}>Crime Type</label>
                  <input
                    type="text"
                    name="crimeType"
                    className={inputCls}
                    placeholder="e.g. Theft"
                  />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls}>Category</label>
                  <input
                    type="text"
                    name="crimeCategory"
                    className={inputCls}
                    placeholder="e.g. Property"
                  />
                </div>
              </div>

              <div className={fieldCls}>
                <label className={labelCls}>Priority</label>
                <div className="flex gap-2">
                  {[
                    {
                      label: "High",
                      color: "text-red-400 border-red-800 hover:border-red-500",
                      accent: "accent-red-500",
                    },
                    {
                      label: "Moderate",
                      color:
                        "text-yellow-400 border-yellow-800 hover:border-yellow-500",
                      accent: "accent-yellow-500",
                    },
                    {
                      label: "Low",
                      color:
                        "text-green-400 border-green-800 hover:border-green-500",
                      accent: "accent-green-500",
                    },
                  ].map(({ label, color, accent }) => (
                    <label
                      key={label}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-gray-800 cursor-pointer flex-1 justify-center transition-colors ${color}`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={label.toLowerCase()}
                        required
                        className={accent}
                      />
                      <span className="text-xs font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={fieldCls}>
                <label className={labelCls}>Location</label>
                <input
                  type="text"
                  name="location"
                  className={inputCls}
                  placeholder="Crime location"
                  required
                />
              </div>

              <div className={fieldCls}>
                <label className={labelCls}>Date of Crime</label>
                <input
                  type="date"
                  name="crimeDate"
                  className={inputCls + " scheme-dark"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4 shadow-[0_0_0_1px_rgba(96,165,250,0.08),0_0_20px_4px_rgba(96,165,250,0.06),0_0_50px_10px_rgba(96,165,250,0.03)]">
          <div className={fieldCls}>
            <label className={labelCls}>
              Evidence (Images, Docs, etc.) - Max 5
            </label>
            <input
              name="file"
              type="file"
              multiple // Allows selecting more than one
              accept="*/*" // Allows any file type
              onChange={(e) => {
                const files = Array.from(e.target.files);
                if (files.length > 5) {
                  alert("You can only upload a maximum of 5 files");
                  e.target.value = "";
                }
              }}
              className="w-full text-xs text-gray-400 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 cursor-pointer
      file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs
      file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600 transition-colors"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Supported: JPG, PNG, PDF, DOCX, etc.
            </p>
          </div>

          {/* <div className={fieldCls}>
                <label className={labelCls}>Evidence (PDF)</label>
                <input
                  name="file"
                  type="file"
                  accept=".pdf"
                  className="w-full text-xs text-gray-400 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 cursor-pointer
                    file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs
                    file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600 transition-colors"
                />
              </div><br/> */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-800">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Description
            </h2>
          </div>
          <textarea
            name="dtext"
            rows={4}
            placeholder="Describe the incident in detail..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-500/30 active:bg-blue-700 text-white/35 hover:text-white/80 font-semibold px-8 py-2.5 rounded-lg transition-colors text-sm shadow-[0_0_4px_1px_rgba(255,255,255,0.4),0_0_16px_4px_rgba(167,139,250,0.6),0_0_40px_10px_rgba(109,40,217,0.4),0_0_70px_20px_rgba(30,27,75,0.6)]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Submit Report
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default CrimeSubmit;
