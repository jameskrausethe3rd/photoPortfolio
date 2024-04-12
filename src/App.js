import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import firebaseConfig from './firebaseConfig';
import './App.css';
import ImageCard from './ImageCard';
import Navbar from './Navbar';
import NavigationButtons from './NavigationButtons';
import ImageModal from './ImageModal';
import BioCard from './BioCard';
import FadeIn from 'react-fade-in';

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
    setLoading(true);
  
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
  
    setImages((prevImages) => {
      // Filter out existing images from the new batch
      const filteredUrls = urls.filter((newImage) => !prevImages.some((image) => image.url === newImage.url));
      // Concatenate filtered new images with previous images
      return [...prevImages, ...filteredUrls];
    });
    setLoading(false);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    const modal = new window.bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  };

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Increment current page
    fetchImages(); // Fetch more images when "Load More" button is clicked
  };

  return (
    <>
      <Navbar />
      <div className="background"></div>
      <FadeIn>
        <BioCard />
        <div className="grid-container">
          <div className="row">
            {images.map((image, index) => (
              <ImageCard key={index} image={image} openModal={openModal} />
            ))}
          </div>
          {images.length > 0 && <NavigationButtons loadMore={loadMore} currentPage={currentPage} />}
          <ImageModal selectedImage={selectedImage} />
        </div>
      </FadeIn>
    </>
  );
};

export default ImageGallery;
