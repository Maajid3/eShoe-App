import "../styles/header.css";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import SearchBar from "./SearchBar";
import SearchInput from "./SearchInput";
import AccountMenu from "./AccountMenu";
import { useUserContext } from "../context/UserContext";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useCart } from "../hooks/useCart";

export default function Header(props) {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data } = useCart();

  const cartCount = Array.isArray(data) ? data.flatMap((cart) => cart.items).length : 0;

  const handleSearch = useCallback((value) => {
    props.onSearch?.(value);
  }, []);

  return (
    <div className="header-ui">
      <div className="header-content">
        <div className="side-search">
          <button className="menu-btn" onClick={props.toggleSide} aria-label="Menu">
            <MenuIcon style={{ fontSize: "1.3rem" }} />
          </button>
          <div className="search-section">
            <SearchBar onSearch={handleSearch} setShowSearchBar={setShowSearchBar} />
          </div>
        </div>

        <div className="logo" onClick={() => navigate("/")}>
          <h1>eShoe</h1>
          <span>Comfort. Premium. Style.</span>
        </div>

        <div className="cart-acc">
          {user ? (
            <AccountMenu />
          ) : (
            <button className="acc-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
          <button className="cart-btn" onClick={() => navigate("/cart")} aria-label="Cart">
            <ShoppingBagOutlinedIcon style={{ fontSize: "1.3rem" }} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className={`search-mobileView ${showSearchBar ? "active" : ""}`}>
        <SearchInput onSearch={handleSearch} />
        <button className="search-close-btn" onClick={() => setShowSearchBar((prev) => !prev)}>
          ✕
        </button>
      </div>
    </div>
  );
}