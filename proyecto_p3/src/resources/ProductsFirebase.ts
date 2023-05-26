import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const usersCollection = collection(db, "products");

export const addProduct = async (product: any) => {
  try {
    await addDoc(usersCollection, product);
    return true;
  } catch (error) {
    return false;
  }
};

export const getProducts = async () => {
  const result = await getDocs(usersCollection);
  return result;
};

export const deleteProduct = async (id: any) => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
  return true;
};

export const getProductById = async (id: any) => {
  const docRef = doc(db, "products", id);
  const result = await getDoc(docRef);
  return result.data();
};

export const updateProduct = async (id: any, product: any) => {
  const docRef = doc(db, "products", id);
  try {
    await updateDoc(docRef, product);
    return true;
  } catch (error) {
    return false;
  }
};

export const decrementProductQuantity = async (
  productId: any,
  quantity: any
) => {
  const productRef = doc(db, "products", productId);

  try {
    const productDoc = await getDoc(productRef);
    const productData = productDoc.data();

    if (!productData) {
      throw new Error("Product not found");
    }

    const currentStock = productData.stock;
    const updatedStock = currentStock - quantity;

    if (updatedStock < 0) {
      throw new Error("Insufficient stock");
    }

    await updateDoc(productRef, { stock: updatedStock });
    return true;
  } catch (error) {
    console.error("Error decrementing product quantity:", error);
    return false;
  }
};
