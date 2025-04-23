import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { app } from './firebase'; // Your Firebase app initialization

const storage = getStorage(app);

// Helper function to fetch image URLs and group them by date
export const fetchImagesFromFirebase = async (): Promise<Record<string, { src: string, date: string }[]>> => {
  const imagesRef = ref(storage, 'images');
  const imageList = await listAll(imagesRef);

  const images: { src: string, date: string }[] = await Promise.all(
    imageList.items.map(async (item) => {
      const url = await getDownloadURL(item);
      const fileName = item.name;
      const dateMatch = fileName.match(/^\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : 'Unknown Date';
      return { src: url, date };
    })
  );

  // Group images by date
  const groupedImages = images.reduce<Record<string, { src: string, date: string }[]>>((acc, image) => {
    if (!acc[image.date]) acc[image.date] = [];
    acc[image.date].push(image);

    // Sort the images in each date group by filename in descending order
    acc[image.date].sort((a, b) => b.src.localeCompare(a.src));

    return acc;
  }, {});

  // Sort the groups by date in descending order
  const sortedGrouped = Object.fromEntries(
    Object.entries(groupedImages)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
  );

  return sortedGrouped;
};
