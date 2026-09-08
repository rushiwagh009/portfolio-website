import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/** A 3D scene failing to render (driver quirk, WebGL context loss) must never
 * take down the surrounding 2D content — it just silently stops showing the
 * decorative/interactive layer. */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('3D scene failed to render:', error)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
