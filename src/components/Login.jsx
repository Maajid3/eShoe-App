import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import bgImg from "../assets/bg-img1.jpg";
import apiClient from "../api/apiClient";
import Loader from "../skeleton/Loader";
import { useQueryClient } from "@tanstack/react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "./Button";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [checkUsername, setCheckUsername] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPass, setShowPass] = useState(false);

  const LoginSubmit = async (credentials) => {
    const res = await apiClient.post("token/", credentials);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: LoginSubmit,
    onSuccess: (data) => {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    },
    onError: () => {
      setErrorMsg("Incorrect username or password.");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    mutation.mutate({ username: checkUsername, password: checkPassword });
    setTimeout(() => {
      setCheckUsername("");
      setCheckPassword("");
    }, 1000);
  };

  const disableBtn = !checkUsername || checkPassword.length < 8;

  return (
    <div className="login-container">
      <div className="login-img-bg">
        <img src={bgImg} alt="background" />
      </div>

      <div className="login-card">
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          {errorMsg && <span className="input-error">{errorMsg}</span>}

          <div className={`username-ui ${usernameError ? "error" : ""}`}>
            <input
              type="text"
              value={checkUsername}
              onChange={(e) => setCheckUsername(e.target.value)}
              onBlur={() =>
                !checkUsername.trim()
                  ? setUsernameError(true)
                  : setUsernameError(false)
              }
              placeholder="Username"
              autoComplete="username"
            />
          </div>
          {usernameError && (
            <span className="input-error">Username is required ⁉️</span>
          )}

          <div className={`password-ui ${passwordError ? "error" : ""}`}>
            <input
              type={showPass ? "text" : "password"}
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
              onBlur={() =>
                !checkPassword.trim() || checkPassword.length < 8
                  ? setPasswordError("Min. 8 characters required")
                  : setPasswordError("")
              }
              placeholder="Password"
              autoComplete="current-password"
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

          <Button
            disabled={disableBtn}
            type="submit"
            className="auth-btn"
            aria-label="login"
          >
            {mutation.isPending ? <Loader /> : "Sign In"}
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account?
          <span className="auth-link" onClick={() => navigate("/signup")}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
