import { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";

const CreateReport = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    crimeType: "",
    incidentLocation: "",
    incidentTime: "",
    description: "",
  });

  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // --- CAMERA REFS ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- CAMERA POPUP STATE ---
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [captureStatus, setCaptureStatus] = useState(""); // feedback message inside modal

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setIsModelLoaded(true);
    };
    loadModels();
  }, []);

  const crimeTypes = [
    "Theft",
    "Assault",
    "Fraud",
    "Harassment",
    "Cyber Crime",
    "Domestic Violence",
    "Robbery",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Evidence Handlers ──────────────────────────────────────────
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "application/pdf",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
  ];
  const MAX_FILE_SIZE_MB = 20;
  const MAX_FILES = 5;

  const processFiles = (newFiles) => {
    const validFiles = [];
    const errors = [];
    Array.from(newFiles).forEach((file) => {
      if (evidenceFiles.length + validFiles.length >= MAX_FILES) {
        errors.push(`Max ${MAX_FILES} files allowed.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" — unsupported file type.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }
      if (evidenceFiles.some((f) => f.name === file.name)) {
        errors.push(`"${file.name}" already added.`);
        return;
      }
      validFiles.push(file);
    });
    if (errors.length) alert(errors.join("\n"));
    if (validFiles.length) setEvidenceFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileChange = (e) => processFiles(e.target.files);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };
  const removeFile = (index) =>
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎥";
    if (type.startsWith("audio/")) return "🎵";
    if (type === "application/pdf") return "📄";
    return "📎";
  };
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Add this effect to start camera on component mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    startCamera();

    // Cleanup: Stop camera when component unmounts
    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // ── Open Camera Popup ──────────────────────────────────────────
  const openCameraModal = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Human verification is required.");
      return;
    }
    if (!isModelLoaded) {
      alert("Security system is initializing...");
      return;
    }

    setCaptureStatus("Starting camera...");
    setShowCameraModal(true);
    setCameraReady(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          setCaptureStatus("Camera ready. Make sure your face is clearly visible.");
        };
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setCaptureStatus("Camera access denied. Please allow camera access and try again.");
    }
  };

  // ── Close Camera Popup ─────────────────────────────────────────
  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setCameraReady(false);
    setCaptureStatus("");
    setLoading(false);
  };

  // ── Capture & Submit (runs inside modal) ───────────────────────
  const handleCaptureAndSubmit = async () => {
    if (!cameraReady) return;

    setLoading(true);
    setCaptureStatus("Detecting face...");

    try {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions(),
      );
      console.log("Faces detected:", detections.length);

      if (detections.length === 0) {
        setCaptureStatus("⚠️ No face detected! Please ensure you are clearly visible and in good lighting.");
        setLoading(false);
        return;
      }

      if (detections.length > 1) {
        setCaptureStatus(`⚠️ ${detections.length} people detected in frame! Only one person should be present during verification. Please make sure you are alone.`);
        setLoading(false);
        return;
      }

      // Exactly one face — check confidence score for clarity
      const detection = detections[0];
      console.log("Detection Score:", detection.score);

      if (detection.score < 0.6) {
        setCaptureStatus("⚠️ Face is not clear enough! Please improve lighting, move closer, and ensure your face is fully visible.");
        setLoading(false);
        return;
      }

      setCaptureStatus("Face verified ✓ Capturing photo...");

      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      // Stop camera stream after capture
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }

      setCaptureStatus("Submitting report...");

      const photoBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.7),
      );

      const payload = new FormData();
      Object.keys(formData).forEach((key) =>
        payload.append(key, formData[key]),
      );
      payload.append("confirm_email", honeypot);
      evidenceFiles.forEach((file) => payload.append("evidence", file));
      payload.append("userPhoto", photoBlob, "user_capture.jpg");
      payload.append("humanVerified", "true");

      await axios.post(
        "http://localhost:3000/api/volunteer/create-report",
        payload,
        { withCredentials: true },
      );

      setShowCameraModal(false);
      alert("Report submitted successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        crimeType: "",
        incidentLocation: "",
        incidentTime: "",
        description: "",
      });
      setEvidenceFiles([]);
      setHoneypot("");
    } catch (error) {
      console.error("Submission Error:", error);
      setCaptureStatus("⚠️ Submission failed. Camera access may have been denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      {/* CAMERA ELEMENTS — hidden video used for face detection */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* ── CAMERA POPUP MODAL ────────────────────────────────────── */}
      {showCameraModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <div className="relative w-full max-w-md mx-4 bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <h3 className="text-white font-semibold text-lg tracking-wide">
                  Identity Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={closeCameraModal}
                disabled={loading}
                className="text-slate-400 hover:text-white text-2xl leading-none transition-colors disabled:opacity-40"
                title="Cancel"
              >
                ✕
              </button>
            </div>

            {/* Live Camera Feed */}
            <div className="relative bg-black w-full" style={{ aspectRatio: "4/3" }}>
              <video
                autoPlay
                playsInline
                ref={(el) => {
                  // Attach the live stream to this visible video element
                  if (el && cameraStream) {
                    el.srcObject = cameraStream;
                  }
                }}
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Corner brackets overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top-left */}
                <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl"></div>
                {/* Top-right */}
                <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr"></div>
                {/* Bottom-left */}
                <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-indigo-400 rounded-bl"></div>
                {/* Bottom-right */}
                <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br"></div>

                {/* Center face guide ring */}
                <div
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -55%)",
                    width: "120px",
                    height: "140px",
                    border: "1.5px dashed rgba(99,102,241,0.5)",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>

              {/* Not ready overlay */}
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-300 text-sm">Starting camera...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Status Message */}
            <div className="px-6 py-3 min-h-11 flex items-center">
              <p className={`text-sm ${captureStatus.startsWith("⚠️") ? "text-red-400" : captureStatus.includes("✓") ? "text-green-400" : "text-slate-400"}`}>
                {captureStatus}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                type="button"
                onClick={closeCameraModal}
                disabled={loading}
                className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCaptureAndSubmit}
                disabled={!cameraReady || loading}
                className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all
                  ${!cameraReady || loading
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-amber-600 text-black hover:bg-amber-500 cursor-pointer"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-slate-600 border-t-black rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  "Capture & Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl">
        <div className="bg-slate-800/60 backdrop-blur-xl p-10 rounded-2xl border border-slate-600 shadow-xl">
          <h1 className="text-3xl font-bold mb-8 text-center tracking-wide">
            Report an Incident
          </h1>

          <form onSubmit={openCameraModal} className="space-y-10">
            {/* ── Victim Information ── */}
            <div>
              <h2 className="text-xl font-semibold mb-6 text-indigo-400 border-b border-slate-600 pb-2">
                Victim Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Victim Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Victim Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Victim Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* honeypot field */}
              <div className="absolute opacity-0 pointer-events-none -z-50">
                <input
                  type="text"
                  name="confirm_email"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex="-1"
                  autoComplete="off"
                  readOnly
                />
              </div>

              <input
                type="text"
                name="address"
                placeholder="Victim Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-4 mt-6 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30"
              />
            </div>

            {/* ── Incident Details ── */}
            <div>
              <h2 className="text-xl font-semibold mb-6 text-indigo-400 border-b border-slate-600 pb-2">
                Incident Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  name="crimeType"
                  value={formData.crimeType}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30"
                >
                  <option value="">Select Crime Type</option>
                  {crimeTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="incidentLocation"
                  placeholder="Incident Location"
                  value={formData.incidentLocation}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30"
                />
                <input
                  type="datetime-local"
                  name="incidentTime"
                  value={formData.incidentTime}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30"
                />
              </div>
              <textarea
                name="description"
                placeholder="Describe the incident in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                rows="8"
                className="w-full p-4 mt-6 rounded-xl bg-slate-900 text-white border border-slate-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-30 resize-none"
              />
            </div>

            {/* ── Evidence Upload ── */}
            <div>
              <h2 className="text-xl font-semibold mb-2 text-indigo-400 border-b border-slate-600 pb-2">
                Evidence
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Upload photos, videos, audio, or documents (max {MAX_FILES}{" "}
                files · {MAX_FILE_SIZE_MB}MB each)
              </p>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                  ${
                    dragOver
                      ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
                      : "border-slate-500 hover:border-indigo-500 hover:bg-slate-700/30 bg-slate-900/40"
                  }`}
              >
                <div className="text-4xl mb-3">📁</div>
                <p className="text-slate-300 font-medium">
                  Drag & drop files here, or{" "}
                  <span className="text-indigo-400 underline">browse</span>
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Images · Videos · Audio · PDF
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* File List */}
              {evidenceFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest">
                    Attached Files ({evidenceFiles.length}/{MAX_FILES})
                  </p>
                  {evidenceFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">
                          {getFileIcon(file.type)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {formatSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-slate-500 hover:text-red-400 transition-colors text-lg ml-4 shrink-0"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 border border-slate-700">
              <input
                className="cursor-pointer"
                type="checkbox"
                onChange={(e) => setIsVerified(e.target.checked)}
              />
              <span className="text-xs text-slate-400">
                I confirm that all details provided are accurate and complete.
              </span>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading || !isVerified || !isModelLoaded}
              className={`w-full mt-8 py-4 font-black text-[11px] uppercase tracking-[0.3em] transition-all 
               ${
                 loading || !isVerified || !isModelLoaded
                   ? "bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed"
                   : "bg-amber-600 text-black hover:bg-amber-500 cursor-pointer"
               }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-slate-600 border-t-black rounded-full animate-spin"></div>
                  INITIALIZING...
                </span>
              ) : !isModelLoaded ? (
                "INITIALIZING SECURITY..."
              ) : (
                "INITIALIZE REPORT SUBMISSION"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;