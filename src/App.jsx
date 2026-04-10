import React from "react";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import CRDashboard from "./components/Dashboard/CRDashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import PendingApproval from "./components/Auth/PendingApproval";
import VerifyEmail from "./components/Auth/VerifyEmail";
import Loader from "./components/UI/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/index.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/assignments.css";
import "./styles/admin.css";
import "./styles/responsive.css";

const AppContent = () => {
  const { user, loading, isCRUser, approvalStatus } = useAuthContext();

  if (loading) {
    return <Loader message="Loading Assignment Tracker..." />;
  }

  // If user is logged in but email not verified
  if (user && approvalStatus === "unverified") {
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

  // If user is logged in but not approved (pending or rejected)
  if (user && approvalStatus !== "approved") {
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
        {user && isCRUser ? <CRDashboard /> : <StudentDashboard />}
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