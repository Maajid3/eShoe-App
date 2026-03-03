import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import "../styles/buy-now.css";
import ImageSlider from "./ImageSlider";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Error from "./Error";
import { useAddCart } from "../hooks/useCart";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BuyNow() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["id", id],
    queryFn: () => apiClient(`products/${id}/`),
    enabled: !!id,
  });

  const productSelect = data?.data;

  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (productSelect?.sizes?.length > 0) {
      setSelectedSize(productSelect.sizes[0].id);
    }
  }, [productSelect]);

  const {
    mutate: addToCart,
    isPending,
    isSuccess,
    isError: addError,
    reset,
  } = useAddCart();

  useEffect(() => {
    if (isSuccess || addError) {
      const timer = setTimeout(() => reset(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, addError]);

  const handleAddCart = () => {
    addToCart({
      product_id: productSelect.id,
      size_id: selectedSize,
      quantity: 1,
    });
  };

  const getBtnState = () => {
    if (isPending) return "loading";
    if (isSuccess) return "success";
    if (addError) return "error";
    return "idle";
  };

  const btnState = getBtnState();

  if (isLoading)
    return (
      <div className="buy-now-loader">
        <CircularProgress style={{ color: "#1a1a1a" }} />
      </div>
    );
  if (isError) return <Error />;

  const imageData = data?.data?.images || [];

  return (
    <div className="buy-now">
      <div className="product-img">
        <ImageSlider images={imageData} />
      </div>

      <div className="product-details">
        <div className="product-meta">
          <h2 className="product-title">{productSelect.title}</h2>
          <span className="product-price">₹ {productSelect.price}</span>
        </div>

        <div className="size-section">
          <label className="size-label">Select Size</label>
          <div className="size-options">
            {productSelect.sizes.map((size) => (
              <button
                key={size.id}
                className={`size-chip ${selectedSize === size.id ? "active" : ""}`}
                onClick={() => setSelectedSize(size.id)}
              >
                {size.size}
              </button>
            ))}
          </div>
        </div>

        <p className="product-description">{productSelect.description}</p>

        <div className="buy-btns">
          <button
            className={`btn-cart ${btnState}`}
            onClick={handleAddCart}
            disabled={isPending}
          >
            {btnState === "loading" && (
              <>
                <CircularProgress
                  size={16}
                  thickness={5}
                  style={{ color: "#888" }}
                />
                <span>Adding...</span>
              </>
            )}
            {btnState === "success" && (
              <>
                <span className="btn-icon">✓</span>
                <span>Added to Cart</span>
              </>
            )}
            {btnState === "error" && (
              <>
                <span className="btn-icon">!</span>
                <span>Select valid options</span>
              </>
            )}
            {btnState === "idle" && (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;
