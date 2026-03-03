import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useCart, useClearCart } from "../hooks/useCart";
import "../styles/order-success.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sessionId = searchParams.get("session_id");
  const { data: cartData } = useCart();
  const clearCart = useClearCart();

  useEffect(() => {
    const init = async () => {
      try {
        if (sessionId) {
          await apiClient.post("/payments/verify-stripe/", { session_id: sessionId });
          const allItems = cartData ? cartData.flatMap?.((cart) => cart.items) ?? [] : [];
          if (allItems.length > 0) {
            clearCart.mutate(allItems);
          }
        }
        const { data } = await apiClient.get(`/orders/${orderId}/`);
        setOrder(data);
      } catch {
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [orderId, sessionId]);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const deliveryStr = estimatedDelivery.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  if (loading) {
    return (
      <div className="success-page">
        <div className="success-skeleton">
          <div className="sk-circle" />
          <div className="sk-line wide" />
          <div className="sk-line narrow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <p className="success-error">{error}</p>
        <button className="success-home-btn" onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon-wrap">
            <CheckCircleIcon className="success-icon" />
          </div>
          <h1>Order Confirmed!</h1>
          <p className="success-subtitle">
            Thank you{order?.user_name ? `, ${order.user_name}` : ""}! Your order has been placed successfully.
          </p>
          <div className="success-order-id">Order #{orderId}</div>
        </div>

        <div className="success-steps">
          {[
            { icon: <CheckCircleIcon />, label: "Order Placed", done: true },
            { icon: <InventoryOutlinedIcon />, label: "Being Packed", done: false },
            { icon: <LocalShippingOutlinedIcon />, label: "Out for Delivery", done: false },
            { icon: <CheckCircleIcon />, label: "Delivered", done: false },
          ].map((s, i) => (
            <div key={i} className={`success-step ${s.done ? "done" : ""} ${i === 1 ? "active" : ""}`}>
              <div className="success-step-circle">{s.icon}</div>
              <span>{s.label}</span>
              {i < 3 && <div className="success-step-line" />}
            </div>
          ))}
        </div>

        <div className="success-details">
          <div className="success-detail-row">
            <span>Payment</span>
            <span className="badge-success">
              {order?.payment?.method ?? location.state?.method ?? "Paid"} · ✅ Success
            </span>
          </div>
          <div className="success-detail-row">
            <span>Amount Paid</span>
            <span>₹ {Number(order?.total_amount ?? location.state?.total ?? 0).toLocaleString()}</span>
          </div>
          <div className="success-detail-row">
            <span>Estimated Delivery</span>
            <span>{deliveryStr}</span>
          </div>
          <div className="success-detail-row">
            <span>Delivering to</span>
            <span className="success-address">{order?.address}</span>
          </div>
        </div>

        {order?.items?.length > 0 && (
          <div className="success-items">
            <h3>Items in this order</h3>
            {order.items.map((item) => (
              <div className="success-item" key={item.id}>
                {item.product_image && (
                  <img src={item.product_image} alt={item.product_title} />
                )}
                <div className="success-item-info">
                  <span className="success-item-name">{item.product_title}</span>
                  <span className="success-item-meta">Size: {item.size} · Qty: {item.quantity}</span>
                </div>
                <span className="success-item-price">
                  ₹ {Number(item.total_price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="success-actions">
          <button className="success-orders-btn" onClick={() => navigate("/orders")}>View All Orders</button>
          <button className="success-home-btn" onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}