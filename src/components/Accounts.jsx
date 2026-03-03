import "../styles/accounts.css";
import Cart from "./Cart";
import Orders from "./Orders";
import Payments from "./Payments";
import Profile from "./Profile";
import Settings from "./Settings";
import AccountStackNav from "./AccountStackNav";

const Accounts = (props) => {
  return (
    <>
      <div className="user-profile">
        <AccountStackNav />
        <div className="profile-card">
          <Profile />
        </div>

        <div className="cart-section">
          <Cart />
        </div>
        <div className="orders-section">
          <Orders />
        </div>
        <div className="payments-section">
          <Payments />
        </div>
        <div className="settings-section">
          <Settings delMSg1={props.delMSg} />
        </div>
      </div>
    </>
  );
};

export default Accounts;
