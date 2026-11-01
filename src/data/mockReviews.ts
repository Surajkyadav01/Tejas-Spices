import { ProductReview } from '../types';

export const INITIAL_REVIEWS: ProductReview[] = [
  // Kashmiri Lal Mirch (prod-5)
  {
    id: 'rev-mirch-1',
    productId: 'prod-5',
    author: 'Rajesh Mishra',
    rating: 5,
    date: '3 days ago',
    title: 'Vibrant natural red color without excessive heat!',
    comment: 'The color it gives to chicken curry and paneer gravy is incredible—deep crimson and authentic restaurant-style without feeling overly spicy or chemical. Cold-milled freshness is evident as soon as you open the pouch.',
    location: 'Suriyawan, UP',
    verified: true,
    helpfulCount: 24,
    userVotedHelpful: false,
  },
  {
    id: 'rev-mirch-2',
    productId: 'prod-5',
    author: 'Sunita Devi',
    rating: 5,
    date: '1 week ago',
    title: 'Purest Kashmiri Mirch in our market',
    comment: 'Very fine powder with zero artificial food color. It dissolves smoothly into the tadka. Tejas Spices delivers fresh batches every time.',
    location: 'Bhadohi, UP',
    verified: true,
    helpfulCount: 16,
    userVotedHelpful: false,
  },
  {
    id: 'rev-mirch-3',
    productId: 'prod-5',
    author: 'Anand Kumar Singh',
    rating: 4,
    date: '2 weeks ago',
    title: 'High quality zip-lock packaging',
    comment: 'The zip pouch retains the aroma nicely. Mild pungent kick with rich coloring. Will order the 500g pack next time.',
    location: 'Varanasi, UP',
    verified: true,
    helpfulCount: 8,
    userVotedHelpful: false,
  },

  // Basmati Rice (prod-1)
  {
    id: 'rev-rice-1',
    productId: 'prod-1',
    author: 'Vikas Tiwari',
    rating: 5,
    date: '2 days ago',
    title: 'Extra long grains and authentic Basmati fragrance',
    comment: 'Cooked biryani with this last Sunday. The grains elongated nearly twice the original size and did not stick together at all. True aged quality at an honest price.',
    location: 'Suriyawan, UP',
    verified: true,
    helpfulCount: 19,
    userVotedHelpful: false,
  },
  {
    id: 'rev-rice-2',
    productId: 'prod-1',
    author: 'Pooja Agarwal',
    rating: 5,
    date: '5 days ago',
    title: 'Fluffy texture, zero breakage',
    comment: 'Very clean grains without any pebbles or dust. One whistle in cooker with 1:1.75 water ratio produces perfect fluffy rice.',
    location: 'Gopiganj, UP',
    verified: true,
    helpfulCount: 11,
    userVotedHelpful: false,
  },

  // Lakadong Haldi (prod-7)
  {
    id: 'rev-haldi-1',
    productId: 'prod-7',
    author: 'Dr. Ramesh Chandra',
    rating: 5,
    date: '4 days ago',
    title: 'High 8% Curcumin shows in the golden color',
    comment: 'We use this daily with warm milk (golden milk) at bedtime. You can immediately tell it has genuine high curcumin by the earthy aroma and intense bright yellow hue. Free from chalk powder or lead chromate.',
    location: 'Bhadohi, UP',
    verified: true,
    helpfulCount: 31,
    userVotedHelpful: false,
  },
  {
    id: 'rev-haldi-2',
    productId: 'prod-7',
    author: 'Kavita Verma',
    rating: 4,
    date: '2 weeks ago',
    title: 'Very potent, small spoon is enough',
    comment: 'A half teaspoon gives the color of a full spoon of regular market haldi. Very authentic and fresh ground fragrance.',
    location: 'Suriyawan, UP',
    verified: true,
    helpfulCount: 14,
    userVotedHelpful: false,
  },

  // Royal Chandan Agarbatti (prod-9)
  {
    id: 'rev-agar-1',
    productId: 'prod-9',
    author: 'Pandit Satish Ji',
    rating: 5,
    date: 'Yesterday',
    title: 'True Mysore Chandan fragrance for daily pooja',
    comment: 'The scent is calm, divine and long-lasting without irritating the eyes or producing heavy black smoke. Smells like real sandalwood paste, not synthetic perfume.',
    location: 'Suriyawan, UP',
    verified: true,
    helpfulCount: 42,
    userVotedHelpful: false,
  },
  {
    id: 'rev-agar-2',
    productId: 'prod-9',
    author: 'Neelam Srivastava',
    rating: 5,
    date: '6 days ago',
    title: 'Burns slowly for nearly 50 minutes',
    comment: 'The whole living room remains fragrant for hours after one stick. Charcoal-free formula is safe for children and elders.',
    location: 'Prayagraj, UP',
    verified: true,
    helpfulCount: 18,
    userVotedHelpful: false,
  },

  // Shahi Garam Masala (prod-6)
  {
    id: 'rev-garam-1',
    productId: 'prod-6',
    author: 'Chef Manoj Tripathi',
    rating: 5,
    date: '3 days ago',
    title: 'Balanced royal whole spice blend',
    comment: 'Cardamom, mace, cinnamon, and cloves are in perfect proportion. Adding half a teaspoon at the end of cooking lifts the aroma completely.',
    location: 'Varanasi, UP',
    verified: true,
    helpfulCount: 22,
    userVotedHelpful: false,
  },

  // Toor Dal (prod-3)
  {
    id: 'rev-toor-1',
    productId: 'prod-3',
    author: 'Gita Gupta',
    rating: 5,
    date: '4 days ago',
    title: 'Pure unpolished taste like village farm dal',
    comment: 'No chemical polish or artificial shine. Cooks soft and sweet with traditional hing tadka. Great healthy staple.',
    location: 'Suriyawan, UP',
    verified: true,
    helpfulCount: 15,
    userVotedHelpful: false,
  },

  // Dry Fruits / California Almonds (prod-14)
  {
    id: 'rev-almond-1',
    productId: 'prod-14',
    author: 'Alok Pandey',
    rating: 5,
    date: '1 week ago',
    title: 'Crispy, sweet kernels with zero bitter pieces',
    comment: 'Vacuum sealed and fresh batch. Size of the almonds is uniform and jumbo. High oil content is clearly noticeable.',
    location: 'Bhadohi, UP',
    verified: true,
    helpfulCount: 13,
    userVotedHelpful: false,
  }
];

