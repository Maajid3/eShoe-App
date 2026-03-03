import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

const Settings = ({ delMSg1 }) => {
  let navigate = useNavigate();
  return (
    <div className="section-card" id="settings">
      <div className="section-header">
        <TuneOutlinedIcon fontSize="small" />
        <h2>Settings</h2>
      </div>

      <div className="settings-list">
        <div className="settings-row">
          <div className="settings-row-left">
            <DarkModeOutlinedIcon fontSize="small" />
            <span>Theme</span>
            <span className="theme-not-avaliable">! not available</span>
          </div>
          <ChevronRightIcon fontSize="small" style={{ opacity: 0.4 }} />
        </div>

        <div
          className="settings-row"
          onClick={() => navigate("/change-password")}
        >
          <div className="settings-row-left">
            <LockOutlinedIcon fontSize="small" />
            <span>Change Password</span>
          </div>
          <ChevronRightIcon fontSize="small" style={{ opacity: 0.4 }} />
        </div>

        <div className="settings-row danger" onClick={delMSg1}>
          <div className="settings-row-left">
            <DeleteOutlineIcon fontSize="small" />
            <span>Delete Account</span>
          </div>
          <ChevronRightIcon fontSize="small" style={{ opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
