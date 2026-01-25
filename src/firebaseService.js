import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

// Rooms CRUD

/**
 * Creates a new room in Firestore.
 * @param {object} roomData - The room data to be saved.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const createRoom = async (roomData) => {
  try {
    const docRef = await addDoc(collection(db, "rooms"), roomData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

/**
 * Fetches all rooms from Firestore.
 * @returns {Promise<Array<object>>} An array of room objects, each with its Firestore ID.
 */
export const getRooms = async () => {
  const querySnapshot = await getDocs(collection(db, "rooms"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Updates an existing room in Firestore.
 * @param {string} roomId - The ID of the room to update.
 * @param {object} updatedData - An object with the fields to update.
 */
export const updateRoom = async (roomId, updatedData) => {
  if (!roomId) return;
  try {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, updatedData);
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

/**
 * Deletes a room from Firestore.
 * @param {string} roomId - The ID of the room to delete.
 */
export const deleteRoom = async (roomId) => {
  if (!roomId) return;
  try {
    await deleteDoc(doc(db, "rooms", roomId));
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

// Clients CRUD

/**
 * Creates a new client in Firestore. If cedula is provided, it's used as the document ID.
 * @param {object} clientData - The client data to be saved.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const createClient = async (clientData) => {
  try {
    if (clientData.cedula) {
      await setDoc(doc(db, "clientes", clientData.cedula.toString()), clientData);
      return clientData.cedula;
    } else {
      const docRef = await addDoc(collection(db, "clientes"), clientData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

/**
 * Fetches all clients from Firestore.
 * @returns {Promise<Array<object>>} An array of client objects, each with its Firestore ID.
 */
export const getClients = async () => {
  const querySnapshot = await getDocs(collection(db, "clientes"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Updates an existing client in Firestore.
 * @param {string} clientId - The ID of the client to update (e.g., the cedula).
 * @param {object} updatedData - An object with the fields to update.
 */
export const updateClient = async (clientId, updatedData) => {
  if (!clientId) return;
  try {
    const clientRef = doc(db, "clientes", clientId.toString());
    await updateDoc(clientRef, updatedData);
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

/**
 * Deletes a client from Firestore.
 * @param {string} clientId - The ID of the client to delete (e.g., the cedula).
 */
export const deleteClient = async (clientId) => {
  if (!clientId) return;
  try {
    await deleteDoc(doc(db, "clientes", clientId.toString()));
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};