export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Headwear' | 'Jackets' | 'Statement Pieces';
  price: number;
  currency: 'NGN';
  images: string[];
  description: string;
  sizes: string[];
  featured: boolean;
};

export const products: Product[] = [
  {
    id: '001',
    slug: 'ochre-linen-top',
    name: 'Ochre Linen Top',
    category: 'Tops',
    price: 55000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=CE8400&fg=1C1004&text=Ochre+Linen+Top'],
    description:
      'Structured linen top in warm ochre. Cut for confidence, finished with precision.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    id: '002',
    slug: 'dark-wood-oversized-jacket',
    name: 'Dark Wood Oversized Jacket',
    category: 'Jackets',
    price: 145000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=1C1004&fg=CE8400&text=Dark+Wood+Jacket'],
    description:
      'Oversized silhouette in deep dark wood tones. The jacket that speaks before you do.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
  },
  {
    id: '003',
    slug: 'woven-cap-caramel',
    name: 'Woven Cap — Caramel',
    category: 'Headwear',
    price: 35000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=75492B&fg=FFEBCD&text=Caramel+Cap'],
    description:
      'Hand-woven cap in rich caramel tones. One size, every story.',
    sizes: ['One Size'],
    featured: true,
  },
  {
    id: '004',
    slug: 'maroon-wide-leg-trousers',
    name: 'Maroon Wide-Leg Trousers',
    category: 'Bottoms',
    price: 78000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=7C1C12&fg=FFEBCD&text=Wide-Leg+Trousers'],
    description:
      'Wide-leg cut in deep maroon. Effortless movement, deliberate presence.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
  },
  {
    id: '005',
    slug: 'almond-draped-shirt',
    name: 'Almond Draped Shirt',
    category: 'Tops',
    price: 62000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=FFEBCD&fg=1C1004&text=Draped+Shirt'],
    description:
      'Fluid draped shirt in almond cream. Softness with structure.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    id: '006',
    slug: 'autumn-orange-bucket-hat',
    name: 'Autumn Orange Bucket Hat',
    category: 'Headwear',
    price: 28000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=FE7017&fg=1C1004&text=Bucket+Hat'],
    description:
      'Bold bucket hat in autumn orange. Make your entrance from the crown down.',
    sizes: ['S/M', 'L/XL'],
    featured: false,
  },
  {
    id: '007',
    slug: 'coffee-linen-shorts',
    name: 'Coffee Linen Shorts',
    category: 'Bottoms',
    price: 45000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=75492B&fg=FFEBCD&text=Linen+Shorts'],
    description:
      'Tailored linen shorts in warm coffee. Relaxed silhouette, refined finish.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
  },
  {
    id: '008',
    slug: 'byra-cap-nature-brown',
    name: 'BYRA Cap — Nature Brown',
    category: 'Headwear',
    price: 32000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=CE8400&fg=1C1004&text=BYRA+Cap'],
    description:
      'Signature BYRA cap embroidered with the geometric line motif. A crown for the self-defined.',
    sizes: ['One Size'],
    featured: true,
  },
  {
    id: '009',
    slug: 'reinvent-statement-coat',
    name: 'Reinvent Statement Coat',
    category: 'Statement Pieces',
    price: 180000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=CC7722&fg=1C1004&text=Statement+Coat'],
    description:
      'The centerpiece. An ochre statement coat cut to command every room.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    id: '010',
    slug: 'structured-boxy-tee',
    name: 'Structured Boxy Tee',
    category: 'Tops',
    price: 38000,
    currency: 'NGN',
    images: ['/api/placeholder?w=600&h=800&bg=1C1004&fg=CE8400&text=Boxy+Tee'],
    description:
      'Heavyweight jersey tee in a boxy silhouette. The foundation of every look.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
  },
];

export const featuredProducts = products.filter((p) => p.featured);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString('en-NG')}`;
}
