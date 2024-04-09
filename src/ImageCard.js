import React from 'react';
import './ImageCard.css'; // Import CSS file for ImageCard styles

const ImageCard = ({ image, openModal }) => {
  return (
    <div className="col-md-6">
      <div className="card image-card" onClick={() => openModal(image)}>
        <img src={image.url} className="card-img-top image-card-img" alt={`Photo`} />
      </div>
    </div>
  );
};

export default ImageCard;
