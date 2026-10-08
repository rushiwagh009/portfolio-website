import { techStack } from '../../content/techStack'

export function TechStrip() {
  return (
    <section className="tech-strip">
      <div className="container">
        <div className="tech-strip-title">CORE TECHNOLOGY STACK</div>
        <ul className="tech-list">
          {techStack.map((chip) => (
            <li className="tech-chip" key={chip.name}>
              <img src={chip.logo} alt="" className="chip-logo" />
              {chip.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
