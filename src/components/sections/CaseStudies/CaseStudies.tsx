import { lazy, useState } from 'react'
import { caseStudies, filterTabs, type ProjectCategory } from '../../../content/caseStudies'
import { eksDioramaNodes } from '../../../content/eksDiorama'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'
import { SceneCanvasBoundary } from '../../../three/SceneCanvasBoundary'
import { useLightbox } from '../../../hooks/useLightbox'

const EksDiorama = lazy(() => import('./EksDiorama'))

type FilterValue = 'all' | ProjectCategory

const ICON_PATHS: Record<string, React.ReactNode> = {
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  cost: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" />,
  chart: (
    <>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </>
  ),
  flag: (
    <>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  zoom: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
}

const CATEGORY_ICON: Record<ProjectCategory, string> = {
  kubernetes: 'star',
  finops: 'cost',
  devsecops: 'shield',
  observability: 'chart',
  ctf: 'flag',
}

function Icon({ name }: { name: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

export function CaseStudies() {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [selectedNode, setSelectedNode] = useState('overview')
  const { open } = useLightbox()

  const featured = caseStudies.find((p) => p.featured)!
  const rest = caseStudies.filter((p) => !p.featured)
  const activeDescription = eksDioramaNodes.find((n) => n.id === selectedNode)?.description ?? ''

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionHeader label="PROVEN RESULTS" title="Case Studies & Projects" />

        <div className="project-filters">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              className={`filter-tab${filter === tab.value ? ' active' : ''}`}
              aria-pressed={filter === tab.value}
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          <Card
            className={`project-featured${filter !== 'all' && filter !== featured.category ? ' hidden' : ''}`}
            data-category={featured.category}
          >
            <div className="badge-chip">
              <Icon name={CATEGORY_ICON[featured.category]} />
              {featured.badgeLabel}
            </div>
            <div className="project-featured-content">
              <div className="featured-left">
                <h3>{featured.title}</h3>

                <div className="problem-solution-box">
                  <p>
                    <strong>Problem:</strong> {featured.problem}
                  </p>
                  <p>
                    <strong>Solution:</strong> {featured.solution}
                  </p>
                </div>

                <h4 className="achievement-title">Key Achievements:</h4>
                <ul className="project-achievements">
                  {featured.achievements?.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>

                <div className="project-tech-tags">
                  {featured.techTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="project-metrics">
                  {featured.metrics.map((m) => (
                    <div className="pm-card" key={m.label}>
                      <div className="pm-val">{m.value}</div>
                      <div className="pm-lbl">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="project-links">
                  <span className="badge-lock">
                    <Icon name="lock" />
                    {featured.linkBadge}
                  </span>
                </div>
              </div>

              <div className="featured-right">
                <h4 className="diagram-heading">Deployment Architecture</h4>
                <div className="interactive-diagram-container diorama-container">
                  <SceneCanvasBoundary
                    scene={EksDiorama}
                    sceneProps={{ selected: selectedNode }}
                    decorative={false}
                    label="Interactive multi-AZ EKS architecture diagram"
                  />
                  <img
                    src={featured.architectureImage}
                    alt="Multi-AZ Kubernetes Platform Architecture"
                    className="zoomable-img"
                    style={{ width: '100%', borderRadius: 4, cursor: 'zoom-in' }}
                    onClick={() =>
                      open(featured.architectureImage!, 'Multi-AZ Kubernetes Platform Architecture')
                    }
                  />
                  <span className="zoom-hint">
                    <Icon name="zoom" />
                    Click to zoom
                  </span>
                </div>

                <div
                  className="diorama-controls"
                  role="group"
                  aria-label="Architecture component selector"
                >
                  {eksDioramaNodes.map((node) => (
                    <button
                      key={node.id}
                      className={`diorama-control-btn${selectedNode === node.id ? ' active' : ''}`}
                      onClick={() => setSelectedNode(node.id)}
                      aria-pressed={selectedNode === node.id}
                    >
                      {node.label}
                    </button>
                  ))}
                </div>
                <p className="diorama-description">{activeDescription}</p>
              </div>
            </div>
          </Card>

          {rest.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              hidden={filter !== 'all' && filter !== project.category}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  hidden,
}: {
  project: (typeof caseStudies)[number]
  hidden: boolean
}) {
  return (
    <Card className={`project-card${hidden ? ' hidden' : ''}`} data-category={project.category}>
      <div className="badge-chip">
        <Icon name={CATEGORY_ICON[project.category]} />
        {project.badgeLabel}
      </div>
      <h3>{project.title}</h3>
      <div className="project-desc">
        <p>
          <strong>Problem:</strong> {project.problem}
        </p>
        <p>
          <strong>Solution:</strong> {project.solution}
        </p>
      </div>

      {project.pipelineFlow && (
        <>
          <h4 className="pipeline-heading">Pipeline Flow:</h4>
          <ol className="pipeline-list">
            {project.pipelineFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </>
      )}

      <div className="project-tech-tags">
        {project.techTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="project-submetrics">
        {project.metrics.map((m) => (
          <div key={m.label}>
            <span className={`submetric-val${m.tone === 'success' ? ' text-success' : ''}`}>
              {m.value}
            </span>
            <span className="submetric-lbl">{m.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
