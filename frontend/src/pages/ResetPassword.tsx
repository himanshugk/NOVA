import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMessage("No reset token provided. Please request a new link.");
      setStatus("error");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setStatus("error");
      return;
    }
    
    setStatus("loading");
    try {
      const res = await resetPassword(token as string, newPassword);
      if (res.message === "Password updated successfully") {
        setStatus("success");
        setTimeout(() => navigate("/auth"), 2000);
      } else {
        setErrorMessage(res.detail || "Failed to reset password. The link may have expired.");
        setStatus("error");
      }
    } catch (err: any) {
      setErrorMessage("Network error occurred.");
      setStatus("error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-blue-600 rounded-full mix-blend-screen filter blur-[200px] opacity-10"></div>
      </div>

      <div className="z-10 bg-[#111] border border-gray-800 p-8 pt-10 rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden">
        {/* Neon top border */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

        <h2 className="text-2xl font-bold tracking-tight mb-2 text-center text-white">
          Secure Comms
        </h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          {status === "success" ? "Access restored." : "Establish new encryption key."}
        </p>

        {status === "success" ? (
          <div className="text-center py-4 text-green-400 border border-green-400/20 bg-green-400/10 rounded-lg">
            Password update successful! <br/> Routing to uplink...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {status === "error" && (
              <div className="text-red-400 text-xs p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-center">
                {errorMessage}
              </div>
            )}
            
            <input
              type="password"
              required
              placeholder="New Password"
              className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!token || status === "loading"}
            />
            
            <input
              type="password"
              required
              placeholder="Confirm Password"
              className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!token || status === "loading"}
            />

            <button
              type="submit"
              disabled={!token || status === "loading"}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-3.5 rounded-lg transition-all text-sm mt-4 tracking-wider uppercase shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              {status === "loading" ? "Processing..." : "Confirm Override"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
