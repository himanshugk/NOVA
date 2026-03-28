import { useState } from "react";
import { loginUser, guestLogin, linkAccount, registerUser, socialLogin, requestPasswordReset } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaYahoo, FaMicrosoft } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';

const Auth = () => {
  const { token, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [isForgotView, setIsForgotView] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const googleLoginAction = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await socialLogin({
          provider: 'google',
          access_token: tokenResponse.access_token,
          ...(token ? { guest_token: token } : {})
        });
        if (res.access_token) {
          login(res.access_token);
          navigate("/");
        } else {
          alert("Google validation rejected: " + JSON.stringify(res));
        }
      } catch (err) {
        console.error(err);
        alert("Google Login failed. Please check the backend route.");
      }
    },
    onError: () => alert('Google Identity Services failed to initialize. Please check your Client ID in .env'),
  });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token && !isLoginView) {
        const res = await linkAccount({ email, password }, token);
        if (res.message) {
          alert(res.message);
          navigate("/");
        }
      } else if (!isLoginView) {
        const username = email.split('@')[0] || "Pilot";
        const res = await registerUser({ username, email, password });
        if (res.id) {
          const loginRes = await loginUser({ email, password });
          if (loginRes.access_token) {
            login(loginRes.access_token);
            navigate("/");
          }
        } else {
          alert("Registration failed. Please check details.");
        }
      } else {
        const res = await loginUser({ email, password });
        if (res.access_token) {
          login(res.access_token);
          navigate("/");
        } else {
          alert("Authentication failed. Check credentials.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error during authentication");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email) {
        alert("Please enter your email");
        return;
      }
      const res = await requestPasswordReset(email);
      if (res.message) {
        setResetSent(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error sending reset request");
    }
  };

  const handleGuestLogin = async () => {
    try {
      const res = await guestLogin();
      if (res.access_token) {
        login(res.access_token);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in as guest. Ensure the backend is running.");
    }
  };

  const handleSocialAuth = async (provider: string) => {
    alert(`${provider} is not configured yet. Please use Google or Local Auth.`);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0a] text-white selection:bg-blue-500/30 font-sans">
      {/* Left Side: Immersive Graphic (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        <img
          src="/img/about.webp"
          alt="Gaming Realm"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 hover:scale-110 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/80" />

        <div className="relative z-10 w-full max-w-xl px-12 mt-32">
          <img src="/img/swordman.webp" alt="Pilot" className="w-48 h-auto mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
            ENTER<br /><span className="text-blue-500">THE NEXUS</span>
          </h1>
          <p className="text-gray-400 text-lg border-l-2 border-blue-500 pl-4">
            Join millions of pilots. Instant connect. Zero friction. The universe awaits your command.
          </p>
        </div>
      </div>

      {/* Right Side: Sleek Minimal Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24 bg-[#0a0a0a] relative z-10 pt-20">
        <div className="w-full max-w-sm">

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {isForgotView ? "Reset Password" : (token ? "Link Account" : (isLoginView ? "Welcome back" : "Create an account"))}
            </h2>
            <p className="text-gray-400 text-sm">
              {isForgotView ? "Enter your email to receive a reset link." : (token ? "Secure your guest profile with an email." : "Log in or sign up to save your progress permanently.")}
            </p>
          </div>

          {!token && !isForgotView && (
            <div className="flex gap-4 mb-8 border-b border-gray-800 pb-2">
              <button
                onClick={() => setIsLoginView(true)}
                className={`pb-2 text-sm font-semibold transition-all relative ${isLoginView ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Log In
                {isLoginView && <div className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
              <button
                onClick={() => setIsLoginView(false)}
                className={`pb-2 text-sm font-semibold transition-all relative ${!isLoginView ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Sign Up
                {!isLoginView && <div className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
            </div>
          )}

          {!isForgotView && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button type="button" onClick={() => googleLoginAction()} className="flex items-center justify-center p-2.5 bg-[#111] hover:bg-[#1a1a1a] border border-gray-800 rounded-lg transition-colors group">
                <FcGoogle className="size-5 group-hover:scale-110 transition-transform" />
              </button>
              <button onClick={() => handleSocialAuth('Microsoft')} className="flex items-center justify-center p-2.5 bg-[#111] hover:bg-[#1a1a1a] border border-gray-800 rounded-lg transition-colors group">
                <FaMicrosoft className="size-4 text-[#00a4ef] group-hover:scale-110 transition-transform" />
              </button>
              <button onClick={() => handleSocialAuth('Yahoo')} className="flex items-center justify-center p-2.5 bg-[#111] hover:bg-[#1a1a1a] border border-gray-800 rounded-lg transition-colors group">
                <FaYahoo className="size-5 text-[#7B0099] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[1px] bg-gray-800"></div>
            <span className="text-xs font-medium text-gray-500 uppercase">or continue with email</span>
            <div className="flex-1 h-[1px] bg-gray-800"></div>
          </div>

          <form onSubmit={isForgotView ? handleForgotPassword : handleEmailAuth} className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col">
              <input
                type="email"
                required
                placeholder="Email address"
                className="bg-[#111] border border-gray-800 rounded-lg px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {!isForgotView && (
              <div className="flex flex-col">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="bg-[#111] border border-gray-800 rounded-lg px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {isLoginView && !token && (
                  <button type="button" onClick={() => setIsForgotView(true)} className="text-xs text-blue-500 hover:text-blue-400 self-end mt-2 transition-colors">
                    Forgot Password?
                  </button>
                )}
              </div>
            )}

            {isForgotView && resetSent && (
              <div className="text-green-400 text-xs text-center my-2 p-2 bg-green-400/10 border border-green-400/20 rounded">
                Reset link transmitted. Check backend logs.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-lg transition-all text-sm mt-2"
            >
              {isForgotView ? "Send Reset Link" : (token ? "Link Account" : (isLoginView ? "Sign In" : "Create Account"))}
            </button>
            
            {isForgotView && (
              <button
                type="button"
                onClick={() => { setIsForgotView(false); setResetSent(false); }}
                className="w-full mt-2 text-xs text-gray-500 hover:text-white transition-colors"
              >
                Return to Login
              </button>
            )}
          </form>

          {!token && !isForgotView && (
            <p className="text-center text-xs text-gray-500 mt-8 mb-4">
              Don't want to create an account yet?
            </p>
          )}

          {!token && (
            <button
              onClick={handleGuestLogin}
              className="w-full group relative overflow-hidden border border-gray-800 bg-[#111] hover:bg-[#1a1a1a] hover:border-blue-500/30 text-gray-300 font-medium py-3.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              Play instantly as Guest
              <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
