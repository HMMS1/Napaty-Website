import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const Chat = lazy(() => import("./pages/Chat"));
const LoginRegister = lazy(() => import("./pages/LoginRegister"));
const DiseaseDiagnosis = lazy(() => import("./pages/DiseaseDiagnosis"));
const SoilAnalysis = lazy(() => import("./pages/SoilAnalysis"));
const PlantsSeasons = lazy(() => import("./pages/PlantsSeasons"));
const Store = lazy(() => import("./pages/Store"));
const Consultation = lazy(() => import("./pages/Consultation"));
const Welcome = lazy(() => import("./pages/Welcome"));
const CropRecommendation = lazy(() => import("./pages/CropRecommendation"));
const AgriChat = lazy(() => import("./pages/AgriChat"));
const CommunicationRedirect = lazy(() => import("./pages/Communication"));

const RouteLoader = () => (
  <div
    aria-hidden="true"
    style={{
      minHeight: "45vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  />
);

function App() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "ar"
  );

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <Router>
      <div className={`App ${language === "en" ? "ltr-app" : "rtl-app"}`}>
        <Header
          user={user}
          setUser={setUser}
          language={language}
          setLanguage={setLanguage}
        />

        <main className="main-content">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<Welcome language={language} />} />
              <Route path="/welcome" element={<Welcome language={language} />} />

              <Route
                path="/chat/:requestId"
                element={
                  <ProtectedRoute user={user}>
                    <Chat language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <LoginRegister setUser={setUser} language={language} />
                }
              />

              <Route
                path="/diagnosis"
                element={<DiseaseDiagnosis language={language} />}
              />

              <Route
                path="/soil-analysis"
                element={<SoilAnalysis language={language} />}
              />

              <Route
                path="/plants-seasons"
                element={<PlantsSeasons language={language} />}
              />

              <Route
                path="/crop-recommendation"
                element={<CropRecommendation language={language} />}
              />

              <Route
                path="/agri-chat"
                element={<AgriChat language={language} />}
              />

              <Route
                path="/store"
                element={
                  <ProtectedRoute user={user}>
                    <Store language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/consultation"
                element={
                  <ProtectedRoute user={user}>
                    <Consultation language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/communication"
                element={
                  <ProtectedRoute user={user}>
                    <CommunicationRedirect language={language} />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
