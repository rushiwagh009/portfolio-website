import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline'

interface CommonProps {
  variant?: Variant
  small?: boolean
  block?: boolean
  children: ReactNode
  className?: string
}

type AsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

export function Button(props: AsAnchor | AsButton) {
  const { variant = 'primary', small, block, children, className = '', ...rest } = props

  const classes = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-outline',
    small ? 'btn-sm' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if ('href' in props && props.href !== undefined) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a className={classes} {...anchorRest}>
        {children}
      </a>
    )
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  )
}
