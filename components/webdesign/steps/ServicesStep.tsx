'use client'

import { uid, type Service } from '../types'
import { Field, StepHeading, TextArea, TextInput } from './ui'

interface ServicesStepProps {
  services: Service[]
  onServices: (services: Service[]) => void
}

function emptyService(): Service {
  return { id: uid(), name: '', description: '', price: '' }
}

export default function ServicesStep({ services, onServices }: ServicesStepProps) {
  const update = (id: string, patch: Partial<Service>) => {
    onServices(services.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const remove = (id: string) => {
    onServices(services.filter((s) => s.id !== id))
  }

  const add = () => {
    onServices([...services, emptyService()])
  }

  return (
    <div>
      <StepHeading
        number={1}
        title="Vos services & tarifs"
        subtitle="La liste s'affiche dans les sections « Services » et « Tarifs » de votre site. Ajoutez vos prestations comme sur le site de référence."
      />

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={service.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                Prestation {index + 1}
              </span>
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(service.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              )}
            </div>

            <Field label="Nom du service">
              <TextInput
                value={service.name}
                onChange={(e) => update(service.id, { name: e.target.value })}
                placeholder="Ex : Manicure"
                maxLength={50}
              />
            </Field>

            <Field label="Description courte">
              <TextInput
                value={service.description}
                onChange={(e) => update(service.id, { description: e.target.value })}
                placeholder="Ex : Manicure classique ou spa, avec vernis normal ou gel."
                maxLength={140}
              />
            </Field>

            <Field label="Prix" hint="Indiquez « dès 15€ » ou un tarif fixe comme « 25€ ».">
              <TextInput
                value={service.price}
                onChange={(e) => update(service.id, { price: e.target.value })}
                placeholder="Ex : dès 15€"
                maxLength={20}
              />
            </Field>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-5 w-full rounded-xl border border-dashed border-neutral-700 hover:border-violet-400/60 text-slate-400 hover:text-violet-300 transition py-3.5 flex items-center justify-center gap-2 text-sm font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un service
      </button>
    </div>
  )
}
