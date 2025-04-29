import { fetchImagesFromFirebase } from './firebaseHelper';

const localImageFiles = import.meta.glob('./assets/images/*.{jpg,jpeg,png,svg,gif}', { as: 'url' });

type ImageItem = {
  src: string;
  date: string;
};

// Utility function to introduce a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getImages = async (
  pageSize: number = 20,
  nextIndex?: number
): Promise<{ groupedImages: Record<string, ImageItem[]>; nextPageToken?: number }> => {
  const source = import.meta.env.VITE_IMAGE_SOURCE;

  if (source === 'firebase') {
    const result = await fetchImagesFromFirebase(pageSize, nextIndex);
    return {
      groupedImages: result.groupedImages,
      nextPageToken: result.nextIndex,
    };
  }

  await delay(0);

  const entries = Object.entries(localImageFiles);
  const resolvedImages: ImageItem[] = await Promise.all(
    entries.map(async ([path, importer]) => {
      const url = await importer();
      const fileName = path.split('/').pop() || '';
      const dateMatch = fileName.match(/^\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : 'Unknown Date';
      return { src: url, date };
    })
  );

  const grouped = resolvedImages.reduce<Record<string, ImageItem[]>>((acc, image) => {
    if (!acc[image.date]) acc[image.date] = [];
    acc[image.date].push(image);
    acc[image.date].sort((a, b) => b.src.localeCompare(a.src));
    return acc;
  }, {});

  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).sort(([dateA,], [dateB,]) => dateB.localeCompare(dateA))
  );

  return { groupedImages: sortedGrouped };
};
