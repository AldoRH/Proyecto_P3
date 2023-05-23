import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const usersCollection = collection(db, 'products');

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
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return true;
}

export const getProductById = async (id: any) => {
    const docRef = doc(db, 'products', id);
    const result = await getDoc(docRef);
    return result.data();
}

export const updateProduct = async (id: any, product: any) => {
    const docRef = doc(db, 'products', id);
    try {
        await updateDoc(docRef, product)
        return true;
    } catch (error) {
        return false;
    }
}

