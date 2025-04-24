import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

type ImageItem = {
  src: string;
  date: string;
};

let allSortedItemsCache: string[] | null = null;

export const fetchImagesFromFirebase = async (
  pageSize: number,
  startIndex: number = 0
): Promise<{ groupedImages: Record<string, ImageItem[]>; nextIndex?: number }> => {
  const imagesRef = ref(storage, 'images');

  // Cache listAll results (to avoid relisting every time)
  if (!allSortedItemsCache) {
    const result = await listAll(imagesRef);
    allSortedItemsCache = result.items
      .map(item => item.name)
      .sort((a, b) => b.localeCompare(a)); // Descending order by filename
  }

  const itemsPage = allSortedItemsCache.slice(startIndex, startIndex + pageSize);
  const imageRefs = itemsPage.map(name => ref(storage, `images/${name}`));

  const images: ImageItem[] = await Promise.all(
    imageRefs.map(async (item) => {
      const url = await getDownloadURL(item);
      const fileName = item.name;
      const dateMatch = fileName.match(/^\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : 'Unknown Date';
      return { src: url, date };
    })
  );

  const grouped = images.reduce<Record<string, ImageItem[]>>((acc, image) => {
    if (!acc[image.date]) acc[image.date] = [];
    acc[image.date].push(image);
    acc[image.date].sort((a, b) => b.src.localeCompare(a.src));
    return acc;
  }, {});

  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a))
  );

  const nextIndex = startIndex + pageSize;
  const hasMore = allSortedItemsCache.length > nextIndex;

  return {
    groupedImages: sortedGrouped,
    nextIndex: hasMore ? nextIndex : undefined,
  };
};
