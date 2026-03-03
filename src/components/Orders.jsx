import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

const statusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "CONFIRMED":
      return "status-confirmed";
    case "DELIVERED":
      return "status-delivered";
    case "PENDING":
      return "status-pending";
    case "SHIPPED":
      return "status-shipped";
    case "CANCELLED":
      return "status-cancelled";
    case "FAILED":
      return "status-failed";
    default:
      return "status-pending";
  }
};

function OrderRow({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="order-card">
      <div className="order-row" onClick={() => setExpanded((v) => !v)}>
        <div className="order-info">
          <span className="item-name">Order #{order.id}</span>
          <span className="item-meta">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {order.items?.length ?? 0} item
            {order.items?.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="order-right">
          <span className="item-price">
            ₹ {Number(order.total_amount).toLocaleString()}
          </span>
          <span className={`status-chip ${statusColor(order.status)}`}>
            {order.status ?? "Processing"}
          </span>
          <ExpandMoreIcon
            fontSize="small"
            style={{
              transition: "transform 0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              opacity: 0.4,
            }}
          />
        </div>
      </div>

      {expanded && (
        <div className="order-items-expanded">
          {order.items?.map((item) => (
            <div className="order-item-row" key={item.id}>
              {item.product_image && (
                <img
                  src={item.product_image}
                  alt={item.product_title}
                  className="order-item-img"
                />
              )}
              <div className="order-item-info">
                <span className="order-item-name">{item.product_title}</span>
                <span className="order-item-meta">
                  Size: {item.size} · Qty: {item.quantity}
                </span>
              </div>
              <span className="order-item-price">
                ₹ {Number(item.total_price).toLocaleString()}
              </span>
            </div>
          ))}

          <div className="order-address">
            <span>📍 {order.address}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Orders() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiClient.get("/orders/");
      return res.data.results ?? res.data;
    },
  });

  return (
    <div className="section-card" id="order">
      <div className="section-header">
        <ReceiptLongOutlinedIcon fontSize="small" />
        <h2>Orders</h2>
        {data?.length > 0 && (
          <span className="section-count">{data.length}</span>
        )}
      </div>

      {isLoading ? (
        <div className="empty-state">
          <CircularProgress size={24} style={{ color: "#1a1a1a" }} />
        </div>
      ) : isError ? (
        <div className="empty-state">
          <p>Error fetching orders</p>
        </div>
      ) : !data?.length ? (
        <div className="empty-state">
          <ReceiptLongOutlinedIcon
            style={{ fontSize: "2.5rem", opacity: 0.2 }}
          />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="items-list">
          {data.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
