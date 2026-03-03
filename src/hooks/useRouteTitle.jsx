import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

const RouteTitles = {
  "/": "Products",
  "/login": "Login",
  "/signup": "Signup",
  "/buy/:id": "Buy Shoe",
  "/cart": "Cart",
  "/orders": "Orders",
  "/accounts": "Accounts",
  "/order-success/:orderId": "Order Placed",
  "/checkout": "Checkout",
};

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    let title = "eShoe";

    for (const path in RouteTitles) {
      const match = matchPath({ path, end: true }, location.pathname);

      if (match) {
        title = `eShoe - ${RouteTitles[path]}`;
        break;
      }
    }
    document.title = title;
  }, [location]);
};
