import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const usersCollection = collection(db, 'services');

export const addService = async (service: any) => {
    try {
        await addDoc(usersCollection, service);
        return true;
    } catch (error) {
        return false;
    }
};

export const getServices = async () => {
    const result = await getDocs(usersCollection);
    return result;
}; 

export const deleteService = async (id: any) => {
    const docRef = doc(db, 'services', id);
    await deleteDoc(docRef);
    return true;
}

export const getServiceById = async (id: any) => {
    const docRef = doc(db, 'services', id);
    const result = await getDoc(docRef);
    return result.data();
}

export const updateService = async (id: any, service: any) => {
    const docRef = doc(db, 'services', id);
    try {
        await updateDoc(docRef, service)
        return true;
    } catch (error) {
        return false;
    }
}

