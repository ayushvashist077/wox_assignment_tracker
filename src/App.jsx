import React from "react";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
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

  if (loading) {
    return <Loader message="Loading Assignment Tracker..." />;
  }

  // No user → show landing page (full page, no header/footer wrapper)
  if (!user) {
    return <Landing />;
  }

  // Email not verified
  if (approvalStatus === "unverified") {
    return (
      <>
        <Header />
        <main className="main-content">
          <VerifyEmail />
        </main>
        <Footer />
      </>
    );
  }

  // Not yet approved
  if (approvalStatus !== "approved") {
    return (
      <>
        <Header />
        <main className="main-content">
          <PendingApproval />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-content">
        {isCRUser ? <CRDashboard /> : <StudentDashboard />}
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
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
      </div>
    </AuthProvider>
  );
};

export default App;