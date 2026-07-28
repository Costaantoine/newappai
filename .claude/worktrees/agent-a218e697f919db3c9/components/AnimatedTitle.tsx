'use client'

type HeadingTag = 'h1' | 'h2' | 'h3'

interface AnimatedTitleProps {
  text: string
  className?: string
  as?: HeadingTag
}

export default function AnimatedTitle({
  text,
  className = '',
  as: Tag = 'h2',
}: AnimatedTitleProps) {
  const letters = text.split('').map((char, i) => {
    if (char === ' ') {
      return (
        <span key={i} className="inline-block">
          &nbsp;
        </span>
      )
    }
    return (
      <span
        key={i}
        className="inline-block animate-letter-wave"
        style={{ animationDelay: `${i * 0.04}s` }}
      >
        {char}
      </span>
    )
  })

  return <Tag className={className}>{letters}</Tag>
}
