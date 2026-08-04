'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import { useTexts, TextItem } from '@/lib/useTexts'

export default function NotreHistoirePage() {
  const { lang } = useLanguage()
  const { texts, loading } = useTexts()

  const getText = (key: string, fallback: string = ''): string => {
    return texts.find(t => t.key === key)?.[lang as keyof TextItem] || fallback
  }

  if (loading) return <div className="min-h-screen bg-transparent flex items-center justify-center text-white">Chargement...</div>

  const values = [
    { key: 'innovation', title: getText('hist_value_innovation_title', 'Innovation'), desc: getText('hist_value_innovation_desc', 'Toujours à la pointe des technologies') },
    { key: 'proximity', title: getText('hist_value_proximity_title', 'Proximité'), desc: getText('hist_value_proximity_desc', 'Un accompagnement personnalisé') },
    { key: 'excellence', title: getText('hist_value_excellence_title', 'Excellence'), desc: getText('hist_value_excellence_desc', 'Des solutions de qualité supérieure') },
    { key: 'transparency', title: getText('hist_value_transparency_title', 'Transparence'), desc: getText('hist_value_transparency_desc', 'Une relation de confiance') },
  ]

  const team = [
    { key: 'direction', role: getText('hist_team_direction_title', 'Direction & Stratégie'), desc: getText('hist_team_direction_desc', 'Pilotage des projets') },
    { key: 'engineering', role: getText('hist_team_engineering_title', 'Ingénierie IA'), desc: getText('hist_team_engineering_desc', 'Conception et développement') },
    { key: 'design', role: getText('hist_team_design_title', 'Design & Expérience'), desc: getText('hist_team_design_desc', 'Création d\'interfaces') },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-slate-100 pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-center">
            <span data-section="hist-title">{getText('hist_title', 'Notre')}</span>{' '}
            <span className="neon-text" data-section="hist-title-highlight">Histoire</span>
          </h1>
          <p data-section="hist-subtitle" className="text-[#33ff33] text-lg text-center mb-16 max-w-2xl mx-auto">
            {getText('hist_subtitle', 'Une passion pour l\'innovation, une mission pour votre réussite.')}
          </p>

          <div className="space-y-16">
            <section>
              <h2 data-section="hist-who-title" className="text-2xl font-bold text-[#33ff33] mb-4 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-4"></span>
                {getText('hist_who_title', 'Qui sommes-nous')}
              </h2>
              <p data-section="hist-who-desc" className="text-[#33ff33] leading-relaxed">
                {getText('hist_who_desc', 'NewAppAI est une agence française spécialisée dans la conception de solutions d\'intelligence artificielle sur-mesure.')}
              </p>
            </section>

            <section>
              <h2 data-section="hist-mission-title" className="text-2xl font-bold text-[#33ff33] mb-4 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-4"></span>
                {getText('hist_mission_title', 'Mission')}
              </h2>
              <p data-section="hist-mission-desc" className="text-[#33ff33] leading-relaxed">
                {getText('hist_mission_desc', 'Notre mission est de rendre l\'intelligence artificielle accessible à toutes les entreprises.')}
              </p>
            </section>

            <section>
              <h2 data-section="hist-values-title" className="text-2xl font-bold text-[#33ff33] mb-8 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-4"></span>
                {getText('hist_values_title', 'Valeurs')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value) => (
                  <div
                    key={value.key}
                    className="bg-black/60 p-6 rounded-2xl border border-white/5 hover:border-[#33ff33]/30 transition-all duration-300"
                  >
                    <h3 data-section={`hist-value-${value.key}-title`} className="text-lg font-bold text-[#33ff33] mb-2">{value.title}</h3>
                    <p data-section={`hist-value-${value.key}-desc`} className="text-[#33ff33] leading-relaxed text-sm">{value.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 data-section="hist-team-title" className="text-2xl font-bold text-[#33ff33] mb-8 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-4"></span>
                {getText('hist_team_title', 'Équipe')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map((member) => (
                  <div
                    key={member.key}
                    className="bg-black/60 p-6 rounded-2xl border border-white/5 hover:border-[#33ff33]/30 transition-all duration-300"
                  >
                    <h3 data-section={`hist-team-${member.key}-title`} className="text-base font-bold text-[#33ff33] mb-2">{member.role}</h3>
                    <p data-section={`hist-team-${member.key}-desc`} className="text-[#33ff33] leading-relaxed text-sm">{member.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
