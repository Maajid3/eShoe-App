import { useEffect, useState } from "react";
import "../styles/buy-now.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import { CircularProgress } from "@mui/material";

export default function ImageSlider({ images }) {
  const [currrentIndex, setCurrentIndex] = useState(0);

  const image = images[currrentIndex];


  const prevImageFn = () => {
    const isFirst = currrentIndex === 0;
    const newIndex = isFirst ? images.length - 1 : currrentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextImageFn = () => {
    setCurrentIndex((prevIndex) => {
      const isLast = prevIndex === images.length - 1;
      return isLast ? 0 : prevIndex + 1;
    });
  };

  useEffect(() => {
    const interval = setInterval(nextImageFn, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="slide-image">
        <img src={image.image} alt="image" />
        <div className="change-btn">
          <ArrowBackIosNewSharpIcon
            fontSize="large"
            onClick={prevImageFn}
            sx={{ cursor: "pointer" }}
          />
          <ArrowForwardIosIcon
            fontSize="large"
            onClick={nextImageFn}
            sx={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </>
  );
}
