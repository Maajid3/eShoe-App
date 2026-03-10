import "../styles/allproduct.css";
import Error from "./Error";
import apiClient from "../api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductSkel from "../skeleton/ProductSkel";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import notFoundSvg from "../assets/svg/404Error.svg";

const PAGE_SIZE = 12;

export default function AllProduct({ selectedCat, searchResult }) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [selectedCat, searchResult]);

  const getProducts = () =>
    apiClient("products/", {
      params: {
        product_type:
          selectedCat && selectedCat.length > 0
            ? selectedCat.join(",")
            : undefined,
        search: searchResult && searchResult.length ? searchResult : undefined,
        page,
        page_size: PAGE_SIZE,
      },
    });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", selectedCat, searchResult, page],
    queryFn: getProducts,
    placeholderData: (prev) => prev,
  });

  const products = data?.data?.results ?? data?.data ?? [];
  const totalCount = data?.data?.count ?? products.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const [showColdStart, setShowColdStart] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowColdStart(false);
      return;
    }
    const timeout = setTimeout(() => setShowColdStart(true), 5000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (isError)
    return <Error message="Failed to load products" onRetry={refetch} />;

  return (
    <div className="all-products-wrapper">
      {showColdStart && (
        <p className="waking-server">
          ⏳ Server is starting up, please wait a few seconds...
        </p>
      )}
      <div className="products-grid">
        {isLoading
          ? Array(PAGE_SIZE)
              .fill(0)
              .map((_, i) => <ProductSkel key={i} />)
          : products.map((product) => (
              <div
                className="product-card"
                key={product.id}
                onClick={() => navigate(`/buy/${product.id}`)}
              >
                <div className="product-card-img">
                  <img src={product.primary_image} alt={product.title} />
                  <div className="product-card-overlay">
                    <span className="product-card-cta">View Product</span>
                  </div>
                </div>
                <div className="product-card-info">
                  <p className="product-card-name">{product.title}</p>
                  <p className="product-card-price">₹ {product.price}</p>
                </div>
              </div>
            ))}
      </div>

      {!isLoading && products.length === 0 && (
        <div className="empty-products">
          <img src={notFoundSvg} alt="NotFound" />
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeftIcon style={{ fontSize: "1.1rem" }} />
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dot-${i}`} className="page-dots">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`page-num ${page === p ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ),
              )}
          </div>

          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRightIcon style={{ fontSize: "1.1rem" }} />
          </button>
        </div>
      )}
    </div>
  );
}
