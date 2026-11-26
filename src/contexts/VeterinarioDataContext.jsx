import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  initialVeterinaryBlocks,
  initialVeterinaryNotifications,
  inventoryProducts,
  veterinaryAppointments,
  veterinaryConsultations,
  veterinaryPatients,
  veterinaryServices,
  veterinarian,
  vaccineHistory,
} from "../data/veterinarioDemoData.js";

const VeterinarioDataContext = createContext(null);

export function VeterinarioDataProvider({ children }) {
  const [appointments, setAppointments] = useState(veterinaryAppointments);
  const [consultations, setConsultations] = useState(veterinaryConsultations);
  const [patients, setPatients] = useState(veterinaryPatients);
  const [vaccines, setVaccines] = useState(vaccineHistory);
  const [blocks, setBlocks] = useState(initialVeterinaryBlocks);
  const [notifications, setNotifications] = useState(initialVeterinaryNotifications);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState(inventoryProducts);
  const [profile, setProfile] = useState(veterinarian);

  const getPatient = useCallback((id) => patients.find((patient) => patient.id === id), [patients]);
  const getAppointment = useCallback((id) => appointments.find((appointment) => appointment.id === id), [appointments]);

  const saveConsultation = useCallback((appointmentId, values) => {
    setConsultations((current) => ({ ...current, [appointmentId]: { ...current[appointmentId], ...values } }));
  }, []);

  const saveRecipe = useCallback((appointmentId, recipe) => {
    saveConsultation(appointmentId, { receta: recipe });
  }, [saveConsultation]);

  const addVaccine = useCallback((vaccine) => {
    const product = inventory.find((entry) => entry.id === vaccine.productoId);
    if (!product || !["MEDICAMENTO", "INSUMO_CLINICO"].includes(product.tipo) || product.stock < 1) {
      throw new Error("No hay existencias disponibles del producto clínico seleccionado.");
    }
    setVaccines((current) => [{ ...vaccine, id: `V-${Date.now()}` }, ...current]);
    setInventory((current) => current.map((entry) => entry.id === product.id ? { ...entry, stock: entry.stock - 1 } : entry));
  }, [inventory]);

  const finishAppointment = useCallback((appointmentId, order) => {
    const appointment = appointments.find((entry) => entry.id === appointmentId);
    if (!appointment || appointment.estado === "COMPLETADA") throw new Error("La cita no existe o ya fue finalizada.");
    const consultation = consultations[appointmentId];
    if (!consultation || ["motivo", "subjetivo", "objetivo", "diagnostico", "plan"].some((field) => !String(consultation[field] ?? "").trim())) {
      throw new Error("Completa y guarda todos los apartados SOAP antes de finalizar la consulta.");
    }
    const invalidProduct = order.items.find((item) => {
      const product = inventory.find((entry) => entry.id === item.productId);
      return !product || !["MEDICAMENTO", "INSUMO_CLINICO"].includes(product.tipo) || product.stock < item.quantity;
    });
    if (invalidProduct) throw new Error("Un medicamento o insumo seleccionado ya no tiene existencias suficientes. Actualiza la orden antes de finalizar.");
    setAppointments((current) => current.map((appointment) => appointment.id === appointmentId
      ? { ...appointment, estado: "COMPLETADA" }
      : appointment));
    setOrders((current) => [{ ...order, id: `ORD-${Date.now()}`, citaId: appointmentId, estado: "PENDIENTE_COBRO" }, ...current]);
    setInventory((current) => current.map((product) => {
      const used = order.items.filter((item) => item.productId === product.id).reduce((total, item) => total + item.quantity, 0);
      return used ? { ...product, stock: product.stock - used } : product;
    }));
  }, [appointments, consultations, inventory]);

  const saveBlock = useCallback((block) => {
    setBlocks((current) => block.id
      ? current.map((item) => item.id === block.id ? block : item)
      : [...current, { ...block, id: `B-${Date.now()}` }]);
  }, []);

  const removeBlock = useCallback((id) => {
    setBlocks((current) => current.filter((block) => block.id !== id));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, leida: true })));
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, leida: true } : item));
  }, []);

  const updateProfile = useCallback((values) => {
    setProfile((current) => ({ ...current, ...values }));
  }, []);

  const value = useMemo(() => ({
    appointments,
    consultations,
    patients,
    vaccines,
    blocks,
    notifications,
    orders,
    inventory,
    profile,
    services: veterinaryServices,
    getPatient,
    getAppointment,
    saveConsultation,
    saveRecipe,
    addVaccine,
    finishAppointment,
    saveBlock,
    removeBlock,
    markNotificationRead,
    markNotificationsRead,
    updateProfile,
    setPatients,
  }), [appointments, consultations, patients, vaccines, blocks, notifications, orders, inventory, profile, getPatient, getAppointment, saveConsultation, saveRecipe, addVaccine, finishAppointment, saveBlock, removeBlock, markNotificationRead, markNotificationsRead, updateProfile]);

  return <VeterinarioDataContext.Provider value={value}>{children}</VeterinarioDataContext.Provider>;
}

export function useVeterinarioData() {
  const context = useContext(VeterinarioDataContext);
  if (!context) throw new Error("useVeterinarioData debe usarse dentro de VeterinarioDataProvider.");
  return context;
}
