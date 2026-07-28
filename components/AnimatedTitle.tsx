'use client'

type HeadingTag = 'h1' | 'h2' | 'h3'

interface AnimatedTitleProps {
  text: string
  className?: string
  as?: HeadingTag
  'data-section'?: string
}

export default function AnimatedTitle({
  text,
  className = '',
  as: Tag = 'h2',
  'data-section': dataSection,
}: AnimatedTitleProps) {
  return <Tag data-section={dataSection} className={className}>{text}</Tag>
}
