import Auth from "../pages/Auth";
import Chat from "../pages/Chat";
import ProtectedRoute from "./ProtectedRoute";

<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>

<Route path="/auth" element={<Auth />} />
