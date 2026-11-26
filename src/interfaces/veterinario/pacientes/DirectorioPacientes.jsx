import { useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { AnimalAvatar, EstadoVeterinario, VeterinarioPageHeader, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

export default function DirectorioPacientes() {
  const { patients, appointments } = useVeterinarioData();
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("TODAS");
  const filteredPatients = useMemo(() => patients.filter((patient) => {
    const matchesText = `${patient.nombre} ${patient.raza} ${patient.propietario}`.toLocaleLowerCase("es-MX").includes(search.trim().toLocaleLowerCase("es-MX"));
    const matchesSpecies = species === "TODAS" || patient.especie.toUpperCase() === species;
    return matchesText && matchesSpecies;
  }), [patients, search, species]);

  return (
    <div className="vet-page">
      <VeterinarioPageHeader title="Directorio de pacientes" description="Busca pacientes por nombre, especie, raza o propietario y abre su expediente clínico." />
      <div className="vet-filter-row">
        <label className="vet-filter-field grow"><span>Buscar paciente</span><span className="vet-inline-search"><Search size={14} /><input onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, raza o propietario" type="search" value={search} /></span></label>
        <label className="vet-filter-field">Especie<select onChange={(event) => setSpecies(event.target.value)} value={species}><option value="TODAS">Todas las especies</option><option value="PERRO">Perros</option><option value="GATA">Gatos</option><option value="CONEJA">Conejos</option></select></label>
        <span className="vet-directory-count"><strong>{filteredPatients.length}</strong> pacientes</span>
      </div>
      {filteredPatients.length ? (
        <div className="vet-patient-grid">
          {filteredPatients.map((patient) => {
            const lastAppointment = appointments
              .filter((appointment) => appointment.mascotaId === patient.id)
              .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.hora.localeCompare(a.hora))[0];
            return (
              <VeterinarioPanel className="vet-patient-card" key={patient.id}>
                <div className="vet-patient-card-head"><AnimalAvatar patient={patient} /><span><h2>{patient.nombre}</h2><p>{patient.especie} · {patient.raza} · {patient.edad}</p></span><EstadoVeterinario status="ACTIVA" /></div>
                <div className="vet-card-stats"><span>PROPIETARIO<strong>{patient.propietario}</strong></span><span>PESO ACTUAL<strong>{patient.peso}</strong></span></div>
                <div className="vet-patient-card-foot"><span><UserRound size={13} /> {patient.telefono}</span><span>{lastAppointment ? `Cita ${lastAppointment.fecha}` : "Sin citas registradas"}</span></div>
                <Link className="secondary-button full-button" to={`/veterinario/pacientes/${patient.id}`}>Abrir expediente clínico</Link>
              </VeterinarioPanel>
            );
          })}
        </div>
      ) : <VeterinarioPanel><p className="empty-state">No se encontraron pacientes con esos filtros.</p></VeterinarioPanel>}
    </div>
  );
}
