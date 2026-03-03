import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function DeleteAcc(props) {

  const deleteAccount = async () => {
    const res = await apiClient.delete("user/delete/");
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      console.log("deleted");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    },
    onError: () => {
      console.log("not deleted");
    },
  });

  return (
    <>
      <div className="delete-acc-card">
        <DeleteTwoToneIcon
          className="delIcon"
          style={{ marginTop: "1em" }}
          color="error"
          fontSize="large"
        />
        <span className="del-cnf-msg">
          Are you sure you want to delete account ?
        </span>
        <div className="cnf-del-btn">
          <button
            onClick={() => mutation.mutate()}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete
          </button>
          <button onClick={() => props.setShowDelMsg(false)} style={{background:"#3b79ff",border:"2px solid #6dd1ff"}}>Cancel</button>
        </div>
      </div>
    </>
  );
}

export default DeleteAcc;
