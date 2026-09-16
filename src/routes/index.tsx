import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart3, Building2, CalendarDays, ChevronLeft, ChevronRight, CircleHelp,
  Download, Eye, FileBarChart, LayoutDashboard, LogOut, Menu, MoreHorizontal,
  Pencil, Plus, Search, Settings2, ShieldCheck, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PATOVER | Gestión de eventos ULS" },
    { name: "description", content: "Mockup de gestión universitaria para organizaciones, eventos y reportes." },
    { property: "og:title", content: "PATOVER | Gestión de eventos ULS" },
    { property: "og:description", content: "Plataforma de gestión de eventos y actividades universitarias." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

type View = "dashboard" | "organizaciones" | "eventos" | "reportes";
type EventStatus = "Publicado" | "Configurado" | "Borrador" | "Finalizado";

const organizations = [
  { name: "Facultad de Ingeniería", initials: "FI", contact: "Camila Soto", email: "eventos.fi@userena.cl", status: "Activa", events: 8 },
  { name: "Facultad de Humanidades", initials: "FH", contact: "Diego Rojas", email: "humanidades@userena.cl", status: "Activa", events: 5 },
  { name: "Dirección de Vinculación", initials: "DV", contact: "María Paz Leiva", email: "vinculacion@userena.cl", status: "Activa", events: 12 },
  { name: "Centro de Estudiantes", initials: "CE", contact: "Tomás Vega", email: "centro.estudiantes@userena.cl", status: "Inactiva", events: 2 },
];

const events: { name: string; org: string; date: string; place: string; registered: number; capacity: number; status: EventStatus }[] = [
  { name: "Feria de Innovación ULS 2026", org: "Facultad de Ingeniería", date: "24 sep 2026", place: "Campus Ignacio Domeyko", registered: 428, capacity: 500, status: "Publicado" },
  { name: "Encuentro de Humanidades", org: "Facultad de Humanidades", date: "02 oct 2026", place: "Salón Pentágono", registered: 186, capacity: 240, status: "Configurado" },
  { name: "Seminario Vinculación Regional", org: "Dirección de Vinculación", date: "18 oct 2026", place: "Aula Magna", registered: 94, capacity: 300, status: "Borrador" },
  { name: "Congreso de Investigación 2026", org: "Vicerrectoría de Investigación", date: "30 ago 2026", place: "Campus Andrés Bello", registered: 310, capacity: 350, status: "Finalizado" },
];

function Index() {
  const [signedIn, setSignedIn] = useState(false);
  const [recover, setRecover] = useState(false);
  if (!signedIn) return <Login recover={recover} setRecover={setRecover} onLogin={() => setSignedIn(true)} />;
  return <Workspace onLogout={() => setSignedIn(false)} />;
}

function Login({ recover, setRecover, onLogin }: { recover: boolean; setRecover: (value: boolean) => void; onLogin: () => void }) {
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    if (recover) { setSent(true); return; }
    if (!form.get("email") || !form.get("password")) { setError(true); return; }
    onLogin();
  };
  return (
    <main className="login-shell">
      <section className="login-brand">
        <BrandMark large />
        <div><p className="brand-kicker">Universidad de La Serena</p><h1>Gestión universitaria, en un solo lugar.</h1><p>Organiza eventos, coordina equipos y toma decisiones con información confiable.</p></div>
        <p className="login-foot">Plataforma institucional · Acceso seguro</p>
      </section>
      <section className="login-panel">
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-icon"><ShieldCheck /></div>
          <p className="eyebrow">PATOVER</p>
          <h2>{recover ? "Recuperar acceso" : "Bienvenido de vuelta"}</h2>
          <p className="supporting">{recover ? "Ingresa tu correo institucional y te enviaremos las instrucciones." : "Ingresa tus credenciales institucionales para continuar."}</p>
          {sent ? <div className="success-panel"><ShieldCheck /><strong>Revisa tu correo</strong><span>Enviamos las instrucciones de recuperación.</span></div> : <>
            <label>Correo institucional<Input name="email" type="email" placeholder="nombre@userena.cl" onChange={() => setError(false)} /></label>
            {!recover && <label>Contraseña<Input name="password" type="password" placeholder="••••••••" onChange={() => setError(false)} /></label>}
            {error && <p className="form-error">Completa ambos campos para iniciar sesión.</p>}
            {!recover && <p className="privacy"><ShieldCheck /> Demo: usa cualquier correo y contraseña, por ejemplo demo@userena.cl / demo1234</p>}
            <Button className="w-full" size="lg" type="submit">{recover ? "Enviar instrucciones" : "Iniciar sesión"}</Button>
          </>}
          <Button type="button" variant="link" onClick={() => { setRecover(!recover); setSent(false); }}>{recover ? "Volver al inicio de sesión" : "¿Olvidaste tu contraseña?"}</Button>
          <p className="privacy"><ShieldCheck /> Tus datos están protegidos por las políticas institucionales.</p>
        </form>
      </section>
    </main>
  );
}

