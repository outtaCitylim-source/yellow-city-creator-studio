import { useMemo, useState } from 'react';
import {
  BadgeDollarSign,
  BarChart3,
  Boxes,
  Brush,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileImage,
  Gift,
  Globe2,
  ImagePlus,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  PackageCheck,
  Printer,
  QrCode,
  Search,
  Settings,
  Shirt,
  Sparkles,
  Store,
  Users,
  Wand2,
  X
} from 'lucide-react';
import { business, customers, inventory, orders, services } from './data.js';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'POS', icon: CreditCard },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'quotes', label: 'Quote Builder', icon: BadgeDollarSign },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'loyalty', label: 'Loyalty', icon: Gift },
  { id: 'kiosk', label: 'Kiosk Mode', icon: QrCode },
  { id: 'website', label: 'Website', icon: Globe2 },
  { id: 'admin', label: 'Admin', icon: Settings }
];

const statusClass = {
  New: 'status blue',
  'Proof Sent': 'status violet',
  'In Production': 'status amber',
  'Quality Check': 'status purple',
  Ready: 'status green',
  'Picked Up': 'status gray'
};

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [quote, setQuote] = useState({
    customer: '',
    contact: '',
    garment: 'Bella+Canvas 3001 Premium Tee',
    method: 'DTF',
    quantity: 24,
    deadline: 'Standard 5-7 business days',
    artwork: 'Customer has print-ready art',
    placement: 'Left chest + full back'
  });

  const filteredOrders = useMemo(() => {
    if (filter === 'All') return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter]);

  const estimate = useMemo(() => {
    const base = { DTG: 18, DTF: 16, Embroidery: 24, 'Screen Print': 13, Vinyl: 17 }[quote.method] || 16;
    const quantity = Number(quote.quantity) || 0;
    const rush = quote.deadline.includes('Rush') ? 75 : 0;
    const design = quote.artwork.includes('Need') ? 45 : 0;
    const placement = quote.placement.includes('+') ? 4 : 0;
    const discount = quantity >= 72 ? 0.82 : quantity >= 36 ? 0.9 : 1;
    return Math.round(((base + placement) * quantity * discount + rush + design) * 100) / 100;
  }, [quote]);

  const CurrentPage = {
    dashboard: Dashboard,
    pos: POS,
    orders: () => <Orders filter={filter} setFilter={setFilter} filteredOrders={filteredOrders} />,
    quotes: () => <QuoteBuilder quote={quote} setQuote={setQuote} estimate={estimate} />,
    inventory: Inventory,
    customers: Customers,
    loyalty: Loyalty,
    kiosk: Kiosk,
    website: Website,
    admin: Admin
  }[active];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        <div className="brand-block">
          <div className="brand-mark">YC</div>
          <div>
            <p className="eyebrow">Amarillo print ops</p>
            <h1>{business.name}</h1>
          </div>
        </div>

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={active === item.id ? 'nav-item active' : 'nav-item'}
                onClick={() => { setActive(item.id); setMenuOpen(false); }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <Sparkles size={18} />
          <strong>{business.tagline}</strong>
          <p>{business.address}</p>
          <p>{business.phone}</p>
        </div>
      </aside>

      {menuOpen && <button className="screen" onClick={() => setMenuOpen(false)} aria-label="Close sidebar" />}

      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          <div>
            <p className="eyebrow">Live shop command center</p>
            <h2>{navItems.find((item) => item.id === active)?.label}</h2>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} />
              <input placeholder="Search orders, customers, artwork..." />
            </label>
            <button className="gold-button">New Order</button>
          </div>
        </header>
        <CurrentPage />
      </main>
    </div>
  );
}

