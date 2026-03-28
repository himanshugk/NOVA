import { useAuth } from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // 🔓 Not logged in → show login icon
  if (!token) {
    return (
      <button
        onClick={() => navigate("/auth")}
        className="transition hover:opacity-75"
        title="Login / Signup"
      >
        <FaUserCircle className="size-6 text-white" />
      </button>
    );
  }

  // 🔐 Logged in → show profile + logout
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate("/profile")}
        className="transition hover:opacity-75"
        title="Profile"
      >
        <FaUserCircle className="size-6 text-white" />
      </button>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="text-sm text-white font-bold hover:text-red-400 transition"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
