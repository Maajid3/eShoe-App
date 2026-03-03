import { Outlet } from "react-router-dom";
import "../styles/auth-layout.css";

export default function AuthLayout() {
  return (
    <>
      <div className="auth-layout">
        <Outlet />
      </div>
    </>
  );
}
