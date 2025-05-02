import React from 'react';
import { X, Download } from "lucide-react";
import { motion } from 'framer-motion';

type ImageModalProps = {
    imageSrc: string;
    onClose: () => void;
};

const ImageModal: React.FC<ImageModalProps> = ({ imageSrc, onClose }) => {
    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = (imageSrc.split("/").pop() ?? "").split("?")[0];
        link.click();
    };

    // Extract the image name from the imageSrc
    const imageName = (imageSrc.split("/").pop() ?? "").split("?")[0];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center"
        >
            <div className="relative max-w-4xl w-full mx-4 shadow-lg bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex justify-between items-center gap-2 p-4 bg-white dark:bg-gray-800">
                    <h2 className="relative text-xl font-semibold text-center">
                        {imageName}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            className="text-white dark:text-black bg-gray-700 dark:bg-gray-100 rounded-full p-2 hover:bg-gray-500 dark:hover:bg-gray-500"
                            onClick={downloadImage}
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button
                            className="text-white dark:text-black bg-gray-700 dark:bg-gray-100 rounded-full p-2 hover:bg-gray-500 dark:hover:bg-gray-500"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <img src={imageSrc} alt="Full View" className="w-full max-h-[90vh] object-cover bg-black" />
            </div>
        </motion.div>
    );
};

export default ImageModal;