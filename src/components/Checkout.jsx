import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, useClearCart } from "../hooks/useCart";
import "../styles/checkout.css";
import apiClient from "../api/apiClient";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

const STEPS = ["Delivery", "Payment", "Review"];

const PAYMENT_METHODS = [
  {
    id: "STRIPE",
    label: "Credit / Debit Card",
    desc: "Visa, Mastercard, Rupay via Stripe",
    icon: "💳",
  },
  {
    id: "UPI",
    label: "UPI",
    desc: "Pay using any UPI app — GPay, PhonePe, Paytm",
    icon: "⚡",
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    icon: "📦",
  },
];

function UPIModal({ amount, onSuccess, onClose }) {
  const [upiId, setUpiId] = useState("");
  const [stage, setStage] = useState("input");
  const [tab, setTab] = useState("id");

  const handlePay = () => {
    if (!upiId.includes("@")) return;
    setStage("processing");
    setTimeout(() => setStage("done"), 2000);
    setTimeout(() => onSuccess(), 2500);
  };

  return (
    <div className="upi-modal-overlay">
      <div className="upi-modal">
        <button className="upi-close" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </button>
        <div className="upi-header">
          <span className="upi-logo">⚡</span>
          <div>
            <p className="upi-title">Pay via UPI</p>
            <p className="upi-amount">₹ {amount.toLocaleString()}</p>
          </div>
        </div>
        <div className="upi-tabs">
          <button
            className={tab === "id" ? "active" : ""}
            onClick={() => setTab("id")}
          >
            UPI ID
          </button>
          <button
            className={tab === "qr" ? "active" : ""}
            onClick={() => setTab("qr")}
          >
            QR Code
          </button>
        </div>
        {tab === "id" && (
          <div className="upi-body">
            {stage === "input" && (
              <>
                <input
                  className="upi-input"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <p className="upi-hint">
                  e.g. name@okaxis, name@ybl, name@paytm
                </p>
                <button
                  className="upi-pay-btn"
                  onClick={handlePay}
                  disabled={!upiId.includes("@")}
                >
                  Verify & Pay
                </button>
              </>
            )}
            {stage === "processing" && (
              <div className="upi-processing">
                <div className="upi-spinner" />
                <p>Waiting for payment confirmation...</p>
                <p className="upi-hint">Check your UPI app</p>
              </div>
            )}
            {stage === "done" && (
              <div className="upi-success">
                <CheckCircleOutlineIcon
                  style={{ fontSize: "2.5rem", color: "#4caf50" }}
                />
                <p>Payment Successful!</p>
              </div>
            )}
          </div>
        )}
        {tab === "qr" && (
          <div className="upi-body upi-qr-body">
            <img
              className="upi-qr"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=123eehnnspp4jdd@sbi `}
              alt="UPI QR Code"
            />
            <p className="upi-qr-label">Scan with any UPI app</p>
            <p className="upi-hint">GPay · PhonePe · Paytm · Any UPI</p>
            <button className="upi-pay-btn" onClick={() => onSuccess()}>
              I've completed the payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { data } = useCart();
  const clearCart = useClearCart();

  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUPI, setShowUPI] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const allItems = Array.isArray(data)
    ? data.flatMap((cart) => cart.items)
    : [];

  const subtotal = allItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  const handleAddressChange = (e) =>
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const isAddressValid = Object.values(address).every((v) => v.trim() !== "");

  const buildPayload = (method) => ({
    items: allItems.map((item) => ({
      product_id: item.product.id,
      size_id: item.size.id,
      quantity: item.quantity,
    })),
    address: `${address.fullName}, ${address.address}, ${address.city}, ${address.state} - ${address.pincode} | Ph: ${address.phone}`,
    payment_method: method,
  });

  const handleClearCart = () => clearCart.mutate(allItems);

  const handlePlaceOrder = async () => {
    setError("");
    setLoading(true);
    try {
      if (paymentMethod === "UPI") {
        setLoading(false);
        setShowUPI(true);
        return;
      }
      const { data: res } = await apiClient.post(
        "/orders/checkout/",
        buildPayload(paymentMethod),
      );
      if (paymentMethod === "COD") {
        handleClearCart();
        navigate(`/order-success/${res.order_id}`, {
          state: { method: "COD", total: grandTotal },
        });
        return;
      }
      if (paymentMethod === "STRIPE") {
        window.location.href = res.stripe_url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUPISuccess = async () => {
    setShowUPI(false);
    setLoading(true);
    try {
      const { data: res } = await apiClient.post(
        "/orders/checkout/",
        buildPayload("UPI"),
      );
      handleClearCart();
      navigate(`/order-success/${res.order_id}`, {
        state: { method: "UPI", total: grandTotal },
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      {showUPI && (
        <UPIModal
          amount={grandTotal}
          onSuccess={handleUPISuccess}
          onClose={() => setShowUPI(false)}
        />
      )}

      <div className="checkout-container">
        <div className="checkout-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowBackIcon style={{ fontSize: "1rem" }} />
            Back
          </button>

          <div className="checkout-steps">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
              >
                <div className="step-circle">
                  {i < step ? (
                    <CheckCircleOutlineIcon style={{ fontSize: "1rem" }} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span>{s}</span>
                {i < STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="checkout-section-block">
              <div className="checkout-block-header">
                <LocalShippingOutlinedIcon style={{ fontSize: "1.1rem" }} />
                <h3>Delivery Address</h3>
              </div>
              <div className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      name="fullName"
                      placeholder="John Doe"
                      value={address.fullName}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      name="phone"
                      placeholder="10-digit number"
                      value={address.phone}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    name="address"
                    placeholder="House no, Street, Area"
                    value={address.address}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      name="city"
                      placeholder="City"
                      value={address.city}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      name="state"
                      placeholder="State"
                      value={address.state}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      name="pincode"
                      placeholder="6-digit code"
                      value={address.pincode}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
              </div>
              <button
                className="next-btn"
                onClick={() => setStep(1)}
                disabled={!isAddressValid}
              >
                Continue to Payment
                <ChevronRightIcon style={{ fontSize: "1.1rem" }} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="checkout-section-block">
              <div className="checkout-block-header">
                <CreditCardOutlinedIcon style={{ fontSize: "1.1rem" }} />
                <h3>Payment Method</h3>
              </div>
              <div className="payment-methods">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`payment-option ${paymentMethod === method.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <span className="payment-icon">{method.icon}</span>
                    <div className="payment-text">
                      <span className="payment-label">{method.label}</span>
                      <span className="payment-desc">{method.desc}</span>
                    </div>
                    <div
                      className={`payment-radio ${paymentMethod === method.id ? "checked" : ""}`}
                    />
                  </label>
                ))}
              </div>
              {paymentMethod === "STRIPE" && (
                <div className="test-card-hint">
                  <span>🧪 Test card:</span>
                  <code>4242 4242 4242 4242</code>
                  <span>· Any future date · Any CVV</span>
                </div>
              )}
              <div className="step-btns">
                <button className="back-step-btn" onClick={() => setStep(0)}>
                  Back
                </button>
                <button className="next-btn" onClick={() => setStep(2)}>
                  Review Order
                  <ChevronRightIcon style={{ fontSize: "1.1rem" }} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-section-block">
              <div className="checkout-block-header">
                <CheckCircleOutlineIcon style={{ fontSize: "1.1rem" }} />
                <h3>Review Order</h3>
              </div>
              <div className="review-block">
                <div className="review-row">
                  <span className="review-label">Delivering to</span>
                  <span className="review-value">
                    {address.fullName}, {address.address}, {address.city},{" "}
                    {address.state} — {address.pincode}
                  </span>
                  <button className="review-edit" onClick={() => setStep(0)}>
                    Edit
                  </button>
                </div>
                <div className="review-row">
                  <span className="review-label">Payment</span>
                  <span className="review-value">
                    {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                  </span>
                  <button className="review-edit" onClick={() => setStep(1)}>
                    Edit
                  </button>
                </div>
              </div>
              <div className="review-items">
                {allItems.map((item) => (
                  <div className="review-item" key={item.id}>
                    <img
                      src={item.product.primary_image}
                      alt={item.product.title}
                    />
                    <div className="review-item-info">
                      <span className="review-item-name">
                        {item.product.title}
                      </span>
                      <span className="review-item-meta">
                        Size: {item.size?.size} · Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="review-item-price">
                      ₹ {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              {error && <p className="checkout-error">{error}</p>}
              <div className="step-btns">
                <button className="back-step-btn" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-spinner" />
                  ) : (
                    <>
                      <CurrencyRupeeIcon style={{ fontSize: "1rem" }} />
                      Place Order · ₹ {grandTotal.toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-right">
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {allItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  <div className="summary-item-img-wrap">
                    <img
                      src={item.product.primary_image}
                      alt={item.product.title}
                    />
                    <span className="summary-qty-badge">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <span className="summary-item-name">
                      {item.product.title}
                    </span>
                    <span className="summary-item-meta">
                      Size: {item.size?.size}
                    </span>
                  </div>
                  <span className="summary-item-price">
                    ₹ {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              {shipping === 0 ? (
                <span className="summary-free">Free</span>
              ) : (
                <span>₹ {shipping}</span>
              )}
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>₹ {grandTotal.toLocaleString()}</span>
            </div>
            <p className="summary-note">🔒 Secure & encrypted checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
