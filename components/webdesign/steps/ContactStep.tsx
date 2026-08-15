'use client'

import type { SiteConfig } from '../types'
import { Field, StepHeading, TextInput } from './ui'

interface ContactStepProps {
  contact: SiteConfig['contact']
  onContact: (patch: Partial<SiteConfig['contact']>) => void
}

export default function ContactStep({ contact, onContact }: ContactStepProps) {
  return (
    <div>
      <StepHeading
        number={3}
        title="Contact & localisation"
        subtitle="Ces coordonnées alimentent la section réservation, le footer et le bouton WhatsApp flottant."
      />

      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Téléphone / WhatsApp">
            <TextInput
              type="tel"
              value={contact.phone}
              onChange={(e) => onContact({ phone: e.target.value })}
              placeholder="Ex : +33 6 12 34 56 78"
            />
          </Field>

          <Field label="Email">
            <TextInput
              type="email"
              value={contact.email}
              onChange={(e) => onContact({ email: e.target.value })}
              placeholder="contact@exemple.fr"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Instagram" optional hint="Ex : @moncompte — sans l'URL complète.">
            <TextInput
              value={contact.instagram}
              onChange={(e) => onContact({ instagram: e.target.value })}
              placeholder="@moncompte"
            />
          </Field>

          <Field label="Facebook" optional hint="Ex : monentreprise — sans l'URL complète.">
            <TextInput
              value={contact.facebook}
              onChange={(e) => onContact({ facebook: e.target.value })}
              placeholder="monentreprise"
            />
          </Field>
        </div>

        <Field
          label="Importer mes photos & textes depuis mes réseaux"
          optional
          hint="Collez le lien de votre profil ou d'un post (Instagram, TikTok, Facebook, Pinterest) : on récupère automatiquement vos vraies photos, votre bio et vos posts pour construire le site — aucun contenu inventé."
        >
          <TextInput
            value={contact.socialImport ?? ''}
            onChange={(e) => onContact({ socialImport: e.target.value })}
            placeholder="https://www.instagram.com/moncompte/ ou https://www.tiktok.com/@moncompte"
          />
        </Field>

        <Field
          label="Adresse / localisation"
          optional
          hint="Si une adresse est fournie, une carte Google Maps est intégrée automatiquement."
        >
          <TextInput
            value={contact.address}
            onChange={(e) => onContact({ address: e.target.value })}
            placeholder="Ex : 12 rue du Commerce, 33000 Bordeaux"
          />
        </Field>

        <Field label="Horaires" optional hint="Texte libre, ex : « Lun–Sam : 9h–19h · Fermé dimanche ».">
          <TextInput
            value={contact.hours}
            onChange={(e) => onContact({ hours: e.target.value })}
            placeholder="Ex : Lun–Sam : 9h00–19h00 · Sur rendez-vous"
          />
        </Field>
      </div>
    </div>
  )
}
