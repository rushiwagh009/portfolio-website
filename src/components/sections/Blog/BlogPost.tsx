import { lazy, Suspense, useEffect, type ComponentType, type LazyExoticComponent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Header } from '../../layout/Header'
import { Footer } from '../../layout/Footer'
import { blogPosts } from '../../../content/blogPosts'
import { usePrerenderReady } from '../../../hooks/usePrerenderReady'

const modules = import.meta.glob('../../../../content/blog/terraform/*.mdx')

const postComponents: Record<string, LazyExoticComponent<ComponentType>> = {}
for (const path in modules) {
  const slug = path.split('/').pop()!.replace('.mdx', '')
  postComponents[slug] = lazy(modules[path] as () => Promise<{ default: ComponentType }>)
}

function BackButton() {
  return (
    <Link to="/#blog" className="back-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back to Portfolio
    </Link>
  )
}

function LoadingState() {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading insight...</p>
    </div>
  )
}

function NotFoundState() {
  usePrerenderReady()
  return (
    <div className="error-state">
      <h2>ERR_FILE_NOT_FOUND</h2>
      <p>Article could not be loaded. It may have been moved or deleted.</p>
      <br />
      <Link to="/#blog" className="btn btn-primary">
        Return to Blog Grid
      </Link>
    </div>
  )
}

function PostContent({ LazyPost }: { LazyPost: ComponentType }) {
  usePrerenderReady()
  return (
    <div className="markdown-body">
      <LazyPost />
    </div>
  )
}

export function BlogPost() {
  const { slug = '' } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)
  const LazyPost = postComponents[slug]

  useEffect(() => {
    document.title = post ? `${post.title} | Rushi Wagh` : 'Article Not Found | Rushi Wagh'
  }, [post])

  return (
    <>
      <Header />
      <main className="blog-container">
        <BackButton />
        {LazyPost ? (
          <Suspense fallback={<LoadingState />}>
            <PostContent LazyPost={LazyPost} />
          </Suspense>
        ) : (
          <NotFoundState />
        )}
      </main>
      <Footer />
    </>
  )
}
