import { Outlet } from "react-router-dom";
import "../styles/userlayout.css"

export default function UserLayout() {
  return (
    <>
      <div className="user-layout">
        <Outlet />
      </div>
    </>
  );
}
