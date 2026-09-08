import { techStack } from '../../content/techStack'

export function TechStrip() {
  const looped = [...techStack, ...techStack]

  return (
    <section className="tech-strip">
      <div className="tech-strip-title">CORE TECHNOLOGY STACK</div>
      <div className="marquee-container">
        <div className="marquee-track">
          {looped.map((chip, i) => (
            <span className="tech-chip" key={`${chip.name}-${i}`}>
              <img src={chip.logo} alt={chip.name} className="chip-logo" />
              {chip.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
