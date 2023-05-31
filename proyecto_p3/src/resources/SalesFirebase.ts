import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const salesCollection = collection(db, "sales");

export const addSale = async (sale: any) => {
  try {
    const saleWithTimestamp = {
      ...sale,
      createdAt: new Date().toISOString(),
    };
    await addDoc(salesCollection, saleWithTimestamp);
    return true;
  } catch (error) {
    return false;
  }
};

export const getSales = async () => {
  try {
    const { docs: salesData } = await getDocs(salesCollection);
    return salesData;
  } catch (error) {
    console.log(error);
  }
};

export const getSale = async (id: any) => {
  try {
    const saleDocRef = doc(db, "sales", id);
    const saleDoc = await getDoc(saleDocRef);

    if (saleDoc.exists()) {
      const data = saleDoc.data();
      return data;
    } else {
      console.log("Sale Does Not Exist");
    }
  } catch (error) {
    console.log("Error Getting Sale");
  }
};

export const deleteSale = async (id: any) => {
  try {
    const docRef = doc(db, "sales", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.log(error);
  }
};
