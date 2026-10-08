import { lazy, useRef } from 'react'
import { skillCategories, tagDirectory } from '../../../content/skills'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'
import { SceneCanvasBoundary } from '../../../three/SceneCanvasBoundary'
import { useSectionReveal } from '../../../hooks/useSectionReveal'

const SkillsOrbitalScene = lazy(() => import('./SkillsOrbitalScene'))

function SkillBar({
  name,
  percent,
  revealed,
}: {
  name: string
  percent: number
  revealed: boolean
}) {
  return (
    <div className="skill-item">
      <div className="skill-info">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-fill"
          data-width={`${percent}%`}
          style={{ width: revealed ? `${percent}%` : '0%' }}
        ></div>
      </div>
    </div>
  )
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useSectionReveal(sectionRef)

  const categoryAverages = skillCategories.map(
    (cat) => cat.skills.reduce((sum, s) => sum + s.percent, 0) / cat.skills.length,
  )

  return (
    <section id="skills" ref={sectionRef} className="section skills-section bg-secondary">
      <SceneCanvasBoundary
        scene={SkillsOrbitalScene}
        sceneProps={{ categoryAverages }}
        decorative
      />
      <div className="container">
        <SectionHeader label="PROFICIENCIES" title="Technical Expertise" />

        <div className="skills-grid">
          <div className="skills-left">
            {skillCategories.map((category) => (
              <Card className="skills-category-card" key={category.title}>
                <h3>
                  {category.logo && (
                    <img src={category.logo} alt={category.title} className="skill-cat-logo" />
                  )}
                  {category.title}
                </h3>
                {category.skills.map((skill) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    percent={skill.percent}
                    revealed={revealed}
                  />
                ))}
              </Card>
            ))}
          </div>

          <div className="skills-right">
            <Card className="tag-cloud-card">
              <h3>Cloud & DevOps Tag Directory</h3>
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
      </div>
    </section>
  )
}
