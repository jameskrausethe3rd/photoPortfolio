import React, { useState } from 'react';
import Tilty from 'react-tilty';
import './ImageCard.css'; // Import CSS file for ImageCard styles

const ImageCard = ({ image, openModal }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="col-lg-3">
      <Tilty className="tilty" max={10} glare maxGlare={0.2}>
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
            className={`card-element-image ${imageLoaded ? 'visible' : 'hidden'}`}
            alt={`Photo`}
            onLoad={handleImageLoad}
            onClick={() => openModal(image)}
          />
          {/* Border layer */}
          <div className="overlay-button">
            OPEN
          </div>
      </Tilty>
    </div>
  );
};

export default ImageCard;