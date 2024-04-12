import React, { useState } from 'react';
import './ImageCard.css'; // Import CSS file for ImageCard styles

const ImageCard = ({ image, openModal }) => {
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
    setImageLoaded(true);
  };

  return (
    <div className="col-md-6">
      <div className="card image-card border" onClick={() => openModal(image)}>
        {loading && (
          <div className="spinner-overlay">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
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
