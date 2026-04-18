import React from "react";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import CRDashboard from "./components/Dashboard/CRDashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import PendingApproval from "./components/Auth/PendingApproval";
import VerifyEmail from "./components/Auth/VerifyEmail";
import Landing from "./components/Landing";
import Loader from "./components/UI/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/index.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/assignments.css";
import "./styles/admin.css";
import "./styles/responsive.css";
import "./styles/liquid-button.css";
import "./styles/landing.css";

const AppContent = () => {
  const { user, loading, isCRUser, approvalStatus } = useAuthContext();
  const { isDark } = useTheme();
  const pageClass = isDark ? "dark-page" : "light-page";

  if (loading) {
    return <Loader message="Loading Assignment Tracker..." />;
  }

  // No user → show landing page (full page, no header/footer wrapper)
  if (!user) {
    return <Landing />;
  }

  const lightPageShell = (content) => (
    <div className={pageClass}>
      <Header />
      <main className="main-content">
        {content}
      </main>
      <Footer />
    </div>
  );

  // Email not verified
  if (approvalStatus === "unverified") {
    return lightPageShell(<VerifyEmail />);
  }

  // Not yet approved
  if (approvalStatus !== "approved") {
    return lightPageShell(<PendingApproval />);
  }

  return lightPageShell(isCRUser ? <CRDashboard /> : <StudentDashboard />);
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
      <AppContent />
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;