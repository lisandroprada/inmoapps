import { defineStore } from "pinia";
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { useAuthStore } from "./auth";

export const useClientesStore = defineStore("clientes", {
  state: () => ({
    clientes: [],
    clienteSeleccionado: null,
    loading: false,
    error: null,
  }),

  actions: {
    async cargarClientes() {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          console.log("Usuario no autenticado");
          return;
        }
        console.log("Usuario autenticado:", authStore.user.uid);
        const q = query(
          collection(db, "clientes"),
          where("userId", "==", authStore.user.uid),
          orderBy("apellido", "asc"),
        );

        const querySnapshot = await getDocs(q);
        this.clientes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Clientes cargados:", this.clientes); // Agregar este log
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async agregarCliente(cliente) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) throw new Error("Usuario no autenticado");

        const clienteData = {
          ...cliente,
          userId: authStore.user.uid,
          createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, "clientes"), clienteData);
        const nuevoCliente = { id: docRef.id, ...clienteData };
        this.clientes.push(nuevoCliente);
        return nuevoCliente;
      } catch (error) {
        console.error("Error al agregar cliente:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async actualizarCliente(id, datos) {
      this.loading = true;
      this.error = null;
      try {
        const docRef = doc(db, "clientes", id);
        await updateDoc(docRef, {
          ...datos,
          updatedAt: new Date().toISOString(),
        });

        const index = this.clientes.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.clientes[index] = { ...this.clientes[index], ...datos };
        }
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async eliminarCliente(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteDoc(doc(db, "clientes", id));
        this.clientes = this.clientes.filter((c) => c.id !== id);
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setClienteSeleccionado(cliente) {
      this.clienteSeleccionado = cliente;
    },

    async seleccionarClientePorId(clienteId) {
      this.loading = true;
      this.error = null;
      try {
        // Primero buscar en el array local
        let cliente = this.clientes.find((c) => c.id === clienteId);

        // Si no está en el array local, buscarlo en Firestore
        if (!cliente) {
          const docRef = doc(db, "clientes", clienteId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            cliente = { id: docSnap.id, ...docSnap.data() };
            // Agregar al array local si no existe
            if (!this.clientes.some((c) => c.id === cliente.id)) {
              this.clientes.push(cliente);
            }
          } else {
            throw new Error("Cliente no encontrado");
          }
        }

        this.clienteSeleccionado = cliente;
        return cliente;
      } catch (error) {
        console.error("Error al seleccionar cliente:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
