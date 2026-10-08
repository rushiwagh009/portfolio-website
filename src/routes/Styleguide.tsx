import '../styles/styleguide.css'

// TEMPORARY page for Phase 1 review — removed in Phase 4.

const COLORS: [string, string, string][] = [
  ['--background', '#0D1117', 'page'],
  ['--card', '#151B23', 'cards'],
  ['--muted', '#1C242E', 'inset / hover'],
  ['--foreground', '#E6EAF0', '15.67:1 on bg'],
  ['--muted-foreground', '#9AA7B5', '7.72:1 on bg'],
  ['--primary', '#06B6D4', 'button fill'],
  ['--primary-foreground', '#04161B', '7.62:1 on primary'],
  ['--accent', '#22D3EE', '10.47:1 on bg'],
  ['--border', '#2A3441', 'decorative'],
  ['--input', '#6B7788', 'field border ≥3:1'],
  ['--destructive', '#F87171', '6.84:1 on bg'],
  ['--success', '#4ADE80', '10.86:1 on bg'],
]

const SPACES = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" />
    </svg>
  )
}

export function Styleguide() {
  return (
    <div className="sg">
      <div className="sg-wrap">
        <p className="sg-label">Temporary · design-system/portfolio/MASTER.md</p>
        <h1 className="sg-display">Styleguide</h1>
        <p className="sg-lead" style={{ marginTop: 16 }}>
          Dark-first charcoal, one cyan accent, Inter for everything, Fira Code only for real code.
        </p>

        <section className="sg-block">
          <p className="sg-label">Colour tokens</p>
          <div className="sg-grid">
            {COLORS.map(([name, hex, note]) => (
              <div className="sg-swatch" key={name}>
                <div className="sg-chip" style={{ background: hex }} />
                <div className="sg-swatch-meta">
                  <b>{name}</b>
                  <span>
                    {hex} · {note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="sg-block">
          <p className="sg-label">Type scale</p>
          <div className="sg-stack">
            <h1 className="sg-display">Display — production infrastructure</h1>
            <h2 className="sg-h2">H2 — Section heading</h2>
            <h3 className="sg-h3">H3 — Card heading</h3>
            <h4 className="sg-h4">H4 — Subheading</h4>
            <p className="sg-lead">
              Lead — larger intro paragraph, 18px, capped at 68 characters wide.
            </p>
            <p style={{ maxWidth: '68ch' }}>
              Body — 16px / 1.65. Typography carries the design, so hierarchy comes from size,
              weight and spacing rather than colour or effects.
            </p>
            <p className="sg-small">Small — 14px meta text.</p>
            <p className="sg-label" style={{ margin: 0 }}>
              Label — uppercase eyebrow
            </p>
            <pre className="sg-code">
              terraform plan -out=tfplan{'\n'}kubectl get pods -n production
            </pre>
          </div>
        </section>

        <section className="sg-block">
          <p className="sg-label">Spacing (8px scale)</p>
          <div className="sg-stack">
            {SPACES.map((s) => (
              <div className="sg-space" key={s}>
                <span style={{ width: 48 }}>{s}px</span>
                <i style={{ width: s }} />
              </div>
            ))}
          </div>
        </section>

        <section className="sg-block">
          <p className="sg-label">Radius</p>
          <div className="sg-row">
            {[4, 8, 12].map((r) => (
              <div
                key={r}
                style={{
                  width: 96,
                  height: 64,
                  border: '1px solid var(--input)',
                  borderRadius: r,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '0.875rem',
                }}
              >
                {r}px
              </div>
            ))}
          </div>
          <p className="sg-small" style={{ marginTop: 16 }}>
            Shadows: none on cards. Overlays only: 0 8px 24px rgb(0 0 0 / 0.4). Motion: 150–250ms,
            opacity and translate only.
          </p>
        </section>

        <section className="sg-block">
          <p className="sg-label">Buttons and links</p>
          <div className="sg-row">
            <button className="sg-btn sg-btn-primary">Primary action</button>
            <button className="sg-btn sg-btn-secondary">Secondary</button>
            <button className="sg-btn sg-btn-primary" disabled>
              Disabled
            </button>
            <a className="sg-link" href="#styleguide">
              Text link
            </a>
          </div>
        </section>

        <section className="sg-block">
          <p className="sg-label">Cards (equal height)</p>
          <div className="sg-grid">
            <div className="sg-card">
              <ShieldIcon />
              <h3 className="sg-h3">Card title</h3>
              <p className="sg-small">
                Surface step plus 1px border. No glow, no hover lift, 24px padding.
              </p>
              <span className="sg-tag">Terraform</span>
            </div>
            <div className="sg-card">
              <div className="sg-metric">00%</div>
              <h3 className="sg-h3">Metric card</h3>
              <p className="sg-small">
                Accent reserved for key metrics, links and the primary CTA.
              </p>
            </div>
            <div className="sg-card">
              <ShieldIcon />
              <h3 className="sg-h3">A longer card title that wraps onto two lines</h3>
              <p className="sg-small">Short body.</p>
            </div>
          </div>
        </section>

        <section className="sg-block">
          <p className="sg-label">Form fields</p>
          <form className="sg-stack" onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="sg-field">
              <label htmlFor="sg-name">Name</label>
              <input id="sg-name" className="sg-input" placeholder="Jane Doe" />
            </div>
            <div className="sg-field">
              <label htmlFor="sg-email">Email</label>
              <input
                id="sg-email"
                className="sg-input"
                aria-invalid="true"
                aria-describedby="sg-email-err"
                defaultValue="jane@"
              />
              <span id="sg-email-err" className="sg-error">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16.5v.01" />
                </svg>
                Error state shown with icon and text, not colour alone.
              </span>
            </div>
            <div className="sg-field">
              <label htmlFor="sg-msg">Message</label>
              <textarea id="sg-msg" className="sg-input" />
            </div>
            <div>
              <button className="sg-btn sg-btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
