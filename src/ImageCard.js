import React, { useState } from 'react';
import Tilty from 'react-tilty';
import './ImageCard.css';

const ImageCard = ({ image, openModal, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="col-lg-3">
      <Tilty className="tilty" max={10} glare maxGlare={0.2}>
        {!imageLoaded && (
          <div className="spinner-overlay">
            <div className="spinner-border text-dark" role="status"></div>
          </div>
        )}
        <img
          src={image.url}
          className={`card-element-image ${imageLoaded ? 'visible' : 'hidden'}`}
          alt="Photo"
          onLoad={handleImageLoad}
          onClick={() => openModal(image)}
        />
        <div className="overlay-button">OPEN</div>
      </Tilty>
    </div>
  );
};

export default ImageCard;
