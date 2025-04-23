import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DateDivider from './DateDivider';
import { getImages } from '../getImages';

type ImageItem = {
    src: string;
    date: string;
};

const ImageGrid = () => {
    const [groupedImages, setGroupedImages] = useState<Record<string, ImageItem[]>>({});

    useEffect(() => {
        const loadImages = async () => {
            const grouped = await getImages();
            setGroupedImages(grouped);
        };

        loadImages();
    }, []);

    return (
        <div className="p-6">
            {Object.entries(groupedImages).map(([date, images]) => (
                <div key={date} className="mb-12">
                    <DateDivider date={date} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <motion.div
                                key={index}
                                className="w-full h-60 overflow-hidden bg-gray-200 rounded-xl shadow-xl"
                                initial={{ opacity: 0, translateY: 100 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                    <img src={img.src} alt={`Image ${index}`} className="w-full h-full object-cover" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
