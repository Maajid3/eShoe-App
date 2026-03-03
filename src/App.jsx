import "./App.css";
import { Toaster } from "react-hot-toast";
import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";

const AllProduct = lazy(() => import("./components/AllProduct"));
const Sidebar = lazy(() => import("./components/Sidebar"));
const Cart = lazy(() => import("./components/Cart"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const AuthLayout = lazy(() => import("./components/AuthLayout"));
const Profile = lazy(() => import("./components/Profile"));
const Accounts = lazy(() => import("./components/Accounts"));
const Settings = lazy(() => import("./components/Settings"));
const UserLayout = lazy(() => import("./components/UserLayout"));
const DeleteAcc = lazy(() => import("./components/DeleteAcc"));
const BuyNow = lazy(() => import("./components/BuyNow"));
const Checkout = lazy(() => import("./components/Checkout"));
const OrderSuccess = lazy(() => import("./components/OrderSuccess"));
const Orders = lazy(() => import("./components/Orders"));
const ChangePass = lazy(() => import("./components/ChangePass"));

import { usePageTitle } from "./hooks/useRouteTitle";
import apiClient from "./api/apiClient";

function App() {
  usePageTitle();

  const [showSide, setShowSide] = useState(false);
  const [selectedCat, setSelectedCat] = useState(() => {
    try {
      const savedCat = localStorage.getItem("product_type");
      return savedCat ? JSON.parse(savedCat) : [];
    } catch {
      return [];
    }
  });

  const [searchResult, setSearchResult] = useState("");
  const [showDelMsg, setShowDelMsg] = useState(false);

  const closeSidebar = () => setShowSide(false);
  const toggleSidebar = () => setShowSide((prev) => !prev);

  useEffect(() => {
    if (showSide || showDelMsg) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSide, showDelMsg]);

  useEffect(() => {
    localStorage.setItem("product_type", JSON.stringify(selectedCat));
  }, [selectedCat]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            fontSize: "0.85rem",
            borderRadius: "10px",
          },
        }}
      />

      <div className="app-container">
        <header className="header">
          <Header toggleSide={toggleSidebar} onSearch={setSearchResult} />
        </header>

        <Suspense
          fallback={
            <div style={{ minHeight: "100vh", background: "#0e0e10" }} />
          }
        >
          <Routes>
            <Route
              index
              element={
                <main className="all-product">
                  <AllProduct
                    selectedCat={selectedCat}
                    searchResult={searchResult}
                  />
                </main>
              }
            />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route element={<UserLayout />}>
              <Route path="/buy/:id" element={<BuyNow />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/accounts"
                element={<Accounts delMSg={() => setShowDelMsg((t) => !t)} />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-success/:orderId"
                element={<OrderSuccess />}
              />
              <Route path="/change-password" element={<ChangePass />} />
            </Route>
          </Routes>
        </Suspense>

        {showSide && <div className="overlay"></div>}

        {showSide && (
          <aside className="sidebar">
            <Suspense fallback={null}>
              <Sidebar
                closeSidebar={closeSidebar}
                selectedCat={selectedCat}
                setSelectedCat={setSelectedCat}
              />
            </Suspense>
          </aside>
        )}

        {showDelMsg && (
          <div className="show-del-ui">
            <Suspense fallback={null}>
              <DeleteAcc setShowDelMsg={setShowDelMsg} />
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
