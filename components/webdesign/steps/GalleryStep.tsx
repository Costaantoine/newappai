'use client'

import { type MediaFile } from '../types'
import FileUpload from '../FileUpload'
import { StepHeading } from './ui'

interface GalleryStepProps {
  gallery: MediaFile[]
  onGallery: (gallery: MediaFile[]) => void
}

export default function GalleryStep({ gallery, onGallery }: GalleryStepProps) {
  const photos = gallery.filter((f) => f.type === 'image')
  const videos = gallery.filter((f) => f.type === 'video')

  return (
    <div>
      <StepHeading
        number={2}
        title="Votre galerie"
        subtitle="Les photos alimentent le hero et la galerie. Les vidéos sont affichées avec un badge lecture. Tout reste en mémoire dans votre navigateur."
      />

      <div className="space-y-8">
        <FileUpload
          kind="image"
          label="Photos"
          helper="Idéalement au moins 3 photos (format portrait ou carré). La première sert de fond au hero."
          files={photos}
          onChange={(files) => onGallery([...files, ...videos])}
          multiple
          maxFiles={12}
          maxSizeMb={8}
        />

        <FileUpload
          kind="video"
          label="Vidéos"
          helper="Optionnel — montrez votre travail en mouvement."
          files={videos}
          onChange={(files) => onGallery([...photos, ...files])}
          multiple
          maxFiles={4}
          maxSizeMb={30}
        />
      </div>
    </div>
  )
}
