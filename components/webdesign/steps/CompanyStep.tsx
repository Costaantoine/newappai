'use client'

import { SECTORS, type MediaFile, type SiteConfig } from '../types'
import FileUpload from '../FileUpload'
import { Field, SelectInput, StepHeading, TextArea, TextInput } from './ui'

interface CompanyStepProps {
  config: SiteConfig
  onBusiness: (patch: Partial<SiteConfig['business']>) => void
  onLogo: (logo: MediaFile | null) => void
}

export default function CompanyStep({ config, onBusiness, onLogo }: CompanyStepProps) {
  const { business } = config
  return (
    <div>
      <StepHeading
        number={0}
        title="Votre entreprise"
        subtitle="Ces informations alimentent le hero et la section « À propos » de votre site."
      />

      <div className="space-y-5">
        <Field label="Nom de l'entreprise">
          <TextInput
            value={business.name}
            onChange={(e) => onBusiness({ name: e.target.value })}
            placeholder="Ex : Maison Bella"
            maxLength={60}
          />
        </Field>

        <Field label="Secteur d'activité">
          <SelectInput value={business.sector} onChange={(e) => onBusiness({ sector: e.target.value })}>
            {SECTORS.map((s) => (
              <option key={s.id} value={s.id} className="bg-neutral-900">
                {s.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Description courte" hint="2 à 3 phrases — présentées dans la section « À propos ».">
          <TextArea
            value={business.description}
            onChange={(e) => onBusiness({ description: e.target.value })}
            placeholder="Ex : Chez Maison Bella, nous sublimons chaque détail depuis 2015. Approche artisanale, produits soignés et accueil chaleureux…"
            maxLength={500}
          />
        </Field>

        <Field label="Logo" optional>
          <FileUpload
            kind="image"
            files={business.logo ? [business.logo] : []}
            onChange={(files) => onLogo(files[0] || null)}
            multiple={false}
            maxFiles={1}
            maxDimension={512}
            label="Logo"
          />
        </Field>
      </div>
    </div>
  )
}
