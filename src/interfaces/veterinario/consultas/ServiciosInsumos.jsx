import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { AlertaClinica, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

function initialServicesFor(appointment, services) {
  const match = appointment.servicio.toLowerCase().includes("vacun")
    ? services.find((service) => service.id === "vacunacion")
    : services.find((service) => service.id === "consulta");
  return [{ key: "appointment-service", nombre: match?.nombre ?? appointment.servicio, cantidad: 1, precio: match?.precio ?? 450 }];
}

export default function ServiciosInsumos() {
  const { appointment, patient, isReadOnly } = useOutletContext();
  const { consultations, inventory, services, finishAppointment } = useVeterinarioData();
  const navigate = useNavigate();
  const allowedProducts = inventory.filter((product) => ["MEDICAMENTO", "INSUMO_CLINICO"].includes(product.tipo));
  const [serviceLines, setServiceLines] = useState(() => initialServicesFor(appointment, services));
  const [productLines, setProductLines] = useState([]);
  const [selectedService, setSelectedService] = useState(services[0]?.id ?? "");
  const [selectedProduct, setSelectedProduct] = useState(allowedProducts[0]?.id ?? "");
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const serviceTotal = serviceLines.reduce((sum, line) => sum + line.precio * line.cantidad, 0);
  const productTotal = productLines.reduce((sum, line) => sum + line.precio * line.cantidad, 0);
  const total = serviceTotal + productTotal;
  const stockWarning = productLines.find((line) => (inventory.find((product) => product.id === line.productId)?.stock ?? 0) < line.cantidad);
  const consultation = consultations[appointment.id];
  const incompleteSOAP = !consultation || ["motivo", "subjetivo", "objetivo", "diagnostico", "plan"].some((field) => !String(consultation[field] ?? "").trim());

  const orderLines = useMemo(() => productLines.map((line) => ({ productId: line.productId, quantity: line.cantidad, unitPrice: line.precio })), [productLines]);

  function addService() {
    const service = services.find((item) => item.id === selectedService);
    if (!service) return;
    setServiceLines((lines) => [...lines, { key: `${service.id}-${Date.now()}`, nombre: service.nombre, cantidad: 1, precio: service.precio }]);
  }

  function addProduct() {
    const product = allowedProducts.find((item) => item.id === selectedProduct);
    if (!product) return;
    setProductLines((lines) => {
      const current = lines.find((line) => line.productId === product.id);
      if (current) return lines.map((line) => line.productId === product.id ? { ...line, cantidad: Math.min(line.cantidad + 1, product.stock) } : line);
      return [...lines, { productId: product.id, nombre: product.nombre, tipo: product.tipo, cantidad: 1, precio: product.precio }];
    });
  }

  function changeQuantity(productId, quantity) {
    const product = allowedProducts.find((item) => item.id === productId);
    if (!product) return;
    const safeQuantity = Math.min(product.stock, Math.max(1, Number(quantity) || 1));
    setProductLines((lines) => lines.map((line) => line.productId === productId ? { ...line, cantidad: safeQuantity } : line));
  }

  function submitOrder() {
    setSubmitting(true);
    try {
      finishAppointment(appointment.id, {
        mascota: patient.nombre,
        responsable: patient.propietario,
        total,
        servicios: serviceLines.map(({ nombre, cantidad, precio }) => ({ nombre, cantidad, precio })),
        items: orderLines,
      });
      setConfirming(false);
      navigate(`/veterinario/citas/${appointment.id}`, { replace: true });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo validar el inventario.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="vet-soap-layout">
      <div className="vet-main-column">
        <VeterinarioPanel title="Servicios realizados" action={<span className="vet-cell-muted">Tarifas de demostración</span>}>
          <div className="vet-line-item vet-line-header"><strong>Concepto</strong><small>Cantidad</small><small>Precio</small><span /></div>
          {serviceLines.map((line) => <div className="vet-line-item" key={line.key}><strong>{line.nombre}</strong><span>× {line.cantidad}</span><span>${(line.precio * line.cantidad).toFixed(2)}</span><button aria-label={`Quitar ${line.nombre}`} disabled={isReadOnly || line.key === "appointment-service"} onClick={() => setServiceLines((items) => items.filter((item) => item.key !== line.key))} type="button"><Trash2 size={13} /></button></div>)}
          {!isReadOnly && <div className="vet-add-line"><select aria-label="Servicio disponible" onChange={(event) => setSelectedService(event.target.value)} value={selectedService}>{services.map((service) => <option key={service.id} value={service.id}>{service.nombre} · ${service.precio.toFixed(2)}</option>)}</select><button className="secondary-button" onClick={addService} type="button"><Plus size={14} /> Añadir servicio</button></div>}
        </VeterinarioPanel>
        <VeterinarioPanel title="Medicamentos e insumos clínicos" action={<span className="vet-cell-muted">Solo inventario clínico</span>}>
          <div className="vet-inventory-summary">
            {allowedProducts.map((product) => <div className="vet-inventory-row" key={product.id}><strong>{product.nombre}</strong><span>{product.tipo === "MEDICAMENTO" ? "Medicamento" : "Insumo clínico"}</span><span className={product.stock < 5 ? "vet-low-stock" : ""}>{product.stock} {product.unidad}</span><span>${product.precio.toFixed(2)}</span></div>)}
          </div>
          {!isReadOnly && <div className="vet-add-line"><select aria-label="Medicamento o insumo" onChange={(event) => setSelectedProduct(event.target.value)} value={selectedProduct}>{allowedProducts.map((product) => <option disabled={product.stock < 1} key={product.id} value={product.id}>{product.nombre} · stock {product.stock}</option>)}</select><button className="secondary-button" disabled={!allowedProducts.some((product) => product.stock > 0)} onClick={addProduct} type="button"><Plus size={14} /> Añadir a la orden</button></div>}
          {productLines.map((line) => {
            const product = allowedProducts.find((item) => item.id === line.productId);
            return <div className="vet-line-item" key={line.productId}><strong>{line.nombre}<small>Stock disponible: {product?.stock ?? 0} {product?.unidad}</small></strong><label className="vet-quantity-label">Cantidad<input disabled={isReadOnly} max={product?.stock} min="1" onChange={(event) => changeQuantity(line.productId, event.target.value)} type="number" value={line.cantidad} /></label><span>${(line.precio * line.cantidad).toFixed(2)}</span><button aria-label={`Quitar ${line.nombre}`} disabled={isReadOnly} onClick={() => setProductLines((items) => items.filter((item) => item.productId !== line.productId))} type="button"><Minus size={13} /></button></div>;
          })}
          {stockWarning && <AlertaClinica>No hay existencia suficiente de {stockWarning.nombre}. Reduce la cantidad antes de finalizar.</AlertaClinica>}
          {notice && <p className="demo-notice" role="alert">{notice}</p>}
        </VeterinarioPanel>
      </div>
      <aside className="vet-aside-column">
        <VeterinarioPanel title="Resumen para Caja">
          <div className="vet-order-summary-row"><span>Servicios</span><strong>${serviceTotal.toFixed(2)} MXN</strong></div>
          <div className="vet-order-summary-row"><span>Medicamentos / insumos</span><strong>${productTotal.toFixed(2)} MXN</strong></div>
          <div className="vet-order-total"><span>Total de la orden</span><strong>${total.toFixed(2)} MXN</strong></div>
          <div className="vet-clinical-alert warning"><span>Al cerrar, la orden se marcará PENDIENTE_COBRO para recepción.</span></div>
          {incompleteSOAP && !isReadOnly && <AlertaClinica>Completa y guarda todos los apartados SOAP antes de finalizar la consulta.</AlertaClinica>}
          <button className="primary-button full-button" disabled={isReadOnly || Boolean(stockWarning) || incompleteSOAP || submitting} onClick={() => setConfirming(true)} type="button">Finalizar consulta y enviar a caja</button>
          {isReadOnly && <p className="muted-copy">La consulta finalizada ya fue enviada a la orden local de demostración.</p>}
        </VeterinarioPanel>
        <VeterinarioPanel title="Responsable y paciente"><div className="vet-appointment-details"><span>Mascota<strong>{patient.nombre} · {patient.especie}</strong></span><span>Responsable<strong>{patient.propietario}</strong></span><span>Cita<strong>{appointment.id}</strong></span></div></VeterinarioPanel>
      </aside>
      {confirming && <div className="vet-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirming(false); }} role="presentation">
        <section aria-labelledby="vet-finish-heading" aria-modal="true" className="vet-modal" role="dialog">
          <div className="vet-modal-heading"><div><h2 id="vet-finish-heading">Confirmar cierre de consulta</h2><p>La consulta se marcará completada y se preparará una orden para recepción.</p></div><button aria-label="Cerrar" className="vet-modal-close" onClick={() => setConfirming(false)} type="button">×</button></div>
          <div className="vet-review-list"><p><span>Paciente</span><strong>{patient.nombre} · {patient.propietario}</strong></p><p><span>Servicios</span><strong>${serviceTotal.toFixed(2)} MXN</strong></p><p><span>Medicamentos e insumos</span><strong>${productTotal.toFixed(2)} MXN</strong></p><p className="total"><span>Total pendiente de cobro</span><strong>${total.toFixed(2)} MXN</strong></p></div>
          <AlertaClinica tone="info">Este cierre es únicamente local para la demostración. La operación atómica real, el descuento de inventario y la orden de cobro requieren integrar el backend.</AlertaClinica>
          <div className="vet-soap-actions"><button className="secondary-button" onClick={() => setConfirming(false)} type="button">Volver a revisar</button><button className="primary-button" disabled={Boolean(stockWarning) || submitting} onClick={submitOrder} type="button">Confirmar y enviar a Caja</button></div>
        </section>
      </div>}
    </div>
  );
}
