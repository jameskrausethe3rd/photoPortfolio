import React, { useState, useEffect, useRef } from 'react';
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
  const imagesPerPage = 10;

  useEffect(() => {
    // Set overflow-y property of body to 'scroll' by default
    document.body.style.overflowY = 'scroll';

    fetchImages();
  }, [currentPage]);

  const useScrollbarWidth = () => {
    const didCompute = useRef(false);
    const widthRef = useRef(0);
  
    if (didCompute.current) return widthRef.current;
  
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
  
    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);
  
    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)/2;
  
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
  
    didCompute.current = true;
    widthRef.current = scrollbarWidth;
  
    return scrollbarWidth;
  };

  const fetchImages = async () => {
    const storageRef = firebase.storage().ref();
    const imagesRef = storageRef.child('images');
    const imageList = await imagesRef.listAll();
  
    const startAt = (currentPage - 1) * imagesPerPage;
    const endAt = startAt + imagesPerPage;

    const urls = await Promise.all(
      imageList.items.slice().reverse().slice(startAt, endAt).map(async (item) => {
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

  const scrollbarWidth = useScrollbarWidth();

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
            <ImageModal selectedImage={selectedImage} scrollbarWidth={scrollbarWidth} />
          </div>
        </FadeIn>
    </>
  );
};

export default ImageGallery;
