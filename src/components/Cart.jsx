import "../styles/cart.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useCart, useRemoveItem, useUpdateCart } from "../hooks/useCart";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { data } = useCart();
  const { mutate: updateCartQuantity } = useUpdateCart();
  const { mutate: removeItem, isPending } = useRemoveItem();
  const navigate = useNavigate();

  const allItems = Array.isArray(data)
    ? data.flatMap((cart) => cart.items)
    : [];
  const totalPrice = allItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = totalPrice > 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="section-card" id="cart">
      <div className="section-header">
        <ShoppingBagOutlinedIcon fontSize="small" />
        <h2>Cart</h2>
        <span className="section-badge">{allItems.length}</span>
      </div>

      {allItems.length === 0 ? (
        <div className="empty-state">
          <ShoppingBagOutlinedIcon
            style={{ fontSize: "2.5rem", opacity: 0.2 }}
          />
          <p>Your cart is empty</p>
          <button className="empty-shop-btn" onClick={() => navigate("/")}>
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <div className="items-list">
            {data?.map((cart) =>
              cart.items.map((cartItems) => (
                <div className="item-row" key={cartItems.id}>
                  <img
                    src={cartItems?.product.primary_image}
                    alt={cartItems?.product?.title}
                    className="item-img"
                  />
                  <div className="item-info">
                    <span className="item-name">
                      {cartItems?.product?.title}
                    </span>
                    <span className="item-meta">
                      Size: {cartItems?.size?.size}
                    </span>
                    <span className="item-price">
                      ₹ {cartItems.product?.price}
                    </span>
                  </div>

                  <div className="item-actions">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateCartQuantity({
                            id: cartItems.id,
                            quantity: cartItems.quantity - 1,
                          })
                        }
                      >
                        <RemoveIcon style={{ fontSize: "0.9rem" }} />
                      </button>
                      <span className="qty-value">{cartItems.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateCartQuantity({
                            id: cartItems.id,
                            quantity: cartItems.quantity + 1,
                          })
                        }
                      >
                        <AddIcon style={{ fontSize: "0.9rem" }} />
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem({ id: cartItems.id })}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <CircularProgress
                          size={14}
                          style={{ color: "#cc2222" }}
                        />
                      ) : (
                        <DeleteOutlineIcon style={{ fontSize: "1.1rem" }} />
                      )}
                    </button>
                  </div>
                </div>
              )),
            )}
          </div>

          <div className="checkout-section">
            <div className="checkout-row">
              <span className="checkout-label">Subtotal</span>
              <span className="checkout-value">
                ₹ {totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="checkout-row">
              <span className="checkout-label">
                <LocalShippingOutlinedIcon style={{ fontSize: "0.9rem" }} />
                Shipping
              </span>
              {shipping === 0 ? (
                <span className="checkout-free">Free</span>
              ) : (
                <span className="checkout-value">₹ {shipping}</span>
              )}
            </div>

            {shipping > 0 && (
              <div className="free-shipping-nudge">
                Add ₹ {(999 - totalPrice).toLocaleString()} more for free
                shipping
              </div>
            )}

            <div className="checkout-divider" />

            <div className="checkout-row total-row">
              <span className="checkout-total-label">Total</span>
              <span className="checkout-total-value">
                ₹ {grandTotal.toLocaleString()}
              </span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              <LockOutlinedIcon style={{ fontSize: "1rem" }} />
              Proceed to Checkout
            </button>

            <p className="checkout-note">Secure checkout · Free returns</p>
          </div>
        </>
      )}
    </div>
  );
}
