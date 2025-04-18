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
  const imagesPerPage = 12;
  const observerRef = useRef(null);
  const reversedItemsRef = useRef([]);

  const getNewSetOfUrls = useCallback(async () => {
    const startAt = (currentPage - 1) * imagesPerPage;
    const endAt = startAt + imagesPerPage;
    const reversedItems = reversedItemsRef.current;
  
    const urls = await Promise.all(
      reversedItems.slice(startAt, endAt).map(async (item) => {
        const url = await item.getDownloadURL();
        return { url, name: item.name };
      })
    );
  
    setImages((prevImages) => {
      const filteredUrls = urls.filter(
        (newImage) => !prevImages.some((image) => image.url === newImage.url)
      );
      return [...prevImages, ...filteredUrls];
    });
  }, [currentPage, imagesPerPage]);
  
  useEffect(() => {
    const fetchInitialImages = async () => {
      const storageRef = firebase.storage().ref();
      const imagesRef = storageRef.child('images');
      const imageList = await imagesRef.listAll();
  
      reversedItemsRef.current = imageList.items.reverse(); // Save once
      await getNewSetOfUrls(); // Load page 1
    };
  
    fetchInitialImages();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1); // Just increment
        }
      },
      {
        threshold: 0.5,
        rootMargin: "500px",
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

  useEffect(() => {
    if (currentPage === 1) return; // Already loaded in first fetch
  
    getNewSetOfUrls();
  }, [currentPage, getNewSetOfUrls]);

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
              <ImageCard key={image.url} image={image} openModal={openModal} />
            ))}
          </div>
          <div ref={observerRef} style={{ height: '1px' }}></div>
          <ImageModal selectedImage={selectedImage} />
        </div>
    </>
  );
};

export default ImageGallery;