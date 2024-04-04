import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const imagesPerPage = 10;

  useEffect(() => {
    fetchImages();
  }, [currentPage]);

  const fetchImages = async () => {
    setLoading(true); // Show loading indicator

    const storageRef = firebase.storage().ref();
    const imagesRef = storageRef.child('images');
    const imageList = await imagesRef.listAll();

    const startAt = (currentPage - 1) * imagesPerPage;
    const endAt = startAt + imagesPerPage;

    const urls = await Promise.all(
      imageList.items.slice(startAt, endAt).map(async (item) => {
        const url = await item.getDownloadURL();
        return { url, name: item.name };
      })
    );

    // Reverse the order of images
    setImages(urls.reverse());
    setRandomBackgroundImage(urls); // Set background image once images are fetched
    setLoading(false); // Hide loading indicator
  };

  const setRandomBackgroundImage = (urls) => {
    if (urls.length > 0) {
      const randomIndex = Math.floor(Math.random() * urls.length);
      const randomImageUrl = urls[randomIndex].url;
      document.querySelector('.background').style.backgroundImage = `url(${randomImageUrl})`;
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    const modal = new window.bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
  };

  return (
    <>
      <div className="background" style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, filter: 'blur(10px)' }}>
        {loading && ( // Show loading indicator if loading state is true
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">James Krause Portfolio</span>
        </div>
      </nav>
      <div className="pt-4"></div> {/* Padding added here */}
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="row">
          {images.map((image, index) => (
            <div key={index} className="col-md-6">
              <div className="card" style={{ width: '100%', height: '400px', marginBottom: '8px', cursor: 'pointer' }} onClick={() => openModal(image)}>
                <img src={image.url} className="card-img-top" alt={`Photo ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-primary me-2" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <button className="btn btn-primary" onClick={nextPage}>Next</button>
        </div>
        {/* Bootstrap Modal for Image */}
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
      </div>
    </>
  );
};

export default ImageGallery;
