import { useState } from "react";
import { ArrowLeft, Download, ReceiptText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ordenes } from "../../data/demoData.js";
import { DemoNotice, PageHeader, Panel, StatusBadge } from "../../components/InterfazUI.jsx";
import "./pagos.css";

export default function DetallePago() {
  const { id } = useParams();
  const order = ordenes.find((item) => item.id === id) ?? ordenes[0];
  const [message, setMessage] = useState("");
  const isPaid = order.estado === "PAGADA";

  return (
    <div className="interface-page">
      <PageHeader eyebrow={<Link to="/cliente/pagos">Mis pagos</Link>} title="Detalle de orden" description={`Folio ${order.id} · ${order.fecha}`} action={<StatusBadge status={order.estado} />} />
      <div className="payment-detail-grid">
        <Panel title="Desglose de cargos">
          <div className="responsive-table"><table><thead><tr><th>Concepto</th><th>Cantidad</th><th>Precio</th></tr></thead><tbody>
            <tr><td>Consulta general · Luna</td><td>1</td><td>$650.00</td></tr>
            <tr><td>Material clínico</td><td>1</td><td>$80.00</td></tr>
            <tr><td>Producto · Suplemento</td><td>1</td><td>$120.00</td></tr>
          </tbody></table></div>
          <div className="payment-totals"><p><span>Subtotal</span><strong>$850.00</strong></p><p><span>Impuestos</span><strong>$0.00</strong></p><p className="total-line"><span>Total</span><strong>{order.total} MXN</strong></p></div>
          <p className="field-hint">Los conceptos reflejan el desglose histórico de la orden.</p>
        </Panel>
        <div className="payment-detail-aside">
          <Panel title={isPaid ? "Pago realizado" : "Resumen del pago"}>
            <p className="detail-total">{order.total}<small> MXN</small></p>
            <p className="muted-copy">{isPaid ? "Pago registrado · Tarjeta" : "Esta orden está pendiente de pago."}</p>
            {isPaid
              ? <button className="secondary-button full-button" onClick={() => setMessage("El archivo PDF del recibo aún no está conectado.")} type="button"><Download size={15} /> Descargar recibo</button>
              : <button className="primary-button full-button" onClick={() => setMessage("La pasarela de pago no está conectada. No se realizó ningún cobro.")} type="button">Pagar ahora</button>}
          </Panel>
          <Panel title="Pagos relacionados">
            {isPaid ? <div className="related-payment"><ReceiptText size={17} /><span><strong>REC-240602</strong><small>Pago completo · 02 JUN 2026</small></span><StatusBadge status="PAGADA" /></div> : <p className="muted-copy">Aún no hay pagos registrados en esta orden.</p>}
          </Panel>
          <Link className="secondary-button" to="/cliente/pagos"><ArrowLeft size={15} /> Regresar a mis pagos</Link>
        </div>
      </div>
      {message && <DemoNotice>{message}</DemoNotice>}
    </div>
  );
}
