import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import "../styles/account-menu.css";

export default function AccountMenu() {
  const navigate = useNavigate();
  const { user, isLoading } = useUserContext();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  if (isLoading || !user) return null;

  const avatar = user.username?.[0]?.toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.reload();
  };

  return (
    <div className="acc-menu-wrapper" ref={menuRef}>
      <button className="acc-avatar-btn" onClick={() => setOpen((p) => !p)}>
        <span className="acc-avatar">{avatar}</span>
      </button>

      {open && (
        <div className="acc-dropdown">
          <div className="acc-dropdown-user">
            <span className="acc-dropdown-avatar">{avatar}</span>
            <div>
              <p className="acc-dropdown-name">{user.username}</p>
              <p className="acc-dropdown-email">{user.email}</p>
            </div>
          </div>

          <div className="acc-dropdown-divider" />

          <button
            className="acc-dropdown-item"
            onClick={() => { navigate("/accounts"); setOpen(false); }}
          >
            <PersonOutlineIcon style={{ fontSize: "1rem" }} />
            My Account
          </button>

          <button
            className="acc-dropdown-item"
            onClick={() => { navigate("/accounts#settings"); setOpen(false); }}
          >
            <TuneOutlinedIcon style={{ fontSize: "1rem" }} />
            Settings
          </button>

          <div className="acc-dropdown-divider" />

          <button className="acc-dropdown-item danger" onClick={handleLogout}>
            <LogoutIcon style={{ fontSize: "1rem" }} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}