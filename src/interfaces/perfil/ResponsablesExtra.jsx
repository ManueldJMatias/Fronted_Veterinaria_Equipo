import { useState } from "react";
import { Link } from "react-router-dom";
import { responsables as initialContacts } from "../../data/demoData.js";
import { DemoNotice, PageHeader, Panel } from "../../components/InterfazUI.jsx";
import "./perfil.css";

export default function ResponsablesExtra() {
  const [contacts, setContacts] = useState(initialContacts);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  function addContact(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setContacts((items) => [...items, {
      id: `R-${Date.now()}`,
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      parentesco: formData.get("parentesco"),
    }]);
    event.currentTarget.reset();
    setAdding(false);
    setMessage("Contacto agregado en esta vista de demostración. No se guardó en un servidor.");
  }

  return (
    <div className="interface-page">
      <PageHeader eyebrow={<Link to="/cliente/perfil">Mi perfil</Link>} title="Responsables extra" description="Personas autorizadas para acompañar o recoger a tus mascotas." action={<button className="primary-button" onClick={() => setAdding((value) => !value)} type="button">{adding ? "Cancelar" : "+ Agregar responsable"}</button>} />
      <Panel className="contacts-panel">
        <div className="responsive-table"><table><thead><tr><th>Nombre completo</th><th>Teléfono</th><th>Parentesco</th><th>Acciones</th></tr></thead><tbody>
          {contacts.map((contact) => <tr key={contact.id}><td>{contact.nombre}</td><td>{contact.telefono}</td><td>{contact.parentesco}</td><td><button className="table-action" onClick={() => setMessage("La edición se guarda cuando se conecte el backend.")} type="button">Editar</button><button className="table-action danger" onClick={() => setContacts((items) => items.filter((item) => item.id !== contact.id))} type="button">Eliminar</button></td></tr>)}
        </tbody></table></div>
      </Panel>
      {adding && <Panel title="Nuevo responsable" className="new-contact-panel"><form onSubmit={addContact}><div className="form-grid"><label className="form-field">Nombre completo<input name="nombre" placeholder="Nombre y apellidos" required /></label><label className="form-field">Teléfono<input name="telefono" placeholder="55 1234 5678" required type="tel" /></label><label className="form-field">Parentesco<select name="parentesco" required><option value="">Selecciona parentesco</option><option>Madre / padre</option><option>Hermano/a</option><option>Amigo/a</option><option>Otro</option></select></label></div><div className="form-actions"><button className="primary-button" type="submit">Guardar responsable</button></div></form></Panel>}
      {message && <DemoNotice>{message}</DemoNotice>}
    </div>
  );
}
