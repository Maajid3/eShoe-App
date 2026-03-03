import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { CircularProgress } from "@mui/material";

const methodIcon = (method) => {
  switch (method?.toUpperCase()) {
    case "STRIPE":
      return "💳";
    case "UPI":
      return "⚡";
    case "COD":
      return "📦";
    default:
      return "💰";
  }
};

const statusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
      return "status-confirmed";
    case "PENDING":
      return "status-pending";
    case "FAILED":
      return "status-failed";
    default:
      return "status-pending";
  }
};

function Payments() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await apiClient.get("/payments/");
      return res.data.results ?? res.data;
    },
  });

  return (
    <div className="section-card" id="payments">
      <div className="section-header">
        <CreditCardOutlinedIcon fontSize="small" />
        <h2>Payments</h2>
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
          <p>Error fetching payments</p>
        </div>
      ) : !data?.length ? (
        <div className="empty-state">
          <CreditCardOutlinedIcon
            style={{ fontSize: "2.5rem", opacity: 0.2 }}
          />
          <p>No payment history</p>
        </div>
      ) : (
        <div className="items-list">
          <div className="table-head">
            <span>Order</span>
            <span>Method</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {data.map((payment) => (
            <div className="payment-row" key={payment.id}>
              <span className="item-name">#{payment.order?.id ?? "—"}</span>

              <span className="payment-method">
                <span className="method-icon">
                  {methodIcon(payment.method)}
                </span>
                {payment.method}
              </span>

              <span className="item-price">
                ₹ {Number(payment.amount).toLocaleString()}
              </span>

              <span className={`status-chip ${statusColor(payment.status)}`}>
                {payment.status}
              </span>

              <span className="item-meta">
                {new Date(payment.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Payments;
