import React from 'react';
import { motion } from 'framer-motion';

interface ImageItemProps {
  src: string;
  index: number;
}

const motionProps = {
  initial: { opacity: 0, translateY: 200 },
  animate: { opacity: 1, translateY: 0 },
  transition: {
    duration: 0.5,
    ease: 'easeOut',
    delay: 0, // Will be overridden dynamically
  },
};

const ImageItem: React.FC<ImageItemProps> = ({ src, index }) => {
  return (
    <motion.div
      className="aspect-square relative overflow-hidden bg-gray-200 shadow-xl"
      {...motionProps}
      transition={{ ...motionProps.transition, delay: index * 0.1 }} // Staggered delay for each image
    >
      <img
        src={src}
        alt={`Image ${index + 1}`}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};

export default ImageItem;
