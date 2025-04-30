import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageModal from './ImageModal';

interface ImageItemProps {
  src: string;
  delay: number;
}

const ImageItem: React.FC<ImageItemProps> = ({ src, delay }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageLoad = () => setIsImageLoaded(true);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.div
        className="w-full h-60 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg/40 cursor-pointer"
        initial={{ opacity: 0, translateY: 100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.4, delay }}
        onClick={handleOpenModal}
      >
        {!isImageLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={src}
          alt="Image"
          className={`w-full h-full object-cover ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={handleImageLoad}
        />
      </motion.div>

      {isModalOpen && (
        <ImageModal
          imageSrc={src}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ImageItem;