function BrandMark({ large = false }: { large?: boolean }) {
  return <div className={`brand-mark ${large ? "brand-mark-large" : ""}`}><span>P</span><strong>PATOVER</strong></div>;
}

function Workspace({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");
  const titles: Record<View, string> = { dashboard: "Resumen general", organizaciones: "Organizaciones", eventos: "Eventos", reportes: "Reportes e indicadores" };
  const navigate = (next: View) => { setView(next); setMobileNav(false); };
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2600); };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="sidebar-top"><BrandMark /><Button variant="ghost" size="icon" className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Cerrar menú"><X /></Button></div>
        <nav aria-label="Módulos principales">
          <NavItem icon={<LayoutDashboard />} label="Resumen" active={view === "dashboard"} onClick={() => navigate("dashboard")} />
          <p className="nav-label">Administración</p>
          <NavItem icon={<Building2 />} label="Organizaciones" active={view === "organizaciones"} onClick={() => navigate("organizaciones")} />
          <NavItem icon={<CalendarDays />} label="Eventos" active={view === "eventos"} onClick={() => navigate("eventos")} />
          <p className="nav-label">Análisis</p>
          <NavItem icon={<FileBarChart />} label="Reportes" active={view === "reportes"} onClick={() => navigate("reportes")} />
        </nav>
        <div className="sidebar-bottom"><NavItem icon={<CircleHelp />} label="Ayuda" /><NavItem icon={<LogOut />} label="Cerrar sesión" onClick={onLogout} /></div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title"><Button variant="ghost" size="icon" className="menu-button" onClick={() => setMobileNav(true)} aria-label="Abrir menú"><Menu /></Button><div><p>PATOVER / {titles[view]}</p><h1>{titles[view]}</h1></div></div>
          <div className="user-area"><Button variant="ghost" size="icon" aria-label="Configuración"><Settings2 /></Button><div className="avatar">FC</div><div className="user-copy"><strong>Flavio Cortés</strong><span>Administrador global</span></div></div>
        </header>
        <main className="workspace">
          {view === "dashboard" && <Dashboard navigate={navigate} />}
          {view === "organizaciones" && <Organizations notify={notify} />}
          {view === "eventos" && <Events notify={notify} />}
          {view === "reportes" && <Reports notify={notify} />}
        </main>
      </div>
      {notice && <div className="toast"><ShieldCheck />{notice}</div>}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return <Button variant="ghost" className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span></Button>;
}

function Dashboard({ navigate }: { navigate: (view: View) => void }) {
  return <div className="page-stack">
    <div className="page-intro"><div><p className="eyebrow">Martes, 15 de septiembre</p><h2>Buenas tardes, Flavio</h2><p>Revisa la actividad reciente y los próximos hitos de la plataforma.</p></div><Button onClick={() => navigate("eventos")}><Plus /> Nuevo evento</Button></div>
    <div className="metric-grid">
      <Metric label="Eventos activos" value="12" note="3 este mes" icon={<CalendarDays />} />
      <Metric label="Inscripciones" value="1.284" note="+18% este mes" icon={<Users />} />
      <Metric label="Organizaciones" value="8" note="7 activas" icon={<Building2 />} />
      <Metric label="Asistencia media" value="78%" note="Últimos 30 días" icon={<BarChart3 />} />
    </div>
    <div className="dashboard-grid">
      <section className="panel"><div className="section-title"><div><p className="eyebrow">Próximamente</p><h3>Eventos en agenda</h3></div><Button variant="ghost" onClick={() => navigate("eventos")}>Ver todos <ChevronRight /></Button></div>{events.slice(0,3).map(event => <EventRow key={event.name} event={event} />)}</section>
      <section className="panel"><div className="section-title"><div><p className="eyebrow">Actividad</p><h3>Inscripciones esta semana</h3></div></div><div className="mini-chart">{[35,48,44,68,58,82,74].map((h,i) => <div key={i}><span style={{ height: `${h}%` }} /><small>{["L","M","M","J","V","S","D"][i]}</small></div>)}</div><div className="chart-summary"><strong>326</strong><span>nuevas inscripciones</span></div></section>
    </div>
  </div>;
}

