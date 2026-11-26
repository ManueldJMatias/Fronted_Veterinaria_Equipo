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
import { VeterinarioDataProvider } from "../contexts/VeterinarioDataContext.jsx";
import VeterinarioLayout from "../components/VeterinarioLayout.jsx";
import InicioVeterinario from "../interfaces/veterinario/inicio/InicioVeterinario.jsx";
import MiAgenda from "../interfaces/veterinario/agenda/MiAgenda.jsx";
import DetalleCitaVeterinario from "../interfaces/veterinario/agenda/DetalleCitaVeterinario.jsx";
import DirectorioPacientes from "../interfaces/veterinario/pacientes/DirectorioPacientes.jsx";
import ExpedienteVeterinario from "../interfaces/veterinario/pacientes/ExpedienteVeterinario.jsx";
import ResumenClinico from "../interfaces/veterinario/pacientes/ResumenClinico.jsx";
import HistorialClinico from "../interfaces/veterinario/pacientes/HistorialClinico.jsx";
import RecetasPaciente from "../interfaces/veterinario/pacientes/RecetasPaciente.jsx";
import CarnetClinico from "../interfaces/veterinario/pacientes/CarnetClinico.jsx";
import ConsultaLayout from "../interfaces/veterinario/consultas/ConsultaLayout.jsx";
import ConsultaSOAP from "../interfaces/veterinario/consultas/ConsultaSOAP.jsx";
import RecetaMedica from "../interfaces/veterinario/consultas/RecetaMedica.jsx";
import RegistroCarnet from "../interfaces/veterinario/consultas/RegistroCarnet.jsx";
import ServiciosInsumos from "../interfaces/veterinario/consultas/ServiciosInsumos.jsx";
import MiDisponibilidad from "../interfaces/veterinario/disponibilidad/MiDisponibilidad.jsx";
import CentroNotificacionesVeterinario from "../interfaces/veterinario/notificaciones/CentroNotificacionesVeterinario.jsx";
import PerfilVeterinario from "../interfaces/veterinario/perfil/PerfilVeterinario.jsx";
import HospitalizacionVeterinario from "../interfaces/veterinario/hospitalizacion/HospitalizacionVeterinario.jsx";

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
      <Route path="/veterinario" element={<VeterinarioDataProvider><VeterinarioLayout /></VeterinarioDataProvider>}>
        <Route index element={<Navigate to="inicio" replace />} />
        <Route path="inicio" element={<InicioVeterinario />} />
        <Route path="agenda" element={<MiAgenda />} />
        <Route path="citas/:citaId" element={<DetalleCitaVeterinario />} />
        <Route path="consultas/:citaId" element={<ConsultaLayout />}>
          <Route index element={<ConsultaSOAP />} />
          <Route path="receta" element={<RecetaMedica />} />
          <Route path="carnet" element={<RegistroCarnet />} />
          <Route path="servicios" element={<ServiciosInsumos />} />
        </Route>
        <Route path="pacientes" element={<DirectorioPacientes />} />
        <Route path="pacientes/:mascotaId" element={<ExpedienteVeterinario />}>
          <Route index element={<ResumenClinico />} />
          <Route path="historial" element={<HistorialClinico />} />
          <Route path="recetas" element={<RecetasPaciente />} />
          <Route path="carnet" element={<CarnetClinico />} />
        </Route>
        <Route path="disponibilidad" element={<MiDisponibilidad />} />
        <Route path="notificaciones" element={<CentroNotificacionesVeterinario />} />
        <Route path="perfil" element={<PerfilVeterinario />} />
        <Route path="hospitalizacion" element={<HospitalizacionVeterinario />} />
      </Route>
      <Route path="/" element={<Navigate to="/cliente/inicio" replace />} />
      <Route path="*" element={<Navigate to="/cliente/inicio" replace />} />
    </Routes>
  );
}
