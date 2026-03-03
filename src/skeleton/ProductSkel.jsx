import "../styles/allproduct.css";

function ProductSkel() {
  return (
    <>
      <div className="products-main skeleton-card">
        <div className="img skeleton-img">
          <div className="skelton-shimmer"></div>
        </div>
        <div className="details skeleton-details">
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    </>
  );
}

export default ProductSkel;
