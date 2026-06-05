import { useState, useMemo } from 'react';
import { Route, Switch, useLocation } from 'wouter';
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
  LogOut,
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import { useOrders, useCustomers, useInventory } from './hooks/useApi';
import { business } from './data.js';

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

function AppContent() {
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

  const { user, logout } = useAuth();
  const { data: ordersData, loading: ordersLoading } = useOrders();
  const { data: customersData, loading: customersLoading } = useCustomers();
  const { data: inventoryData, loading: inventoryLoading } = useInventory();

  const orders = ordersData?.orders || [];
  const customers = customersData?.customers || [];
  const inventory = inventoryData?.inventory || [];

  const filteredOrders = useMemo(() => {
    if (filter === 'All') return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

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
    dashboard: () => <Dashboard orders={orders} ordersLoading={ordersLoading} />,
    pos: POS,
    orders: () => <Orders filter={filter} setFilter={setFilter} filteredOrders={filteredOrders} />,
    quotes: () => <QuoteBuilder quote={quote} setQuote={setQuote} estimate={estimate} />,
    inventory: () => <Inventory inventory={inventory} inventoryLoading={inventoryLoading} />,
    customers: () => <Customers customers={customers} customersLoading={customersLoading} />,
    loyalty: Loyalty,
    kiosk: Kiosk,
    website: Website,
    admin: Admin
  }[active] || (() => <div>Page not found</div>);

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

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
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
            {user && <span className="user-name">{user.name}</span>}
          </div>
        </header>
        <CurrentPage />
      </main>
    </div>
  );
}

function Dashboard({ orders, ordersLoading }) {
  const openRevenue = orders.filter((order) => order.status !== 'Picked Up').reduce((sum, order) => sum + (order.total || 0), 0);
  
  if (ordersLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

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
        <Stat icon={ClipboardList} label="Open jobs" value={orders.filter(o => o.status !== 'Picked Up').length} detail="Active orders" />
        <Stat icon={BadgeDollarSign} label="Open revenue" value={currency.format(openRevenue)} detail="Active pipeline" />
        <Stat icon={PackageCheck} label="Ready pickups" value={orders.filter(o => o.status === 'Ready').length} detail="Send reminder" />
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
          <tbody>{filteredOrders.map((order) => <tr key={order.id}><td><strong>{order.order_number}</strong></td><td>{new Date(order.created_at).toLocaleDateString()}</td><td>-</td><td>-</td><td>{order.method}</td><td><span className={statusClass[order.status]}>{order.status}</span></td><td>{order.due_date ? new Date(order.due_date).toLocaleDateString() : '-'}</td><td><strong>{currency.format(order.total)}</strong></td></tr>)}</tbody>
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

function Inventory({ inventory, inventoryLoading }) {
  if (inventoryLoading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <section className="page-grid">
      <div className="stats-row">
        <Stat icon={Boxes} label="Total SKUs" value={inventory.length} detail="Starter catalog" />
        <Stat icon={BarChart3} label="Low stock" value={inventory.filter(i => i.stock <= i.reorder_level).length} detail="Needs reorder" />
        <Stat icon={Printer} label="Production supplies" value="4 rolls" detail="DTF film on hand" />
        <Stat icon={Shirt} label="Best seller" value="Black tee" detail="Business favorite" />
      </div>
      <DataTable headers={['SKU', 'Item', 'Color', 'Stock', 'Reorder', 'Best For']} rows={inventory.map((item) => [item.sku, item.item_name, item.color, item.stock, item.reorder_level, '-'])} />
    </section>
  );
}

function Customers({ customers, customersLoading }) {
  if (customersLoading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <section className="content-grid two">
      <Panel title="Customer CRM" action="Export">
        <div className="customer-list">{customers.map((customer) => <div className="customer-row" key={customer.id}><div><strong>{customer.name}</strong><span>{customer.segment} · {customer.order_count} orders</span></div><div className="right-align"><strong>{currency.format(customer.total_spent || 0)}</strong><span className="status gold">Active</span></div></div>)}</div>
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
      <div className="site-hero"><p className="eyebrow">Public website</p><h3>Creator Bar Landing</h3><p>This is where customers discover Yellow City, see services, and start orders.</p></div>
    </section>
  );
}

function Admin() {
  return (
    <section className="page-grid">
      <Panel title="Admin Settings" action="Save">
        <p>Admin features coming soon...</p>
      </Panel>
    </section>
  );
}

// Helper components
function Stat({ icon: Icon, label, value, detail }) {
  return (
    <div className="stat-card">
      <Icon size={24} />
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-detail">{detail}</p>
    </div>
  );
}

function Panel({ title, action, children }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        {action && <button className="action-link">{action}</button>}
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="order-card">
      <strong>{order.order_number}</strong>
      <span className={statusClass[order.status]}>{order.status}</span>
      <p>{order.method} · {order.quantity} units</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Field({ label, type = 'text', value, placeholder, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function Task({ icon: Icon, title, detail }) {
  return (
    <div className="task">
      <Icon size={20} />
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function Program({ title, reward, detail }) {
  return (
    <div className="program-card">
      <h4>{title}</h4>
      <p className="reward">{reward}</p>
      <p>{detail}</p>
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            {headers.map((h) => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/:rest*" component={AppContent} />
      </Switch>
    </AuthProvider>
  );
}

// Import new pages
import Analytics from './pages/Analytics';
import Checkout from './pages/Checkout';