function Dashboard() {
  const openRevenue = orders.filter((order) => order.status !== 'Picked Up').reduce((sum, order) => sum + order.total, 0);
  return (
    <section className="page-grid">
      <div className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Built for {business.name}</p>
          <h3>One clean system for quotes, walk-ins, print jobs, approvals, and pickups.</h3>
          <p>Creator Studio turns the shop into a tighter operation: public quote intake, in-store kiosk flow, production tracking, loyalty, inventory, and customer reorder tools.</p>
          <div className="hero-actions">
            <button className="gold-button"><Wand2 size={18} /> Build Quote</button>
            <button className="ghost-button"><QrCode size={18} /> Launch Kiosk</button>
          </div>
        </div>
        <div className="hero-preview">
          <div className="shirt-card">
            <Shirt size={92} />
            <span>DTF · DTG · Embroidery · Vinyl · Banners</span>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <Stat icon={ClipboardList} label="Open jobs" value="5" detail="2 need action" />
        <Stat icon={BadgeDollarSign} label="Open revenue" value={currency.format(openRevenue)} detail="Active pipeline" />
        <Stat icon={PackageCheck} label="Ready pickups" value="1" detail="Send reminder" />
        <Stat icon={Printer} label="Print methods" value="5" detail="Built into quotes" />
      </div>

      <div className="content-grid two">
        <Panel title="Production board" action="View all">
          <div className="kanban-row">
            {['New', 'Proof Sent', 'In Production', 'Quality Check', 'Ready'].map((status) => (
              <div className="mini-column" key={status}>
                <span className={statusClass[status]}>{status}</span>
                <strong>{orders.filter((order) => order.status === status).length}</strong>
              </div>
            ))}
          </div>
          <div className="order-stack">
            {orders.slice(0, 4).map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        </Panel>

        <Panel title="Shop profile" action="Edit">
          <Info label="Owner" value={business.owner} />
          <Info label="Creator & Head Designer" value={business.creator} />
          <Info label="Phone" value={business.phone} />
          <Info label="Address" value={business.address} />
          <Info label="Website" value={business.website} />
        </Panel>
      </div>
    </section>
  );
}

function POS() {
  const cart = [['Custom tee deposit', 75], ['DTF transfer sheet', 24], ['Rush fee', 35]];
  return (
    <section className="content-grid two">
      <Panel title="Quick sale terminal" action="Hold ticket">
        <div className="pos-grid">
          {['Custom Tee', 'Deposit', 'DTF Sheet', 'Blank Shirt', 'Banner', 'Rush Fee', 'Design Time', 'Pickup Balance'].map((label) => <button className="pos-tile" key={label}>{label}</button>)}
        </div>
      </Panel>
      <Panel title="Current ticket" action="Customer">
        <div className="receipt">
          {cart.map(([label, price]) => <div className="receipt-line" key={label}><span>{label}</span><strong>{currency.format(price)}</strong></div>)}
          <div className="receipt-total"><span>Total</span><strong>{currency.format(cart.reduce((sum, item) => sum + item[1], 0))}</strong></div>
          <button className="gold-button full"><CreditCard size={18} /> Checkout</button>
        </div>
      </Panel>
    </section>
  );
}

function Orders({ filter, setFilter, filteredOrders }) {
  const filters = ['All', 'New', 'Proof Sent', 'In Production', 'Quality Check', 'Ready', 'Picked Up'];
  return (
    <section className="page-grid">
      <div className="toolbar-card">
        <div><p className="eyebrow">Production workflow</p><h3>Orders</h3></div>
        <div className="filter-pills">{filters.map((item) => <button key={item} className={filter === item ? 'pill active' : 'pill'} onClick={() => setFilter(item)}>{item}</button>)}</div>
      </div>
      <div className="table-card">
        <table>
          <thead><tr><th>Order #</th><th>Date</th><th>Customer</th><th>Type</th><th>Method</th><th>Status</th><th>Due</th><th>Total</th></tr></thead>
          <tbody>{filteredOrders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.date}</td><td>{order.customer}</td><td>{order.type}</td><td>{order.method}</td><td><span className={statusClass[order.status]}>{order.status}</span></td><td>{order.due}</td><td><strong>{currency.format(order.total)}</strong></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function QuoteBuilder({ quote, setQuote, estimate }) {
  const update = (field, value) => setQuote((current) => ({ ...current, [field]: value }));
  return (
    <section className="content-grid quote-layout">
      <Panel title="Customer quote builder" action="Save quote">
        <div className="form-grid">
          <Field label="Customer / Organization" value={quote.customer} placeholder="Business, team, school, walk-in..." onChange={(value) => update('customer', value)} />
          <Field label="Phone / Email" value={quote.contact} placeholder="Best contact" onChange={(value) => update('contact', value)} />
          <Select label="Garment" value={quote.garment} onChange={(value) => update('garment', value)} options={['Bella+Canvas 3001 Premium Tee', 'Gildan Heavy Cotton Tee', 'Comfort Colors Garment Dyed Tee', 'Hoodie / Crewneck', 'Polo / Workwear']} />
          <Select label="Print method" value={quote.method} onChange={(value) => update('method', value)} options={['DTF', 'DTG', 'Embroidery', 'Screen Print', 'Vinyl']} />
          <Field label="Quantity" type="number" value={quote.quantity} onChange={(value) => update('quantity', value)} />
          <Select label="Deadline" value={quote.deadline} onChange={(value) => update('deadline', value)} options={['Standard 5-7 business days', 'Rush 24-48 hours', 'Event date locked', 'Flexible']} />
          <Select label="Artwork" value={quote.artwork} onChange={(value) => update('artwork', value)} options={['Customer has print-ready art', 'Need design cleanup', 'Need full design help', 'Artwork already on file']} />
          <Select label="Placement" value={quote.placement} onChange={(value) => update('placement', value)} options={['Full front', 'Left chest + full back', 'Pocket print', 'Sleeve print', 'Hat / patch location']} />
        </div>
      </Panel>
      <div className="estimate-card">
        <p className="eyebrow">Estimated total</p>
        <strong>{currency.format(estimate)}</strong>
        <p>Estimate adjusts for quantity, print method, rush timing, art help, and placement.</p>
        <div className="upload-box"><ImagePlus /><span>Artwork upload zone</span><small>Logo, PNG, SVG, AI, PDF, or customer mockup</small></div>
        <button className="gold-button full"><CheckCircle2 size={18} /> Send Quote Request</button>
      </div>
    </section>
  );
}

function Inventory() {
  return (
    <section className="page-grid">
      <div className="stats-row">
        <Stat icon={Boxes} label="Total SKUs" value={inventory.length} detail="Starter catalog" />
        <Stat icon={BarChart3} label="Low stock" value="2" detail="Needs reorder" />
        <Stat icon={Printer} label="Production supplies" value="4 rolls" detail="DTF film on hand" />
        <Stat icon={Shirt} label="Best seller" value="Black tee" detail="Business favorite" />
      </div>
      <DataTable headers={['SKU', 'Item', 'Color', 'Stock', 'Reorder', 'Best For']} rows={inventory.map((item) => [item.sku, item.item, item.color, item.stock, item.reorder, item.bestFor])} />
    </section>
  );
}

function Customers() {
  return (
    <section className="content-grid two">
      <Panel title="Customer CRM" action="Export">
        <div className="customer-list">{customers.map((customer) => <div className="customer-row" key={customer.name}><div><strong>{customer.name}</strong><span>{customer.segment} · {customer.orders} orders</span></div><div className="right-align"><strong>{currency.format(customer.value)}</strong><span className="status gold">{customer.status}</span></div></div>)}</div>
      </Panel>
      <Panel title="Reorder opportunities" action="Create campaign">
        <Task icon={Store} title="Business uniform reorder" detail="Send saved-design reorder links to local business accounts." />
        <Task icon={CalendarClock} title="Graduation season" detail="Launch senior shirt and banner promo." />
        <Task icon={MessageSquareText} title="Pickup reminders" detail="Text customers when orders move to Ready." />
      </Panel>
    </section>
  );
}

function Loyalty() {
  return (
    <section className="content-grid three">
      <Program title="Business Builder" reward="5% back" detail="For repeat businesses, contractors, schools, and churches." />
      <Program title="Team Captain" reward="Free setup" detail="For coaches and organizers who bring team orders." />
      <Program title="Creator Club" reward="Priority proofing" detail="For local brands and merch creators." />
    </section>
  );
}

function Kiosk() {
  return (
    <section className="kiosk-page">
      <div className="kiosk-card">
        <div className="kiosk-logo"><QrCode size={54} /></div>
        <p className="eyebrow">Walk-in intake mode</p>
        <h3>Start your custom order</h3>
        <p>Customers can choose what they need, upload art, enter contact info, and land directly in the quote inbox.</p>
        <div className="kiosk-options">{['Custom Shirts', 'Business Uniforms', 'Team Apparel', 'Graduation', 'DTF Transfers', 'Design Help'].map((item) => <button key={item}>{item}<ChevronRight size={18} /></button>)}</div>
      </div>
    </section>
  );
}

function Website() {
  return (
    <section className="website-preview">
      <div className="site-hero"><p className="eyebrow">Public website preview</p><h3>Amarillo custom printing that makes ordering simple.</h3><p>{business.name} at {business.address}. Call {business.phone} or visit {business.website}.</p><button className="gold-button"><Globe2 size={18} /> Request a Quote</button></div>
      <div className="service-grid">{services.map((service) => <div className="service-card" key={service}><Brush /><strong>{service}</strong><span>Quote-ready service page</span></div>)}</div>
    </section>
  );
}

function Admin() {
  return (
    <section className="content-grid two">
      <Panel title="Shop settings" action="Manage">
        <Info label="Business" value={business.name} />
        <Info label="Owner" value={business.owner} />
        <Info label={business.creatorTitle} value={business.creator} />
        <Info label="Default turnaround" value="5-7 business days" />
        <Info label="Proof approval required" value="Enabled" />
      </Panel>
      <Panel title="Next integrations" action="Roadmap">
        <Task icon={MessageSquareText} title="SMS updates" detail="Text quote links, proof approvals, and pickup reminders." />
        <Task icon={FileImage} title="Artwork storage" detail="Store uploaded logos and design files by customer account." />
        <Task icon={BarChart3} title="Revenue analytics" detail="Track services, margins, and repeat customers." />
      </Panel>
    </section>
  );
}

function Stat({ icon: Icon, label, value, detail }) {
  return <div className="stat-card"><Icon size={22} /><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function Panel({ title, action, children }) {
  return <div className="panel"><div className="panel-header"><h3>{title}</h3>{action && <button>{action}</button>}</div>{children}</div>;
}

function OrderCard({ order }) {
  return <div className="order-card"><div><strong>{order.id}</strong><span>{order.customer} · {order.quantity} pcs · {order.method}</span></div><span className={statusClass[order.status]}>{order.status}</span></div>;
}

function Task({ icon: Icon, title, detail }) {
  return <div className="task-row"><div className="task-icon"><Icon size={19} /></div><div><strong>{title}</strong><span>{detail}</span></div></div>;
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Select({ label, value, onChange, options }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function Program({ title, reward, detail }) {
  return <div className="program-card"><Gift /><p className="eyebrow">Loyalty program</p><h3>{title}</h3><strong>{reward}</strong><p>{detail}</p></div>;
}

function Info({ label, value }) {
  return <div className="setting-row"><span>{label}</span><strong>{value}</strong></div>;
}

function DataTable({ headers, rows }) {
  return <div className="table-card"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={`${index}-${cellIndex}`}>{cellIndex === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}</tbody></table></div>;
}
