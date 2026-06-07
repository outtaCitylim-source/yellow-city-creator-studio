import { ArrowRight, CheckCircle2, Globe2, MapPin, Phone, Shirt, Sparkles } from 'lucide-react';
import { business, catalog, proofPoints, techniques, workflow } from './data.js';

export default function CreatorBar({ onOpenStudio }) {
  const handleStartOrder = () => {
    if (typeof onOpenStudio === 'function') {
      onOpenStudio();
      return;
    }

    window.location.hash = '#studio';
  };

  return (
    <main className="creator-site">
      <section className="creator-hero-public">
        <div className="creator-status">
          <span className="live-dot" />
          Now Accepting Orders
          <span>DTF · DTG · Embroidery · Garment Wash</span>
        </div>
        <p className="creator-small">{business.tagline}</p>
        <h1>Yellow City <span>Creator Studio</span></h1>
        <p className="creator-lead">
          Premium custom apparel printed, embroidered, and designed in Amarillo, Texas — built for walk-ins, online quote requests, team stores, business accounts, and event merch.
        </p>
        <div className="creator-actions">
          <button type="button" onClick={handleStartOrder} className="gold-button">Start Your Order <ArrowRight size={18} /></button>
          <a className="ghost-button" href={`tel:${business.phone}`}>Talk to Us</a>
        </div>
      </section>

      <section className="creator-section-public">
        <p className="eyebrow">What we do</p>
        <h2>Every technique. One studio.</h2>
        <p className="creator-copy">From a single custom tee to a 500-piece brand rollout, the studio handles decoration, proofing, production, and fulfillment in one workflow.</p>
        <div className="tech-grid-public">
          {techniques.map((item) => (
            <article className="tech-card-public" key={item.code}>
              <div className="tech-head"><span>{item.code}</span><small>{item.title}</small></div>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
              <strong>{item.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="creator-section-public">
        <p className="eyebrow">The workflow</p>
        <h2>Four steps to finished.</h2>
        <div className="workflow-grid-public">
          {workflow.map((step) => (
            <article className="workflow-card-public" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="creator-section-public">
        <p className="eyebrow">The catalog</p>
        <h2>Find your fit.</h2>
        <div className="catalog-grid-public">
          {catalog.map((item) => (
            <article className="catalog-card-public" key={item.title}>
              <Shirt size={24} />
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="creator-why-public">
        <div>
          <p className="eyebrow">Why Yellow City</p>
          <h2>Built for Amarillo print production.</h2>
          <p>
            {business.name} brings high-quality custom print production to Amarillo. Every order can move through quote intake, proofing, approval, production, pickup, and customer follow-up without getting lost in messages or paper notes.
          </p>
          <div className="creator-actions left">
            <button type="button" onClick={handleStartOrder} className="gold-button">Get a Quote</button>
            <a className="ghost-button" href={`https://${business.website}`}>Visit Website</a>
          </div>
        </div>
        <div className="proof-grid-public">
          {proofPoints.map((point) => (
            <article className="proof-card-public" key={point.title}>
              <CheckCircle2 size={22} />
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="creator-cta-public">
        <Sparkles size={32} />
        <p className="eyebrow">Ready to print?</p>
        <h2>One logo. Many products.</h2>
        <p>Start in-store at the Amarillo studio or submit a quote online.</p>
        <button type="button" onClick={handleStartOrder} className="gold-button">Start Your Order</button>
      </section>

      <section className="creator-contact-public">
        <div><MapPin /><strong>Location</strong><p>{business.address}</p></div>
        <div><Phone /><strong>Contact</strong><p>{business.phone}</p></div>
        <div><Globe2 /><strong>Website</strong><p>{business.website}</p></div>
      </section>
    </main>
  );
}
