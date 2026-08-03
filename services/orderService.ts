import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Order, OrderStatus, OrderTimelineStep } from '@/types';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';

const STORAGE_KEY = 'lumina_orders';

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

export function buildDefaultTimeline(createdAt: string): OrderTimelineStep[] {
  return [
    {
      status: 'placed',
      title: 'Order Placed',
      description: 'Your order has been placed and confirmed.',
      timestamp: createdAt,
      completed: true,
    },
    {
      status: 'packed',
      title: 'Order Packed',
      description: 'Items have been carefully packed in Eco-Luxe packaging.',
      timestamp: '',
      completed: false,
    },
    {
      status: 'shipped',
      title: 'Out for Delivery',
      description: 'Package has been dispatched with express tracking.',
      timestamp: '',
      completed: false,
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Package successfully delivered to shipping address.',
      timestamp: '',
      completed: false,
    },
  ];
}

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'>): Promise<Order> {
    const timestamp = new Date().toISOString();
    const timeline = buildDefaultTimeline(timestamp);
    const newOrder: Order = {
      ...orderData,
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'placed',
      timeline,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (isFirebaseConfigured()) {
      try {
        const colRef = collection(db, 'orders');
        const docRef = await addDoc(colRef, newOrder);
        newOrder.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addDoc order error:', err);
      }
    }

    const current = getLocalOrders();
    saveLocalOrders([newOrder, ...current]);
    return newOrder;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    if (isFirebaseConfigured()) {
      try {
        const colRef = collection(db, 'orders');
        const q = query(colRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Order[];
        }
      } catch (err) {
        console.warn('Firestore getUserOrders error:', err);
      }
    }
    const orders = getLocalOrders();
    return orders.filter((o) => o.userId === userId || userId === 'guest');
  },

  async getAllOrders(): Promise<Order[]> {
    if (isFirebaseConfigured()) {
      try {
        const colRef = collection(db, 'orders');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Order[];
        }
      } catch (err) {
        console.warn('Firestore getAllOrders error:', err);
      }
    }
    return getLocalOrders();
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Order;
        }
      } catch (err) {
        console.warn('Firestore getOrderById error:', err);
      }
    }
    const orders = getLocalOrders();
    return orders.find((o) => o.id === id) || null;
  },

  async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order | null> {
    const timestamp = new Date().toISOString();

    const orders = getLocalOrders();
    const index = orders.findIndex((o) => o.id === id);
    let updatedOrder: Order | null = null;

    if (index !== -1) {
      const order = orders[index];
      const statusMap: Record<OrderStatus, number> = {
        placed: 0,
        packed: 1,
        shipped: 2,
        delivered: 3,
        cancelled: -1,
      };

      const targetLevel = statusMap[newStatus];
      const updatedTimeline = order.timeline.map((step) => {
        const stepLevel = statusMap[step.status];
        if (newStatus === 'cancelled') {
          return { ...step, completed: false };
        }
        if (stepLevel <= targetLevel && stepLevel !== -1) {
          return {
            ...step,
            completed: true,
            timestamp: step.timestamp || timestamp,
          };
        }
        return step;
      });

      updatedOrder = {
        ...order,
        status: newStatus,
        timeline: updatedTimeline,
        updatedAt: timestamp,
      };

      orders[index] = updatedOrder;
      saveLocalOrders(orders);
    }

    if (isFirebaseConfigured() && updatedOrder) {
      try {
        const docRef = doc(db, 'orders', id);
        await updateDoc(docRef, {
          status: newStatus,
          timeline: updatedOrder.timeline,
          updatedAt: timestamp,
        });
      } catch (err) {
        console.warn('Firestore updateOrderStatus error:', err);
      }
    }

    return updatedOrder;
  }
};
