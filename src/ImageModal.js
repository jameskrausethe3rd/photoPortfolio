import React from 'react';

const ImageModal = ({ selectedImage }) => {
  return (
    <div className="modal fade" id="imageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{selectedImage ? selectedImage.name : ''}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body text-center">
            {selectedImage && <img src={selectedImage.url} className="img-fluid" alt="Selected" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
