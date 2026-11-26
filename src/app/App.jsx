import { Navigate, Route, Routes } from "react-router-dom";
import ClienteLayout from "../components/ClienteLayout.jsx";
import InicioSesion from "../interfaces/acceso/InicioSesion.jsx";
import RegistroCliente from "../interfaces/acceso/RegistroCliente.jsx";
import InicioCliente from "../interfaces/inicio-cliente/InicioCliente.jsx";
import MisCitas from "../interfaces/citas/MisCitas.jsx";
import AgendarCita from "../interfaces/citas/AgendarCita.jsx";
import DetalleCita from "../interfaces/citas/DetalleCita.jsx";
import MisMascotas from "../interfaces/mascotas/MisMascotas.jsx";
import FormularioMascota from "../interfaces/mascotas/FormularioMascota.jsx";
import ExpedienteMascota from "../interfaces/mascotas/ExpedienteMascota.jsx";
import MisPagos from "../interfaces/pagos/MisPagos.jsx";
import DetallePago from "../interfaces/pagos/DetallePago.jsx";
import ClinicaMedicos from "../interfaces/clinica/ClinicaMedicos.jsx";
import ClinicaServicios from "../interfaces/clinica/ClinicaServicios.jsx";
import CentroNotificaciones from "../interfaces/notificaciones/CentroNotificaciones.jsx";
import MiPerfil from "../interfaces/perfil/MiPerfil.jsx";
import ResponsablesExtra from "../interfaces/perfil/ResponsablesExtra.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<InicioSesion />} />
      <Route path="/registro" element={<RegistroCliente />} />
      <Route path="/cliente" element={<ClienteLayout />}>
        <Route index element={<Navigate to="inicio" replace />} />
        <Route path="inicio" element={<InicioCliente />} />
        <Route path="citas" element={<MisCitas />} />
        <Route path="citas/nueva" element={<AgendarCita />} />
        <Route path="citas/:id" element={<DetalleCita />} />
        <Route path="mascotas" element={<MisMascotas />} />
        <Route path="mascotas/nueva" element={<FormularioMascota />} />
        <Route path="mascotas/:id/editar" element={<FormularioMascota />} />
        <Route path="mascotas/:id" element={<ExpedienteMascota />} />
        <Route path="mascotas/:id/historial" element={<ExpedienteMascota pestañaInicial="Historial clínico" />} />
        <Route path="mascotas/:id/recetas" element={<ExpedienteMascota pestañaInicial="Recetas" />} />
        <Route path="mascotas/:id/carnet" element={<ExpedienteMascota pestañaInicial="Carnet digital" />} />
        <Route path="pagos" element={<MisPagos />} />
        <Route path="pagos/:id" element={<DetallePago />} />
        <Route path="clinica" element={<ClinicaMedicos />} />
        <Route path="clinica/servicios" element={<ClinicaServicios />} />
        <Route path="notificaciones" element={<CentroNotificaciones />} />
        <Route path="perfil" element={<MiPerfil />} />
        <Route path="perfil/responsables" element={<ResponsablesExtra />} />
      </Route>
      <Route path="/" element={<Navigate to="/cliente/inicio" replace />} />
      <Route path="*" element={<Navigate to="/cliente/inicio" replace />} />
    </Routes>
  );
}
