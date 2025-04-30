import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import DateDivider from './DateDivider';
import { getImages } from '../getImages';
import FloatingActionButton from './FloatingActionButton';
import ImageModal from './ImageModal';
import ImageItem from './ImageItem';

type ImageItem = {
  src: string;
  date: string;
};

const ImageGrid = () => {
  const [groupedImages, setGroupedImages] = useState<Record<string, ImageItem[]>>({});
  const [nextStartIndex, setNextStartIndex] = useState<number | undefined>(0);
  const [loading, setLoading] = useState(false);
  const [newImageSrcs, setNewImageSrcs] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const mergeGroupedImages = useCallback(
    (
      oldImages: Record<string, ImageItem[]>,
      newImages: Record<string, ImageItem[]>
    ): Record<string, ImageItem[]> => {
      const merged: Record<string, ImageItem[]> = {};
      const allDates = new Set([
        ...Object.keys(oldImages),
        ...Object.keys(newImages),
      ]);
      for (const date of allDates) {
        const seen = new Set<string>();
        const combined = [
          ...(oldImages[date] || []),
          ...(newImages[date] || []),
        ];
        merged[date] = combined
          .filter((img) => {
            if (seen.has(img.src)) return false;
            seen.add(img.src);
            return true;
          })
          .sort((a, b) => b.src.localeCompare(a.src));
      }
      return Object.fromEntries(
        Object.entries(merged).sort(([a], [b]) => b.localeCompare(a))
      );
    },
    []
  );

  const loadImages = useCallback(
    async (startIndex: number) => {
      setLoading(true);
      const { groupedImages: nextBatch, nextPageToken } =
        await getImages(20, startIndex);
      // Track only new batch srcs for staggered delay
      const batchSrcs = new Set<string>();
      Object.values(nextBatch)
        .flat()
        .forEach((img) => batchSrcs.add(img.src));
      setNewImageSrcs(batchSrcs);
      setGroupedImages((prev) => mergeGroupedImages(prev, nextBatch));
      setNextStartIndex(nextPageToken);
      setLoading(false);
    },
    [mergeGroupedImages]
  );

  useEffect(() => {
    if (nextStartIndex === 0) {
      loadImages(0);
    }
  }, [loadImages, nextStartIndex]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (ent.isIntersecting && !loading && nextStartIndex !== undefined) {
          observerRef.current?.unobserve(ent.target);
          loadImages(nextStartIndex);
        }
      },
      { rootMargin: '200px' }
    );
    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadImages, loading, nextStartIndex]);

  useEffect(() => {
    if (nextStartIndex !== undefined && sentinelRef.current) {
      observerRef.current?.observe(sentinelRef.current);
    }
  }, [nextStartIndex]);

  // newBatchIndex persists across groups for correct ordering of new images
  let newBatchIndex = 0;

  return (
    <div className="p-6">
      {Object.entries(groupedImages).map(([date, images]) => {
        // Compute divider delay matching first new image in this group
        const hasNew = images.some((img) => newImageSrcs.has(img.src));
        const dividerDelay = hasNew ? newBatchIndex * 0.05 : 0;

        return (
          <div key={date} className="mb-20">
            <motion.div
              initial={{ opacity: 0, translateY: 100 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.4, delay: dividerDelay }}
              className='relative mb-4 sticky top-0 z-10'
            >
              <DateDivider date={date} />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {images.map((img) => {
                const isNew = newImageSrcs.has(img.src);
                const delay = isNew ? newBatchIndex * 0.05 : 0;
                if (isNew) newBatchIndex++;

                return (
                  <ImageItem
                    key={img.src}
                    src={img.src}
                    delay={delay}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Sentinel div for IntersectionObserver */}
      <div ref={sentinelRef} className="h-1" />

      {loading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {selectedImage && (
        <ImageModal
          imageSrc={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      <FloatingActionButton />
    </div>
  );
};

export default ImageGrid;
