import { useUserContext } from "../context/UserContext";
import { CircularProgress } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export default function Profile() {
  const { user, isLoading } = useUserContext();

  if (isLoading)
    return (
      <div className="profile-card">
        <CircularProgress size={24} style={{ color: "#1a1a1a" }} />
      </div>
    );

  if (!user)
    return (
      <div className="profile-card">
        <p className="profile-empty">Please login to view your profile</p>
      </div>
    );

  const avatar = user.username[0].toUpperCase();

  return (
    <div className="profile-card">
      <div className="profile-avatar">{avatar}</div>
      <div className="profile-info">
        <h2 className="profile-name">
          Hey, {user.username} 👋
        </h2>
        <div className="profile-meta">
          <div className="profile-meta-row">
            <PersonOutlineIcon style={{ fontSize: "0.95rem", opacity: 0.5 }} />
            <span>{user.username}</span>
          </div>
          <div className="profile-meta-row">
            <EmailOutlinedIcon style={{ fontSize: "0.95rem", opacity: 0.5 }} />
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}