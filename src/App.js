import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const randomImageUrl = images[randomIndex].url;
      document.querySelector('.background').style.backgroundImage = `url(${randomImageUrl})`;
    }
  }, [images]);

  const fetchImages = async () => {
    const storageRef = firebase.storage().ref();
    const imagesRef = storageRef.child('images');
    const imageList = await imagesRef.listAll();

    const urls = await Promise.all(imageList.items.map(async (item) => {
      const url = await item.getDownloadURL();
      return { url, name: item.name };
    }));

    // Sort images by filename in descending order
    urls.sort((a, b) => {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
      return 0;
    });

    setImages(urls);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    const modal = new window.bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  };

  return (
    <>
      <div className="background" style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, filter: 'blur(10px)' }}></div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">James Krause Portfolio</span>
        </div>
      </nav>
      <div className="pt-4"></div> {/* Padding added here */}
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="row">
          {images.reverse().map((image, index) => (
            <div key={index} className="col-md-6">
              <div className="card" style={{ width: '100%', height: '400px', marginBottom: '8px', cursor: 'pointer' }} onClick={() => openModal(image)}>
                <img src={image.url} className="card-img-top" alt={`Photo ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
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
