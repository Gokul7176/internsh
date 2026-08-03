import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';

const STORAGE_KEY = 'lumina_products';

function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }
}

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    if (isFirebaseConfigured()) {
      try {
        const colRef = collection(db, 'products');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Product[];
        }
      } catch (err) {
        console.warn('Firestore fetch error, using local products:', err);
      }
    }
    return getLocalProducts();
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Product;
        }
      } catch (err) {
        console.warn('Firestore getProductById error, fallback active:', err);
      }
    }
    const products = getLocalProducts();
    return products.find((p) => p.id === id) || null;
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const timestamp = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id: 'lumina-' + Math.random().toString(36).substring(2, 8),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (isFirebaseConfigured()) {
      try {
        const colRef = collection(db, 'products');
        const docRef = await addDoc(colRef, {
          ...productData,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        newProduct.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addDoc product error:', err);
      }
    }

    const current = getLocalProducts();
    const updated = [newProduct, ...current];
    saveLocalProducts(updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const timestamp = new Date().toISOString();

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, { ...updates, updatedAt: timestamp });
      } catch (err) {
        console.warn('Firestore updateDoc error:', err);
      }
    }

    const products = getLocalProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates, updatedAt: timestamp };
      saveLocalProducts(products);
      return products[index];
    }
    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'products', id);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('Firestore deleteDoc error:', err);
      }
    }

    const products = getLocalProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveLocalProducts(filtered);
    return true;
  }
};