const LOCAL_STORAGE_KEY = 'tejas_product_reviews';

export function getAllSavedReviews(): ProductReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_REVIEWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REVIEWS;
  } catch (e) {
    console.error('Failed to parse reviews from localStorage', e);
    return INITIAL_REVIEWS;
  }
}

export function getReviewsForProduct(productId: string, productName?: string): ProductReview[] {
  const allReviews = getAllSavedReviews();
  const matched = allReviews.filter((r) => r.productId === productId);

  if (matched.length > 0) {
    return matched;
  }

  // Fallback realistic reviews if product doesn't have custom ones yet
  const fallbackAuthor = ['Rakesh Maurya', 'Deepak Bind', 'Shalini Yadav'];
  const fallbackLocations = ['Suriyawan, UP', 'Bhadohi, UP', 'Varanasi, UP'];
  const name = productName || 'product';

  return [
    {
      id: `fallback-${productId}-1`,
      productId,
      author: fallbackAuthor[0],
      rating: 5,
      date: '3 days ago',
      title: `Excellent freshness and packaging for ${name}`,
      comment: `Received this within hours in Suriyawan. The quality and aroma are noticeably superior compared to local open market spices. Highly recommended!`,
      location: fallbackLocations[0],
      verified: true,
      helpfulCount: 7,
      userVotedHelpful: false,
    },
    {
      id: `fallback-${productId}-2`,
      productId,
      author: fallbackAuthor[1],
      rating: 4,
      date: '1 week ago',
      title: 'Very good product, genuine value for money',
      comment: `Fresh batch delivered properly sealed. Reasonable pricing and quick home delivery. Will buy regularly from Tejas Spices.`,
      location: fallbackLocations[1],
      verified: true,
      helpfulCount: 4,
      userVotedHelpful: false,
    }
  ];
}

export function saveNewReview(newReview: ProductReview): ProductReview[] {
  const currentReviews = getAllSavedReviews();
  const updated = [newReview, ...currentReviews];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save review to localStorage', e);
  }
  return updated;
}

export function toggleHelpfulVote(reviewId: string): ProductReview[] {
  const currentReviews = getAllSavedReviews();
  const updated = currentReviews.map((rev) => {
    if (rev.id === reviewId) {
      const alreadyVoted = !!rev.userVotedHelpful;
      return {
        ...rev,
        helpfulCount: alreadyVoted ? Math.max(0, rev.helpfulCount - 1) : rev.helpfulCount + 1,
        userVotedHelpful: !alreadyVoted,
      };
    }
    return rev;
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update review helpful count in localStorage', e);
  }
  return updated;
}
