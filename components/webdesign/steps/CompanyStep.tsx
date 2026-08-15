'use client'

import { LANGUAGES, SECTORS, type MediaFile, type SiteConfig } from '../types'
import FileUpload from '../FileUpload'
import { Field, SelectInput, StepHeading, TextArea, TextInput } from './ui'

interface CompanyStepProps {
  config: SiteConfig
  onBusiness: (patch: Partial<SiteConfig['business']>) => void
  onLogo: (logo: MediaFile | null) => void
  onLanguage: (language: string) => void
}

/** Calcule un pourcentage de complétude + le champ manquant le plus prioritaire à signaler. */
function computeCompleteness(config: SiteConfig): { percent: number; missing: string | null } {
  const checks: { done: boolean; label: string }[] = [
    { done: !!config.business.name.trim(), label: 'un nom' },
    { done: !!config.business.description.trim(), label: 'une description' },
    { done: config.services.some((s) => s.name.trim()), label: 'un service' },
    { done: config.gallery.some((g) => g.type === 'image'), label: 'une photo' },
    { done: !!config.contact.address.trim(), label: 'une adresse' },
    { done: !!config.contact.phone.trim(), label: 'un téléphone' },
  ]
  const doneCount = checks.filter((c) => c.done).length
  const percent = Math.round((doneCount / checks.length) * 100)
  const missing = checks.find((c) => !c.done)?.label ?? null
  return { percent, missing }
}

export default function CompanyStep({ config, onBusiness, onLogo, onLanguage }: CompanyStepProps) {
  const { business } = config
  const { percent, missing } = computeCompleteness(config)
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

        <Field
          label="Site existant"
          optional
          hint="Nous le lisons pour connaître votre activité, mais le contenu de votre nouveau site vient uniquement de vos réponses ici."
        >
          <TextInput
            type="url"
            value={business.website || ''}
            onChange={(e) => onBusiness({ website: e.target.value })}
            placeholder="https://... (si vous avez déjà un site)"
          />
        </Field>

        <Field label="Langue du site">
          <SelectInput value={config.language || 'fr'} onChange={(e) => onLanguage(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id} className="bg-neutral-900">
                {l.label}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Votre site sera <span className="text-slate-300 font-semibold">{percent}%</span> complet
        {missing ? <> — ajoutez {missing} pour un meilleur résultat.</> : <> — tout est prêt !</>}
      </p>
    </div>
  )
}
