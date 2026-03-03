import { useState, useEffect } from "react";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import "../styles/accounts.css";

const links = [
  { label: "Cart", href: "#cart", icon: <ShoppingBagOutlinedIcon style={{ fontSize: "1rem" }} /> },
  { label: "Orders", href: "#order", icon: <ReceiptLongOutlinedIcon style={{ fontSize: "1rem" }} /> },
  { label: "Payments", href: "#payments", icon: <CreditCardOutlinedIcon style={{ fontSize: "1rem" }} /> },
  { label: "Settings", href: "#settings", icon: <TuneOutlinedIcon style={{ fontSize: "1rem" }} /> },
];

const AccountStackNav = () => {
  const [visible, setVisible] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [active, setActive] = useState("cart");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setVisible(scrollPosition > lastScroll && scrollPosition > 80);
      setLastScroll(scrollPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav className={`account-nav ${visible ? "visible" : ""}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={`account-nav-link ${active === link.label.toLowerCase() ? "active" : ""}`}
          onClick={() => setActive(link.label.toLowerCase())}
        >
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default AccountStackNav;