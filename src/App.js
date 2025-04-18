import React, { useState, useEffect, useRef, useCallback } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import firebaseConfig from './firebaseConfig';
import './App.css';
import ImageCard from './ImageCard';
import Navbar from './Navbar';
import ImageModal from './ImageModal';
import BioCard from './BioCard';

firebase.initializeApp(firebaseConfig);

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 24;
  const observerRef = useRef(null);

  const fetchImages = useCallback(async () => {
    const storageRef = firebase.storage().ref();
    const imagesRef = storageRef.child('images');
    const imageList = await imagesRef.listAll();

    // Reverse the entire list of items first
    const reversedItems = imageList.items.reverse();

    const startAt = (currentPage - 1) * imagesPerPage;
    const endAt = startAt + imagesPerPage;

    // Slice the reversed list for pagination
    const urls = await Promise.all(
      reversedItems.slice(startAt, endAt).map(async (item) => {
        const url = await item.getDownloadURL();
        return { url, name: item.name };
      })
    );

    // Sort the images by name in descending order
    const sortedUrls = urls.sort((a, b) => b.name.localeCompare(a.name));

    setImages((prevImages) => {
      const filteredUrls = sortedUrls.filter(
        (newImage) => !prevImages.some((image) => image.url === newImage.url)
      );
      return [...prevImages, ...filteredUrls];
    });
  }, [currentPage, imagesPerPage]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the observer div is visible
        rootMargin: "500px", // Trigger 200px before the observer div enters the viewport
      }
    );
  
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
  
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    const modal = new window.bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  };

  return (
    <>
      <Navbar />
      <div className="background"></div>
      <BioCard />
        <div className="grid-container">
          <div className="row">
            {images.map((image, index) => (
              <ImageCard key={index} image={image} openModal={openModal} />
            ))}
          </div>
          <div ref={observerRef} style={{ height: '1px' }}></div>
          <ImageModal selectedImage={selectedImage} />
        </div>
    </>
  );
};

export default ImageGallery;