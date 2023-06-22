import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import Profile from "./components/Profile";
import UserProfile from "./components/UserProfile";
import Navigationbar from "./components/Navigationbar";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

export const url = "https://instagramclone-backend.onrender.com";

function App() {
  //routing
  return (
    <>
      <BrowserRouter>
        <Navigationbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/profile/:email" element={<UserProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