function Metric({ label, value, note, icon }: { label: string; value: string; note: string; icon: React.ReactNode }) {
  return <article className="metric"><div className="metric-head"><span>{label}</span><div className="metric-icon">{icon}</div></div><strong>{value}</strong><p>{note}</p></article>;
}

function Organizations({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState(""); const [editor, setEditor] = useState(false); const [selected, setSelected] = useState(0);
  const filtered = organizations.filter(o => o.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-stack">
    <div className="page-intro"><div><p className="eyebrow">MC-03</p><h2>Administración de organizaciones</h2><p>Gestiona las unidades organizadoras y sus responsables.</p></div><Button onClick={() => setEditor(true)}><Plus /> Nueva organización</Button></div>
    <section className="panel table-panel"><div className="toolbar"><div className="search-field"><Search /><Input aria-label="Buscar organizaciones" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre o sigla" /></div><span className="result-count">{filtered.length} organizaciones</span></div>
      <div className="table-wrap"><table><thead><tr><th>Organización</th><th>Responsable</th><th>Estado</th><th>Eventos</th><th></th></tr></thead><tbody>{filtered.map((org, index) => <tr key={org.initials} className={selected === index ? "selected-row" : ""} onClick={() => setSelected(index)}><td><div className="org-cell"><span className="org-avatar">{org.initials}</span><div><strong>{org.name}</strong><small>{org.initials}</small></div></div></td><td><strong>{org.contact}</strong><small>{org.email}</small></td><td><Status status={org.status} /></td><td>{org.events}</td><td><Button variant="ghost" size="icon" aria-label={`Acciones para ${org.name}`}><MoreHorizontal /></Button></td></tr>)}</tbody></table></div>
      <div className="table-footer"><span>Mostrando {filtered.length} de {organizations.length}</span><div><Button variant="outline" size="icon" disabled><ChevronLeft /></Button><Button variant="outline" size="icon"><ChevronRight /></Button></div></div>
    </section>
    <section className="detail-strip"><div className="org-avatar large">{organizations[selected]?.initials}</div><div><p className="eyebrow">Organización seleccionada</p><h3>{organizations[selected]?.name}</h3><p>{organizations[selected]?.contact} · {organizations[selected]?.events} eventos vinculados</p></div><div className="detail-actions"><Button variant="outline" onClick={() => setEditor(true)}><Pencil /> Editar</Button><Button onClick={() => notify("Usuarios asociados actualizados")}>Asociar usuarios</Button></div></section>
    {editor && <Modal title="Datos de la organización" onClose={() => setEditor(false)} onSave={() => { setEditor(false); notify("Organización guardada correctamente"); }}><div className="form-grid"><label>Nombre<Input defaultValue={organizations[selected]?.name} /></label><label>Sigla<Input defaultValue={organizations[selected]?.initials} /></label><label>Responsable<Input defaultValue={organizations[selected]?.contact} /></label><label>Correo institucional<Input type="email" defaultValue={organizations[selected]?.email} /></label><label className="span-2">Descripción<textarea defaultValue="Unidad organizadora de actividades y eventos institucionales." /></label></div></Modal>}
  </div>;
}

function Events({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("Todos"); const [wizard, setWizard] = useState(false); const [step, setStep] = useState(1);
  const filtered = events.filter(event => event.name.toLowerCase().includes(query.toLowerCase()) && (status === "Todos" || event.status === status));
  return <div className="page-stack">
    <div className="page-intro"><div><p className="eyebrow">MC-04</p><h2>Gestión de eventos</h2><p>Administra el ciclo de vida, configuración y publicación.</p></div><Button onClick={() => { setStep(1); setWizard(true); }}><Plus /> Crear evento</Button></div>
    <div className="summary-band"><div><strong>18</strong><span>Total</span></div><div><strong>8</strong><span>Publicados</span></div><div><strong>4</strong><span>En configuración</span></div><div><strong>3</strong><span>Borradores</span></div></div>
    <section className="panel table-panel"><div className="toolbar"><div className="search-field"><Search /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar eventos" /></div><select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filtrar por estado"><option>Todos</option><option>Publicado</option><option>Configurado</option><option>Borrador</option><option>Finalizado</option></select></div>
      <div className="event-list">{filtered.map(event => <EventCard key={event.name} event={event} notify={notify} />)}</div></section>
    {wizard && <Modal wide title="Crear nuevo evento" onClose={() => setWizard(false)} onSave={() => step < 3 ? setStep(step + 1) : (setWizard(false), notify("Evento creado como borrador"))} saveLabel={step < 3 ? "Continuar" : "Crear evento"}>
      <div className="steps">{["Información", "Configuración", "Revisión"].map((label,i) => <div className={step >= i+1 ? "step active" : "step"} key={label}><span>{i+1}</span><small>{label}</small></div>)}</div>
      {step === 1 && <div className="form-grid"><label className="span-2">Nombre del evento<Input placeholder="Ej. Feria de Innovación 2026" /></label><label>Organización<select><option>Facultad de Ingeniería</option><option>Dirección de Vinculación</option></select></label><label>Código<Input placeholder="EVT-2026-001" /></label><label>Fecha de inicio<Input type="date" /></label><label>Fecha de término<Input type="date" /></label><label className="span-2">Descripción<textarea placeholder="Describe el propósito del evento" /></label></div>}
      {step === 2 && <div className="option-list"><ToggleOption title="Inscripción habilitada" text="Permite que participantes se inscriban al evento." active /><ToggleOption title="Acreditación de participantes" text="Activa el proceso de acreditación presencial." active /><ToggleOption title="Registro de asistencia" text="Registra asistencia general y por actividad." /><ToggleOption title="Visibilidad pública" text="Publica la información general en el portal." active /></div>}
      {step === 3 && <div className="review-box"><ShieldCheck /><h3>Todo listo para comenzar</h3><p>El evento se guardará en estado borrador. Podrás completar su configuración y publicarlo después.</p><dl><div><dt>Organización</dt><dd>Facultad de Ingeniería</dd></div><div><dt>Estado inicial</dt><dd>Borrador</dd></div></dl></div>}
      {step > 1 && <Button variant="ghost" onClick={() => setStep(step-1)}><ChevronLeft /> Volver</Button>}
    </Modal>}
  </div>;
}

function EventCard({ event, notify }: { event: typeof events[number]; notify: (message: string) => void }) {
  return <article className="event-card"><div className="event-date"><strong>{event.date.split(" ")[0]}</strong><span>{event.date.split(" ")[1]}</span></div><div className="event-main"><div><Status status={event.status} /><h3>{event.name}</h3><p>{event.org} · {event.place}</p></div><div className="capacity"><div><span>Inscritos</span><strong>{event.registered} / {event.capacity}</strong></div><div className="progress"><span style={{ width: `${event.registered/event.capacity*100}%` }} /></div></div></div><div className="event-actions"><Button variant="outline" size="icon" aria-label={`Ver ${event.name}`} onClick={() => notify(`Vista previa: ${event.name}`)}><Eye /></Button><Button variant="outline" size="icon" aria-label={`Editar ${event.name}`} onClick={() => notify("Edición habilitada para el evento")}><Pencil /></Button></div></article>;
}

function Reports({ notify }: { notify: (message: string) => void }) {
  const [period, setPeriod] = useState("Este mes");
  const [event, setEvent] = useState("Todos los eventos");
  const factor = period === "Este mes" ? 1 : period === "Últimos 3 meses" ? 2.4 : 4.8;
  const values = useMemo(() => [42,68,51,82,73,91,78].map(v => Math.min(98, v * (event === "Todos los eventos" ? 1 : .82))), [event]);
  return <div className="page-stack">
    <div className="page-intro"><div><p className="eyebrow">MC-10</p><h2>Reportes e indicadores</h2><p>Analiza resultados dentro de tu ámbito autorizado.</p></div><Button onClick={() => notify("Reporte exportado correctamente")}><Download /> Exportar reporte</Button></div>
    <section className="filters"><label>Período<select value={period} onChange={e => setPeriod(e.target.value)}><option>Este mes</option><option>Últimos 3 meses</option><option>Este año</option></select></label><label>Evento<select value={event} onChange={e => setEvent(e.target.value)}><option>Todos los eventos</option>{events.map(e => <option key={e.name}>{e.name}</option>)}</select></label><Button variant="outline"><Settings2 /> Más filtros</Button><span>Actualizado hace 5 min</span></section>
    <div className="metric-grid report-metrics"><Metric label="Inscripciones" value={Math.round(1284*factor).toLocaleString("es-CL")} note="+18% vs período anterior" icon={<Users />} /><Metric label="Acreditados" value={Math.round(962*factor).toLocaleString("es-CL")} note="74,9% de inscritos" icon={<ShieldCheck />} /><Metric label="Asistencias" value={Math.round(874*factor).toLocaleString("es-CL")} note="90,8% de acreditados" icon={<CalendarDays />} /><Metric label="Eventos realizados" value={String(Math.round(6*factor))} note="2 próximos" icon={<FileBarChart />} /></div>
    <div className="report-grid"><section className="panel"><div className="section-title"><div><p className="eyebrow">Tendencia semanal</p><h3>Inscripciones y asistencia</h3></div><span className="legend"><i /> Inscripciones <i /> Asistencia</span></div><div className="large-chart">{values.map((v,i) => <div key={i}><div className="bars"><span style={{height:`${v}%`}}/><span style={{height:`${v*.76}%`}}/></div><small>Sem {i+1}</small></div>)}</div></section><section className="panel"><div className="section-title"><div><p className="eyebrow">Conversión</p><h3>Embudo de participación</h3></div></div><div className="funnel"><div><strong>1.284</strong><span>Inscritos</span></div><div><strong>962</strong><span>Acreditados</span></div><div><strong>874</strong><span>Asistentes</span></div></div><p className="formula">Indicador calculado sobre registros válidos y activos.</p></section></div>
    <section className="panel table-panel"><div className="section-title"><div><p className="eyebrow">Desglose</p><h3>Rendimiento por evento</h3></div></div><div className="table-wrap"><table><thead><tr><th>Evento</th><th>Inscritos</th><th>Acreditados</th><th>Asistencia</th><th>Ocupación</th></tr></thead><tbody>{events.map(e => <tr key={e.name}><td><strong>{e.name}</strong><small>{e.org}</small></td><td>{e.registered}</td><td>{Math.round(e.registered*.78)}</td><td>{Math.round(e.registered*.68)}</td><td><div className="progress compact"><span style={{width:`${e.registered/e.capacity*100}%`}}/></div>{Math.round(e.registered/e.capacity*100)}%</td></tr>)}</tbody></table></div></section>
  </div>;
}

function ToggleOption({ title, text, active = false }: { title: string; text: string; active?: boolean }) { const [on,setOn] = useState(active); return <div className="toggle-option"><div><strong>{title}</strong><p>{text}</p></div><Button variant="ghost" className={`switch ${on ? "on" : ""}`} onClick={() => setOn(!on)} aria-label={`${on ? "Desactivar" : "Activar"} ${title}`}><span /></Button></div>; }
function Status({ status }: { status: string }) { return <span className={`status status-${status.toLowerCase()}`}>{status}</span>; }
function EventRow({ event }: { event: typeof events[number] }) { return <div className="event-row"><div className="event-date small"><strong>{event.date.split(" ")[0]}</strong><span>{event.date.split(" ")[1]}</span></div><div><strong>{event.name}</strong><span>{event.org}</span></div><Status status={event.status} /></div>; }
function Modal({ title, children, onClose, onSave, saveLabel="Guardar cambios", wide=false }: { title:string; children:React.ReactNode; onClose:()=>void; onSave:()=>void; saveLabel?:string; wide?:boolean }) { return <div className="modal-backdrop" role="presentation" onMouseDown={e => { if(e.currentTarget === e.target) onClose(); }}><section className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true"><header><div><p className="eyebrow">PATOVER</p><h2>{title}</h2></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar"><X /></Button></header><div className="modal-body">{children}</div><footer><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={onSave}>{saveLabel}<ChevronRight /></Button></footer></section></div>; }