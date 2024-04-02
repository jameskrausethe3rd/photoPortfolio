import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const storageRef = firebase.storage().ref();
    const imagesRef = storageRef.child('images');
    const imageList = await imagesRef.listAll();

    const urls = await Promise.all(imageList.items.map(async (item) => {
      const url = await item.getDownloadURL();
      return { url, name: item.name };
    }));

    // Sort images by filename
    urls.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    // Get the latest 5 images for carousel
    const latestImagesForCarousel = urls.slice(0, 5).map(image => image.url);

    setImages(urls);
  };

  const handleUpload = async () => {
    setUploading(true);

    const storageRef = firebase.storage().ref();

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const imagesRef = storageRef.child(`images/${file.name}`);
      await imagesRef.put(file);
    }

    // After successful upload, refresh the image gallery
    await fetchImages();

    // Clear selected files and set uploading to false
    setSelectedFiles([]);
    setUploading(false);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    const modal = new window.bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-center my-4">Upload Images</h1>
      <div className="mb-3">
        <input type="file" className="form-control" id="upload" onChange={handleFileChange} multiple />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleUpload} disabled={selectedFiles.length === 0 || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      <div id="carouselExampleIndicators" className="carousel slide mb-4" style={{ height: '400px', overflow: 'hidden' }} data-bs-ride="carousel">
        <div className="carousel-inner">
          {images.slice(0, 5).map((image, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img src={image.url} className="d-block mx-auto" alt={`Photo ${index}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <h1 className="text-center my-4">All Images</h1>
      <div className="row">
        {images.map((image, index) => (
          <div key={index} className="col-md-6">
            <div className="card" style={{ width: '100%', height: '400px', marginBottom: '8px', cursor: 'pointer' }} onClick={() => openModal(image)}>
              <img src={image.url} className="card-img-top" alt={`Photo ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        ))}
      </div>
      {/* Bootstrap Modal for Image */}
      <div className="modal fade" id="imageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedImage && <img src={selectedImage.url} className="img-fluid" alt="Selected" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
