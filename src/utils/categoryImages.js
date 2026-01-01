// Centralized category image imports
import categoryAata from '../assets/category/category_aata.png';
import categoryChura from '../assets/category/category_chura.png';
import categoryDairy from '../assets/category/category_dairy.png';
import categoryDal from '../assets/category/category_dal.png';
import categoryFruits from '../assets/category/category_fruits.png';
import categoryHerbs from '../assets/category/category_herbs.png';
import categoryLocalProcessed from '../assets/category/category_local_processed.png';
import categoryNonVeg from '../assets/category/category_non_veg.png';
import categoryRice from '../assets/category/category_rice.png';
import categorySpices from '../assets/category/category_spices.png';
import categorySuperfoods from '../assets/category/category_superfoods.png';
import categoryVegitable from '../assets/category/category_vegitable.png';

// Image mapping for categories
export const categoryImageMapping = {
  '/src/assets/category/category_aata.png': categoryAata,
  '/src/assets/category/category_chura.png': categoryChura,
  '/src/assets/category/category_dairy.png': categoryDairy,
  '/src/assets/category/category_dal.png': categoryDal,
  '/src/assets/category/category_fruits.png': categoryFruits,
  '/src/assets/category/category_herbs.png': categoryHerbs,
  '/src/assets/category/category_local_processed.png': categoryLocalProcessed,
  '/src/assets/category/category_non_veg.png': categoryNonVeg,
  '/src/assets/category/category_rice.png': categoryRice,
  '/src/assets/category/category_spices.png': categorySpices,
  '/src/assets/category/category_superfoods.png': categorySuperfoods,
  '/src/assets/category/category_vegitable.png': categoryVegitable
};

// Helper function to process categories with images
export const processCategoriesWithImages = (categoriesData) => {
  return categoriesData.map(cat => ({
    ...cat,
    image: categoryImageMapping[cat.image] || categoryDal
  }));
};