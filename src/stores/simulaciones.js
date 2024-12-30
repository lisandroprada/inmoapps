import { defineStore } from "pinia";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuthStore } from "./auth";

export const useSimulacionesStore = defineStore("simulaciones", {
  state: () => ({
    simulaciones: [],
    loading: false,
    error: null,
    simulacionSeleccionada: null,
  }),

  getters: {
    simulacionesGuardadas: (state) => state.simulaciones,

    simulacionesOrdenadas: (state) => {
      return [...state.simulaciones].sort((a, b) => {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      });
    },
  },

  actions: {
    async guardarSimulacion(simulacion) {
      try {
        const authStore = useAuthStore();
        if (!authStore.user) throw new Error("Usuario no autenticado");

        this.loading = true;
        this.error = null;

        const simulacionData = {
          montoSolicitado: simulacion.montoSolicitado,
          plazoMeses: simulacion.plazoMeses,
          datosCliente: simulacion.datosCliente,
          parametros: {
            tasaInteres: simulacion.parametros.tasaInteres,
            inflacionEstimada: simulacion.parametros.inflacionEstimada,
            valorUVAInicial: simulacion.parametros.valorUVAInicial,
            esCliente: simulacion.parametros.esCliente || false,
          },
          resultados: {
            cuotaInicial: simulacion.resultados.cuotaInicial,
            cuotaUVAs: simulacion.resultados.cuotaUVAs,
            ingresoMinimo: simulacion.resultados.ingresoMinimo,
            totalUVAsADevolver: simulacion.resultados.totalUVAsADevolver,
          },
          grafico: simulacion.grafico || null,
          userId: authStore.user.uid,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
        };

        let docId;
        if (simulacion.id) {
          // Actualizar simulación existente
          const docRef = doc(db, "simulaciones", simulacion.id);
          const { fechaCreacion, id, ...datosActualizacion } = simulacionData;
          await updateDoc(docRef, {
            ...datosActualizacion,
            fechaActualizacion: new Date().toISOString(),
          });
          docId = simulacion.id;

          // Actualizar en el array local
          const index = this.simulaciones.findIndex(
            (s) => s.id === simulacion.id,
          );
          if (index !== -1) {
            this.simulaciones[index] = {
              ...this.simulaciones[index],
              ...datosActualizacion,
              id: simulacion.id,
            };
          }
        } else {
          // Crear nueva simulación
          const docRef = await addDoc(
            collection(db, "simulaciones"),
            simulacionData,
          );
          docId = docRef.id;
          this.simulaciones.unshift({ id: docId, ...simulacionData });
        }

        return docId;
      } catch (error) {
        console.error("Error al guardar simulación:", error);
        this.error = "Error al guardar la simulación";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cargarSimulaciones() {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          this.simulaciones = [];
          return;
        }

        const q = query(
          collection(db, "simulaciones"),
          where("userId", "==", authStore.user.uid),
          orderBy("fechaCreacion", "desc"),
        );

        const snapshot = await getDocs(q);
        this.simulaciones = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error al cargar simulaciones:", error);
        this.error = "Error al cargar las simulaciones";
        this.simulaciones = [];
      } finally {
        this.loading = false;
      }
    },

    async actualizarSimulacion(id, datos) {
      try {
        this.loading = true;
        this.error = null;

        const docRef = doc(db, "simulaciones", id);
        await updateDoc(docRef, {
          ...datos,
          fechaActualizacion: new Date().toISOString(),
        });

        // Actualizar en el array local
        const index = this.simulaciones.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.simulaciones[index] = {
            ...this.simulaciones[index],
            ...datos,
            fechaActualizacion: new Date().toISOString(),
          };
        }
      } catch (error) {
        console.error("Error al actualizar simulación:", error);
        this.error = "Error al actualizar la simulación";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setSimulacionSeleccionada(simulacion) {
      this.simulacionSeleccionada = simulacion;
    },

    limpiarSimulacionSeleccionada() {
      this.simulacionSeleccionada = null;
    },

    // Método para cargar una simulación en el simulador
    cargarSimulacionEnSimulador(simulacion) {
      this.simulacionSeleccionada = simulacion;
      // Aquí podrías emitir un evento o usar otro mecanismo para notificar
      // al componente Simulador que debe actualizar sus valores
    },

    // Método para reiniciar el estado
    reiniciarEstado() {
      this.simulaciones = [];
      this.loading = false;
      this.error = null;
      this.simulacionSeleccionada = null;
    },
  },
});
