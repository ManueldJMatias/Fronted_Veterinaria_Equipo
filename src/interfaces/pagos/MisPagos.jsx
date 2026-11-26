import { useMemo, useState } from "react";
import { CreditCard, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import { ordenes } from "../../data/demoData.js";
import { PageHeader, StatusBadge } from "../../components/InterfazUI.jsx";
import "./pagos.css";

export default function MisPagos() {
  const [filter, setFilter] = useState("TODAS");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => ordenes.filter((order) => {
    const matchesStatus = filter === "TODAS" || order.estado === filter;
    const matchesSearch = `${order.id} ${order.concepto}`.toLocaleLowerCase("es-MX").includes(search.trim().toLocaleLowerCase("es-MX"));
    return matchesStatus && matchesSearch;
  }), [filter, search]);

  return (
    <div className="interface-page">
      <PageHeader title="Mis pagos y recibos" description="Consulta el estado de tus órdenes y descarga los recibos disponibles." />
      <div className="payment-metrics">
        <article><span className="metric-icon pending"><CreditCard size={17} /></span><div><small>Pendientes</small><strong>1 orden</strong></div></article>
        <article><span className="metric-icon paid"><ReceiptText size={17} /></span><div><small>Pagadas</small><strong>8 órdenes</strong></div></article>
        <article><span className="metric-icon total">$</span><div><small>Saldo pendiente</small><strong>$850.00</strong></div></article>
      </div>
      <div className="filter-toolbar">
        <label className="filter-select">Estado<select onChange={(event) => setFilter(event.target.value)} value={filter}><option value="TODAS">Todas las órdenes</option><option>PENDIENTE</option><option>PAGADA</option><option>CANCELADA</option></select></label>
        <label className="payment-search">Buscar orden<input onChange={(event) => setSearch(event.target.value)} placeholder="Folio o concepto" type="search" value={search} /></label>
      </div>
      <section className="payment-list">
        <div className="payment-list-header"><span>Orden</span><span>Fecha</span><span>Concepto</span><span>Total</span><span>Estado</span><span /></div>
        {filtered.map((order) => (
          <Link className="payment-row" key={order.id} to={`/cliente/pagos/${order.id}`}>
            <strong>{order.id}</strong><span>{order.fecha}</span><span>{order.concepto}</span><strong>{order.total}</strong><StatusBadge status={order.estado} /><span aria-hidden="true">→</span>
          </Link>
        ))}
        {filtered.length === 0 && <p className="empty-state">No hay órdenes para este filtro.</p>}
      </section>
    </div>
  );
}
