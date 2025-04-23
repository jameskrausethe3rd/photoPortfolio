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

const ImageGallery = ({ test = false }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;
  const observerRef = useRef(null);
  const reversedItemsRef = useRef([]);

  // Local test images
  const localImages = [
    { url: "/photoPortfolio/images/2025-04-12_JRK02480.jpg", name: "Test1"},
    { url: "/photoPortfolio/images/2025-04-12_JRK02486.jpg", name: "Test2"},
    { url: "/photoPortfolio/images/2025-04-12_JRK02489.jpg", name: "Test3"},
    { url: "/photoPortfolio/images/2025-04-12_JRK02490.jpg", name: "Test4"},
    { url: "/photoPortfolio/images/2025-04-12_JRK02493.jpg", name: "Test5"},
    { url: "/photoPortfolio/images/2025-04-12_JRK02496.jpg", name: "Test6"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02504.jpg", name: "Test7"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02505.jpg", name: "Test8"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02506.jpg", name: "Test9"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02508.jpg", name: "Test10"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02509.jpg", name: "Test11"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02510.jpg", name: "Test12"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02512.jpg", name: "Test13"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02513.jpg", name: "Test14"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02515.jpg", name: "Test15"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02519.jpg", name: "Test16"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02521.jpg", name: "Test17"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02522.jpg", name: "Test18"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02523.jpg", name: "Test19"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02526.jpg", name: "Test20"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02527.jpg", name: "Test21"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02531.jpg", name: "Test22"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02533.jpg", name: "Test23"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02536.jpg", name: "Test24"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02537.jpg", name: "Test25"},
    { url: "/photoPortfolio/images/2025-04-19_JRK02539.jpg", name: "Test26"},
  ];

  const getNewSetOfUrls = useCallback(async () => {
    if (test) {
      // Use local images for testing
      const startAt = (currentPage - 1) * imagesPerPage;
      const endAt = startAt + imagesPerPage;
      localImages.reverse();
      const urls = localImages.slice(startAt, endAt);

      if (startAt && endAt < localImages.length) {
        setImages((prevImages) => [...prevImages, ...urls]);
      }
    } else {
      // Fetch images from Firebase
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
    }
  }, [currentPage, imagesPerPage, test]);
  
  useEffect(() => {
    if (test) {
      // Load local images for testing
      getNewSetOfUrls();
    } else {
      // Fetch images from Firebase
      const fetchInitialImages = async () => {
        const storageRef = firebase.storage().ref();
        const imagesRef = storageRef.child('images');
        const imageList = await imagesRef.listAll();

        reversedItemsRef.current = imageList.items.reverse(); // Save once
        await getNewSetOfUrls(); // Load page 1
      };

      fetchInitialImages();
    }
  }, [test, getNewSetOfUrls]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1); // Just increment
        }
      },
      {
        threshold: 0.5,
        rootMargin: '500px',
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
              <ImageCard key={`${image.url}-${index}`} image={image} openModal={openModal} />
            ))}
          </div>
          <div ref={observerRef} style={{ height: '1px' }}></div>
          <ImageModal selectedImage={selectedImage} />
        </div>
    </>
  );
};

export default ImageGallery;