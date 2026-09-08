import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../../../content/blogPosts'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'

export function BlogSection() {
  const [query, setQuery] = useState('')

  const filtered = blogPosts.filter((post) => {
    const haystack = `${post.title} ${post.teaser} ${post.searchKeywords}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })

  return (
    <section id="blog" className="section blog-section">
      <div className="container">
        <SectionHeader label="07 // INSIGHTS" title="Technical Blog" />

        <div className="blog-search-container">
          <input
            type="text"
            id="blog-search"
            placeholder="Search technical topics (e.g. Terraform, EKS, cost)..."
            className="blog-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="blog-grid" id="blog-grid">
          {filtered.map((post) => (
            <Card className="blog-card" key={post.slug} data-title={post.searchKeywords}>
              <span className="blog-category">{post.category}</span>
              <h3>{post.title}</h3>
              <p className="blog-teaser">{post.teaser}</p>
              <Link to={`/blog/${post.slug}`} className="btn btn-outline btn-sm blog-btn">
                Read Article
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
