import { skillCategories, tagDirectory } from '../../../content/skills'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'

export function Skills() {
  return (
    <section id="skills" className="section skills-section bg-secondary">
      <div className="container">
        <SectionHeader label="PROFICIENCIES" title="Technical Expertise" />

        <div className="skills-grid">
          {skillCategories.map((category) => (
            <Card className="skills-category-card" key={category.title}>
              <h3>
                {category.logo && <img src={category.logo} alt="" className="skill-cat-logo" />}
                {category.title}
              </h3>
              <ul className="skill-list">
                {category.skills.map((skill) => (
                  <li key={skill.name}>{skill.name}</li>
                ))}
              </ul>
            </Card>
          ))}

          <Card className="tag-cloud-card">
            <h3>Cloud &amp; DevOps Tag Directory</h3>
            <div className="tag-cloud">
              {tagDirectory.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
