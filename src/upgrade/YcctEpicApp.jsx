import { useMemo, useState } from 'react';
import { BarChart3, CalendarClock, CheckCircle2, ClipboardList, CreditCard, FileText, Gift, Megaphone, PackageCheck, QrCode, Shirt, Sparkles, Store, Truck, Users } from 'lucide-react';
import { business, catalog, customers, inventory, orders, techniques } from '../data.js';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const intakeDefaults = {
  name: '',
  contact: '',
  projectType: 'Custom shirts',
  quantity: 24,
  deadline: 'Standard 5-7 business days',
  artwork: 'I have print-ready artwork',
  notes: ''
};

const stageList = ['New', 'Proof Sent', 'In Production', 'Quality Check', 'Ready', 'Picked Up'];

export default function YcctEpicApp() {
  const [active, setActive] = useState('command');
  const [intake, setIntake] = useState(intakeDefaults);
  const [submissions, setSubmissions] = useState([]);

  const activeRevenue = orders.filter((order) => order.status !== 'Picked Up').reduce((sum, order) => sum + order.total, 0);
  const readyPickups = orders.filter((order) => order.status === 'Ready').length;
  const lowStock = inventory.filter((item) => item.stock <= item.reorder);
  const repeatValue = customers.filter((customer) => customer.orders > 1).reduce((sum, customer) => sum + customer.value, 0);

  const estimate = useMemo(() => {
    const baseByType = {
      'Custom shirts': 18,
      'Business uniforms': 26,
      'Team store': 22,
      'Route 66 / event merch': 20,
      'Graduation package': 24,
      'Banners and signs': 45
    };

    const quantity = Number(intake.quantity) || 0;
    const base = baseByType[intake.projectType] || 18;
    const rush = intake.deadline.includes('Rush') ? 85 : 0;
    const design = intake.artwork.includes('design help') ? 65 : 0;
    const volume = quantity >= 100 ? 0.78 : quantity >= 72 ? 0.84 : quantity >= 36 ? 0.9 : 1;

    return Math.round((base * quantity * volume + rush + design) * 100) / 100;
  }, [intake]);

  const submitIntake = (event) => {
    event.preventDefault();

    const record = {
      ...intake,
      id: `YCCT-LEAD-${String(submissions.length + 1).padStart(3, '0')}`,
      estimate,
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    setSubmissions((current) => [record, ...current]);
    setIntake(intakeDefaults);
    setActive('queue');
  };

  const pages = {
    command: <CommandCenter activeRevenue={activeRevenue} readyPickups={readyPickups} lowStock={lowStock} repeatValue={repeatValue} />,
    intake: <QuoteIntake intake={intake} setIntake={setIntake} submitIntake={submitIntake} estimate={estimate} />,
    queue: <IntakeQueue submissions={submissions} />,
    production: <ProductionBoard />,
    growth: <GrowthEngine />,
    inventory: <InventoryOps lowStock={lowStock} />,
    proof: <ProofPack />
  };

  return (
    <div className="ycct-epic-shell">
      <aside className="ycct-epic-sidebar">
        <div className="ycct-epic-brand">
          <div className="brand-mark">YC</div>
          <div>
            <p className="eyebrow">Yellow City operating system</p>
            <strong>{business.name}</strong>
          </div>
        </div>

        {[
          ['command', 'Command Center', BarChart3],
          ['intake', 'Quote Intake', FileText],
          ['queue', 'Lead Queue', ClipboardList],
          ['production', 'Production Board', PackageCheck],
          ['growth', 'Growth Engines', Megaphone],
          ['inventory', 'Inventory Ops', Store],
          ['proof', 'Proof Pack', CheckCircle2]
        ].map(([id, label, Icon]) => (
          <button key={id} className={active === id ? 'nav-item active' : 'nav-item'} onClick={() => setActive(id)} type="button">
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </aside>

      <main className="ycct-epic-main">
        <header className="ycct-epic-header">
          <div>
            <p className="eyebrow">Built for Ashton Hammer and Dillon Richards</p>
            <h1>{active === 'command' ? 'Shop Command Center' : 'Yellow City Creator Studio'}</h1>
          </div>
          <button className="gold-button" type="button" onClick={() => setActive('intake')}>
            <QrCode size={18} /> Start Order
          </button>
        </header>

        {pages[active]}
      </main>
    </div>
  );
}

function CommandCenter({ activeRevenue, readyPickups, lowStock, repeatValue }) {
  return (
    <section className="page-grid">
      <div className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">One system. Every order. Every customer.</p>
          <h3>A print-shop command center for quote intake, production, pickup, events, team stores, and repeat business.</h3>
          <p>This upgrade turns Yellow City from a normal print shop into a measurable sales machine: QR intake, customer history, production visibility, low-stock control, and owner-level reporting.</p>
        </div>
        <div className="hero-preview">
          <div className="shirt-card">
            <Sparkles size={88} />
            <span>Amarillo · Route 66 · Team Stores · Business Accounts</span>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <StatCard icon={CreditCard} label="Active pipeline" value={money.format(activeRevenue)} detail="Open production revenue" />
        <StatCard icon={PackageCheck} label="Ready pickups" value={readyPickups} detail="Customers to notify" />
        <StatCard icon={Truck} label="Low stock" value={lowStock.length} detail="Reorder before it hurts sales" />
        <StatCard icon={Users} label="Repeat value" value={money.format(repeatValue)} detail="Existing customer opportunity" />
      </div>

      <div className="content-grid two">
        <Panel title="Today's owner readout" action="Live demo">
          <p>Focus on orders due soon, ready pickups, high-value customers, and inventory risks before production slows down.</p>
          <div className="mini-list">
            <span>Route 66 event portal ready for QR booth intake</span>
            <span>Team store workflow planned for schools and sports</span>
            <span>Customer reorder system planned for repeat accounts</span>
          </div>
        </Panel>
        <Panel title="Proof this is real" action="GitHub + Vercel">
          <p>The project is source-controlled, deployed through Vercel, and now has a dedicated production-upgrade branch for safe feature work.</p>
          <div className="mini-list">
            <span>Production deployment: READY</span>
            <span>Upgrade branch: feature/ycct-epic-production-upgrade</span>
            <span>Owner presentation and roadmap committed</span>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function QuoteIntake({ intake, setIntake, submitIntake, estimate }) {
  const update = (field, value) => setIntake((current) => ({ ...current, [field]: value }));

  return (
    <section className="content-grid quote-layout">
      <Panel title="Public quote intake" action="Customer-facing">
        <form className="form-grid" onSubmit={submitIntake}>
          <Field label="Name / organization" value={intake.name} placeholder="Customer, school, business, team..." onChange={(value) => update('name', value)} required />
          <Field label="Phone or email" value={intake.contact} placeholder="Best contact" onChange={(value) => update('contact', value)} required />
          <Select label="Project type" value={intake.projectType} onChange={(value) => update('projectType', value)} options={['Custom shirts', 'Business uniforms', 'Team store', 'Route 66 / event merch', 'Graduation package', 'Banners and signs']} />
          <Field label="Quantity" type="number" value={intake.quantity} onChange={(value) => update('quantity', value)} required />
          <Select label="Deadline" value={intake.deadline} onChange={(value) => update('deadline', value)} options={['Standard 5-7 business days', 'Rush 48 hours', 'Same day if available', 'Event deadline']} />
          <Select label="Artwork status" value={intake.artwork} onChange={(value) => update('artwork', value)} options={['I have print-ready artwork', 'I need design help', 'I need digitizing', 'I only have an idea']} />
          <label className="field wide">
            <span>Notes</span>
            <textarea value={intake.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Sizes, colors, placement, event date, brand notes..." />
          </label>
          <button className="gold-button full" type="submit">Submit quote request</button>
        </form>
      </Panel>

      <Panel title="Live estimate" action="Sales assist">
        <div className="quote-total">{money.format(estimate)}</div>
        <p>This is a quick planning estimate. Staff can finalize exact blank cost, artwork time, rush fees, and taxes.</p>
        <div className="mini-list">
          <span>Customer data captured cleanly</span>
          <span>Artwork status known before production</span>
          <span>Deadline risk visible immediately</span>
        </div>
      </Panel>
    </section>
  );
}

function IntakeQueue({ submissions }) {
  return (
    <section className="page-grid">
      <Panel title="New quote requests" action={`${submissions.length} captured`}>
        {submissions.length === 0 ? (
          <p>No new quote requests in this demo session yet. Submit one through Quote Intake to prove the flow.</p>
        ) : (
          <div className="order-stack">
            {submissions.map((lead) => (
              <article className="order-card" key={lead.id}>
                <div><strong>{lead.id}</strong><p>{lead.name} · {lead.projectType}</p></div>
                <span className="status blue">{lead.status}</span>
                <strong>{money.format(lead.estimate)}</strong>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </section>
  );
}

function ProductionBoard() {
  return (
    <section className="page-grid">
      <div className="kanban-row epic-kanban">
        {stageList.map((stage) => (
          <div className="mini-column" key={stage}>
            <span className="status blue">{stage}</span>
            <strong>{orders.filter((order) => order.status === stage).length}</strong>
            {orders.filter((order) => order.status === stage).slice(0, 2).map((order) => (
              <small key={order.id}>{order.id} · {order.type}</small>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function GrowthEngine() {
  return (
    <section className="content-grid three">
      <GrowthCard icon={QrCode} title="Route 66 booth mode" text="QR code intake for event traffic, fast merch orders, and same-day follow-up." />
      <GrowthCard icon={Shirt} title="Team stores" text="Size collection, package selection, parent ordering, and team reorder history." />
      <GrowthCard icon={Gift} title="Customer reorders" text="Repeat customers can reorder past jobs without starting over." />
      <GrowthCard icon={CalendarClock} title="Graduation campaigns" text="Class shirts, banners, and senior packages with deadline tracking." />
      <GrowthCard icon={Store} title="Business uniforms" text="Local accounts can maintain branded polos, workwear, hats, and reorder cycles." />
      <GrowthCard icon={Megaphone} title="Marketing proof" text="Owner-facing reporting shows where leads, orders, and event sales come from." />
    </section>
  );
}

function InventoryOps({ lowStock }) {
  return (
    <section className="page-grid">
      <Panel title="Inventory risk board" action={`${lowStock.length} low-stock items`}>
        <div className="table-card no-pad">
          <table>
            <thead><tr><th>SKU</th><th>Item</th><th>Stock</th><th>Reorder</th><th>Best for</th></tr></thead>
            <tbody>{inventory.map((item) => <tr key={item.sku}><td>{item.sku}</td><td>{item.item}</td><td>{item.stock}</td><td>{item.reorder}</td><td>{item.bestFor}</td></tr>)}</tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}

function ProofPack() {
  return (
    <section className="content-grid two">
      <Panel title="What has been done" action="Proof">
        <div className="mini-list">
          <span>GitHub repository connected</span>
          <span>Vercel production deployment ready</span>
          <span>SPA routing patched</span>
          <span>Auth context repaired</span>
          <span>Production API fallback repaired</span>
          <span>Upgrade branch created</span>
        </div>
      </Panel>
      <Panel title="What this proves to ownership" action="Business value">
        <p>The platform is no longer just a design idea. It is a deployed, source-controlled operating system being upgraded around real YCCT revenue workflows.</p>
      </Panel>
    </section>
  );
}

function GrowthCard({ icon: Icon, title, text }) {
  return (
    <article className="proof-card-public">
      <Icon size={24} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="stat-card">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function Panel({ title, action, children }) {
  return (
    <section className="panel-card">
      <div className="panel-head"><h3>{title}</h3><span>{action}</span></div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} required={required} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
