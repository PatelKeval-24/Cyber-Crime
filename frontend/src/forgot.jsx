import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function ForgotPassword() {
  const [email, setEmail]               = useState("");
  const [otp, setOtp]                   = useState("");
  const [newPassword, setNewPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep]                 = useState(1);

  // ui state
  const [loading, setLoading]           = useState(false);
  const [emailError, setEmailError]     = useState("");
  const [otpError, setOtpError]         = useState("");
  const [passError, setPassError]       = useState("");
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [otpSuccess, setOtpSuccess]     = useState(false);

  // ── original api calls unchanged ─────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email) { setEmailError("Please enter your email address."); return; }
    setEmailError("");
    setLoading(true);
    await axios.post("http://localhost:3000/auth/forgot-password", { email });
    setLoading(false);
    setStep(2);
  };

  const handleVerifyOtp = async () => {
    // plug in your verify-otp endpoint here
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/auth/verify-otp", { email, otp });
      console.log(res.data.success)
      setOtpError("");
      setOtpSuccess(res.data.success);
      setTimeout(() => { setOtpSuccess(false); setStep(3); }, 800);
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleResendOtp = async () => {
  //   setOtp("");
  //   setOtpError("");
  //   setLoading(true);
  //   await axios.post("http://localhost:3000/auth/forgot-password", { email });
  //   setLoading(false);
  // };

  const handleReset = async () => {
    if (newPassword !== confirmPassword) { setPassError("Passwords do not match."); return; }
    setPassError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/auth/reset-password", {
        email, otp, newPassword
      });
      alert(res.data.message);
      // Redirect to login
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch    = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  const steps = ["Email", "Verify OTP", "New Password"];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      {/* bg glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900/90 border border-white/8 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">

          {/* accent strip — colour changes per step */}
          <div className={`h-[3px] w-full bg-gradient-to-r transition-all duration-500
            ${step === 1 ? "from-orange-500 to-rose-500"
            : step === 2 ? "from-sky-500 to-violet-500"
            : "from-emerald-500 to-teal-500"}`} />

          <div className="px-8 py-10 flex flex-col gap-7">

            {/* brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-red-500/30">
                C
              </div>
              <span className="text-white text-base font-extrabold tracking-tight">
                Crime Report{" "}
                <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">Desk</span>
              </span>
            </div>

            {/* 3-step indicator */}
            <div className="flex items-center gap-1">
              {steps.map((label, i) => {
                const idx     = i + 1;
                const done    = step > idx;
                const current = step === idx;
                return (
                  <div key={label} className="flex items-center gap-1 flex-1 last:flex-none">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold transition-all duration-300 whitespace-nowrap
                      ${done    ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400"
                      : current ? "bg-orange-500/15 border-orange-500/40 text-orange-300"
                      :           "bg-white/3 border-white/8 text-slate-600"}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
                        ${done ? "bg-emerald-500 text-white" : current ? "bg-orange-500 text-white" : "bg-white/10 text-slate-600"}`}>
                        {done ? "✓" : idx}
                      </span>
                      {label}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-px mx-1 transition-all duration-500 ${step > idx ? "bg-emerald-500/40" : "bg-white/8"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ══ STEP 1 — EMAIL ══════════════════════════════════════════ */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-orange-400 mb-1">// Step 1 of 3</p>
                  <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Forgot Password?</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Enter your registered email and we'll send you an OTP.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-slate-500">✉️</span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                      className={`w-full pl-10 pr-4 py-3 bg-white/4 border rounded-xl text-slate-200 text-sm placeholder-slate-600 outline-none transition-all
                        ${emailError
                          ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                          : "border-white/8 focus:border-orange-500/50 focus:bg-orange-500/4 focus:ring-2 focus:ring-orange-500/10"
                        }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-rose-400 text-xs flex items-center gap-1.5">⚠ {emailError}</p>
                  )}
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP…</>
                    : "Send OTP →"
                  }
                </button>

                <p className="text-center text-slate-600 text-xs">
                  Remember your password?{" "}
                  <Link to="/home/login" className="text-orange-400 hover:text-orange-300 transition-colors">Back to Login</Link>
                </p>
              </div>
            )}

            {/* ══ STEP 2 — VERIFY OTP ═════════════════════════════════════ */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-sky-400 mb-1">// Step 2 of 3</p>
                  <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Verify OTP</h1>
                  <p className="text-slate-500 text-sm mt-1.5">
                    We sent an OTP to <span className="text-slate-300 font-semibold">{email}</span>. Enter it below.
                  </p>
                </div>

                {/* OTP input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">One-Time Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-slate-500">🔑</span>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); if (otpError) setOtpError(""); }}
                      className={`w-full pl-10 pr-4 py-3 bg-white/4 border rounded-xl text-slate-200 text-sm placeholder-slate-600 outline-none font-mono tracking-[0.3em] transition-all
                        ${otpError
                          ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                          : otpSuccess
                            ? "border-emerald-500/60"
                            : "border-white/8 focus:border-sky-500/50 focus:bg-sky-500/4 focus:ring-2 focus:ring-sky-500/10"
                        }`}
                    />
                  </div>

                  {/* error */}
                  {otpError && (
                    <div className="flex items-center justify-between bg-rose-500/8 border border-rose-500/20 rounded-xl px-4 py-3">
                      <p className="text-rose-400 text-xs flex items-center gap-1.5">⚠ {otpError}</p>
                      <button
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-xs font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/25 px-3 py-1 rounded-lg hover:bg-orange-500/20 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0 ml-3"
                      >
                        {loading ? "Resending…" : "Resend OTP"}
                      </button>
                    </div>
                  )}

                  {/* success */}
                  {otpSuccess && (
                    <p className="text-emerald-400 text-xs flex items-center gap-1.5">✓ OTP verified! Redirecting…</p>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || !otp || otpSuccess}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400 shadow-lg shadow-sky-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</>
                    : otpSuccess
                      ? "✓ Verified!"
                      : "Verify OTP →"
                  }
                </button>

                <button
                  onClick={() => { setStep(1); setOtp(""); setOtpError(""); }}
                  className="text-center text-slate-600 text-xs hover:text-slate-400 transition-colors cursor-pointer"
                >
                  ← Wrong email? Go back
                </button>
              </div>
            )}

            {/* ══ STEP 3 — NEW PASSWORD ════════════════════════════════════ */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-emerald-400 mb-1">// Step 3 of 3</p>
                  <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Set New Password</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Choose a strong new password for your account.</p>
                </div>

                {/* new password */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-slate-500">🔒</span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPassError(""); }}
                      className="w-full pl-10 pr-10 py-3 bg-white/4 border border-white/8 rounded-xl text-slate-200 text-sm placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:bg-emerald-500/4 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                    <button onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors">
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-slate-500">🔒</span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPassError(""); }}
                      className={`w-full pl-10 pr-10 py-3 bg-white/4 border rounded-xl text-slate-200 text-sm placeholder-slate-600 outline-none transition-all
                        ${passwordsMismatch
                          ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                          : passwordsMatch
                            ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                            : "border-white/8 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                        }`}
                    />
                    <button onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors">
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>

                  {passwordsMismatch && (
                    <p className="text-rose-400 text-xs flex items-center gap-1.5">⚠ Passwords do not match. Please re-enter.</p>
                  )}
                  {passwordsMatch && (
                    <p className="text-emerald-400 text-xs flex items-center gap-1.5">✓ Passwords match!</p>
                  )}
                  {passError && (
                    <p className="text-rose-400 text-xs flex items-center gap-1.5">⚠ {passError}</p>
                  )}
                </div>

                <button
                  onClick={handleReset}
                  disabled={loading || !passwordsMatch}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting…</>
                    : "✓ Reset Password"
                  }
                </button>
              </div>
            )}

          </div>

          {/* card footer */}
          <div className="px-8 py-4 border-t border-white/6 bg-black/20">
            <p className="font-mono text-[10px] text-slate-700 text-center tracking-widest uppercase">
              Crime Report Desk · Secure Account Recovery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;