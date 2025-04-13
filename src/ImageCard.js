import React, { useState } from 'react';
import { useVanillaTilt } from "./hooks/useVanillaTilt.js";
import './ImageCard.css'; // Import CSS file for ImageCard styles

const ImageCard = ({ image, openModal }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const tiltRef = useVanillaTilt({
    max: 7,
    speed: 400,
    glare: true,
    gyroscope: true,
    "max-glare": 0.5,
  });

  return (
    <div className="col-md-6">
      <div className="card image-card border" ref={tiltRef} onClick={() => openModal(image)}>
        {/* Loading indicator */}
        {!imageLoaded && (
          <div className="spinner-overlay">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {/* Image */}
        <img
          src={image.url}
          className={`card-img image-card-img ${imageLoaded ? 'visible' : 'hidden'}`}
          alt={`Photo`}
          onLoad={handleImageLoad}
        />
      </div>
    </div>
  );
};

export default ImageCard;