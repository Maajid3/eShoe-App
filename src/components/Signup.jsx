import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import bgImg from "../assets/bg-img1.jpg";
import { useState } from "react";
import apiClient from "../api/apiClient";
import { useMutation } from "@tanstack/react-query";
import Loader from "../skeleton/Loader";
import Button from "./Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Signup() {
  const navigate = useNavigate();

  const [checkUsername, setCheckUsername] = useState("");
  const [checkEmail, setCheckEmail] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [checkConfirmPassword, setCheckConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isDisabled =
    !checkUsername ||
    !checkEmail ||
    checkPassword.length < 8 ||
    checkConfirmPassword.length < 8;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const SignUpSubmit = async (credentials) => {
    const res = await apiClient.post("/register/", credentials);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: SignUpSubmit,
    onSuccess: () => navigate("/login"),
    onError: () => setErrorMsg("Something went wrong. Please try again."),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    setErrorMsg("");
    mutation.mutate({
      username: checkUsername,
      email: checkEmail,
      password: checkPassword,
      confirm_password: checkConfirmPassword,
    });
    setTimeout(() => {
      setCheckUsername("");
      setCheckEmail("");
      setCheckPassword("");
      setCheckConfirmPassword("");
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-img-bg">
        <img src={bgImg} alt="background" />
      </div>

      <div className="login-card">
        <h1>Create account</h1>
        <p className="subtitle">Join us today</p>

        <form onSubmit={handleSignup}>
          {errorMsg && <span className="input-error">{errorMsg}</span>}

          <div className={`username-ui ${usernameError ? "error" : ""}`}>
            <input
              type="text"
              value={checkUsername}
              onChange={(e) => setCheckUsername(e.target.value)}
              onBlur={() =>
                !checkUsername
                  ? setUsernameError("Username required")
                  : setUsernameError("")
              }
              placeholder="Username"
              autoComplete="username"
            />
          </div>
          {usernameError && (
            <span className="input-error">{usernameError}</span>
          )}

          <div className={`email-ui ${emailError ? "error" : ""}`}>
            <input
              type="email"
              value={checkEmail}
              onChange={(e) => setCheckEmail(e.target.value)}
              onBlur={() => {
                if (!checkEmail) setEmailError("Email required");
                else if (!isValidEmail(checkEmail))
                  setEmailError("Enter a valid email");
                else setEmailError("");
              }}
              placeholder="Email"
              autoComplete="email"
            />
          </div>
          {emailError && <span className="input-error">{emailError}</span>}

          <div className={`password-ui ${passwordError ? "error" : ""}`}>
            <input
              type={showPass ? "text" : "password"}
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
              onBlur={() =>
                !checkPassword || checkPassword.length < 8
                  ? setPasswordError("Min. 8 characters required")
                  : setPasswordError("")
              }
              placeholder="Password"
              autoComplete="new-password"
            />
            <span
              className="eye-toggle"
              onClick={() => setShowPass((v) => !v)}
              aria-label="toggle password visibility"
            >
              {showPass ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </span>
          </div>
          {passwordError && (
            <span className="input-error">{passwordError}</span>
          )}

          <div className={`password-ui ${confirmPasswordError ? "error" : ""}`}>
            <input
              type="password"
              value={checkConfirmPassword}
              onChange={(e) => setCheckConfirmPassword(e.target.value)}
              onBlur={() => {
                if (!checkConfirmPassword)
                  setConfirmPasswordError("Please confirm your password");
                else if (checkConfirmPassword !== checkPassword)
                  setConfirmPasswordError("Passwords do not match");
                else setConfirmPasswordError("");
              }}
              placeholder="Confirm password"
              autoComplete="new-password"
            />
          </div>
          {confirmPasswordError && (
            <span className="input-error">{confirmPasswordError}</span>
          )}

          <Button
            disabled={isDisabled}
            type="submit"
            className="auth-btn"
            aria-label="signup button"
          >
            {mutation.isPending ? <Loader /> : "Create Account"}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account?
          <span className="auth-link" onClick={() => navigate("/login")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
