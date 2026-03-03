import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import apiClient from "../api/apiClient";
import { useMutation } from "@tanstack/react-query";
import Loader from "../skeleton/Loader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ChangePass() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [oldError, setOldError] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isDisabled =
    !oldPassword || newPassword.length < 8 || confirmPassword.length < 8;

  const changePasswordFn = async (data) => {
    const res = await apiClient.post(
      "user/change-password/",
      data,
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: changePasswordFn,
    onSuccess: () => {
      setSuccessMsg("Password changed successfully ✅");
      setErrorMsg("");
      setTimeout(() => navigate(-1), 1500);
    },
    onError: (error) => {
      setErrorMsg(
        error?.response?.data?.error ?? "Something went wrong. Try again.",
      );
      setSuccessMsg("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");
    setErrorMsg("");
    mutation.mutate({
      old_password: oldPassword,
      new_password: newPassword,
    });
  };

  return (
    <div
      className="login-container"
      style={{
        width: "100%",
        maxWidth: 460,
        height: "auto",
        minHeight: "unset",
        margin: "4em auto",
      }}
    >
      <div
        className="login-card"
        style={{
          maxWidth: "100%", 
          width: "100%",
          padding: "2.5rem 2.5rem",
          justifyContent: "flex-start",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "#6b6b72",
            fontSize: "0.82rem",
            marginBottom: "0.5rem",
            padding: 0,
          }}
        >
          <ArrowBackIcon style={{ fontSize: "1rem" }} />
          Back
        </button>

        <h1
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 300,
            fontSize: "2rem",
            margin: "0 0 0.2em",
          }}
        >
          Change Password
        </h1>
        <p
          style={{
            fontSize: "0.78rem",
            color: "#6b6b72",
            marginBottom: "1.5rem",
            margin: "0 0 1.5rem",
          }}
        >
          Enter your current and new password
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.1rem",
          }}
        >
          {errorMsg && <span className="input-error">{errorMsg}</span>}
          {successMsg && (
            <span
              style={{
                color: "#4caf50",
                fontSize: "0.78rem",
                padding: "0.2rem 0.3rem",
              }}
            >
              {successMsg}
            </span>
          )}

          <div className={`password-ui ${oldError ? "error" : ""}`}>
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              onBlur={() =>
                !oldPassword
                  ? setOldError("Current password required")
                  : setOldError("")
              }
              placeholder="Current password"
              autoComplete="current-password"
            />
            <span className="eye-toggle" onClick={() => setShowOld((v) => !v)}>
              {showOld ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </span>
          </div>
          {oldError && <span className="input-error">{oldError}</span>}

          <div className={`password-ui ${newError ? "error" : ""}`}>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() =>
                newPassword.length < 8
                  ? setNewError("Min. 8 characters required")
                  : setNewError("")
              }
              placeholder="New password"
              autoComplete="new-password"
            />
            <span className="eye-toggle" onClick={() => setShowNew((v) => !v)}>
              {showNew ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </span>
          </div>
          {newError && <span className="input-error">{newError}</span>}

          <div className={`password-ui ${confirmError ? "error" : ""}`}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => {
                if (!confirmPassword)
                  setConfirmError("Please confirm your password");
                else if (confirmPassword !== newPassword)
                  setConfirmError("Passwords do not match");
                else setConfirmError("");
              }}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>
          {confirmError && <span className="input-error">{confirmError}</span>}

          <button
            type="submit"
            className="auth-btn"
            disabled={isDisabled}
            style={{ marginTop: "1rem" }}
          >
            {mutation.isPending ? <Loader /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
