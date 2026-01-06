import { db } from "./firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Guardar habitación
export const saveRoomToFirebase = async (room) => {
  if (!room || !room.id) return;
  try {
    await setDoc(doc(db, "rooms", room.id.toString()), room);
  } catch (error) {
    console.error("Error guardando habitación:", error);
  }
};

// Guardar cliente
export const saveClientToFirebase = async (cliente) => {
  if (!cliente || !cliente.cedula) return;
  try {
    await setDoc(doc(db, "clientes", cliente.cedula), cliente);
  } catch (error) {
    console.error("Error guardando cliente:", error);
  }
};

// Traer habitaciones
export const fetchRoomsFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, "rooms"));
  return querySnapshot.docs.map(doc => doc.data());
};

// Traer clientes
export const fetchClientsFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, "clientes"));
  return querySnapshot.docs.map(doc => doc.data());
};
