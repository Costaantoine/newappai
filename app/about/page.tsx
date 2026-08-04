'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import { usePathname } from 'next/navigation'
import AnimatedTitle from '@/components/AnimatedTitle'
import ParticlesBackground from '@/components/ParticlesBackground'
import AppleHero from '@/components/AppleHero'
import AppleCard from '@/components/AppleCard'
import AppleSection from '@/components/AppleSection'
import SEOHead from '@/components/SEOHead'
import { useTexts, TextItem } from '@/lib/useTexts'
import { useSettings } from '@/lib/SettingsContext'

function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return ''
  try {
    const parsed = JSON.parse(imagePath)
    return parsed.original || parsed.thumbnail || imagePath
  } catch {
    return imagePath
  }
}

export default function AboutPage() {
  const { lang } = useLanguage()
  const pathname = usePathname()
  const { texts, loading } = useTexts()
  const { settings: globalSettings } = useSettings()

  const getText = (key: string, fallback: string = ''): string => {
    const text = texts.find(t => t.key === key)
    if (text) {
      const val = text[lang as keyof TextItem]
      if (val && val.trim() !== '') return val
      return (text.fr && text.fr.trim() !== '') ? text.fr : fallback || key
    }
    return fallback || key
  }

  const aboutTitle = getText('about_title', 'Notre Histoire')

  if (loading) return <div className="min-h-screen bg-transparent flex items-center justify-center text-white">Chargement...</div>

  return (
    <>
      <SEOHead
        title="À propos de NewAppAI | Innovation Logicielle — IA pour votre entreprise"
        description="Découvrez l'histoire de NewAppAI, notre vision, notre approche et nos valeurs. Innovation logicielle et IA au service de votre entreprise."
        ogUrl="https://newappai.com/about"
      />
      <Header />

      <main className="min-h-screen bg-[#000000] overflow-x-hidden">
        <AppleHero
          title={aboutTitle.includes('Histoire') ? (
            <>
              {aboutTitle.split('Histoire')[0]}
              <span className="neon-text">Histoire</span>
              {aboutTitle.split('Histoire')[1]}
            </>
          ) : aboutTitle}
          subtitle={getText('about_subtitle', 'Une passion pour l\'innovation, une mission pour votre réussite.')}
          titleDataSection="about-title"
          subtitleDataSection="about-subtitle"
          backgroundImage={getImageUrl(globalSettings?.hero?.image_url) || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=75&fm=webp'}
        />

        <AppleSection>
          <AppleCard padding="lg" className="animate-fade-in-up max-w-5xl mx-auto">
            <div className="group" data-section="about-history">
              <h2 data-section="about-history-title" className="text-3xl md:text-4xl font-bold mb-6 text-[#f5f5f7] flex items-center">
                <span className="w-2 h-8 bg-violet-500 rounded-full mr-4 group-hover:h-10 transition-all"></span>
                {getText('about_hero_title', "D'où on vient")}
              </h2>
              <p className="text-[#86868b] text-base leading-relaxed whitespace-pre-line">
                <span data-section="about-history-desc">{getText('about_hero_subtitle', '')}</span>
              </p>
            </div>
          </AppleCard>
        </AppleSection>

        <AppleSection>
          <AppleCard padding="lg" className="animate-fade-in-up max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
              <div className="space-y-10">
                <div className="group" data-section="about-vision">
                  <h2 data-section="about-vision-title" className="text-3xl md:text-4xl font-bold mb-6 text-[#f5f5f7] flex items-center">
                    <span className="w-2 h-8 bg-violet-500 rounded-full mr-4 group-hover:h-10 transition-all"></span>
                    {getText('about_vision_title', 'Notre Vision')}
                  </h2>
                  <p className="text-[#86868b] text-base leading-relaxed">
                    <span data-section="about-vision-desc">{getText('about_vision_desc', 'Chez NewAppAI, nous croyons que la technologie doit servir l\'humain, pas l\'inverse. Notre mission est de rendre l\'innovation accessible à toutes les entreprises, quelle que soit leur taille.')}</span>
                  </p>
                </div>

                <div className="group" data-section="about-approach">
                  <h2 data-section="about-approach-title" className="text-3xl md:text-4xl font-bold mb-6 text-[#f5f5f7] flex items-center">
                    <span className="w-2 h-8 bg-violet-500 rounded-full mr-4 group-hover:h-10 transition-all"></span>
                    {getText('about_approach_title', 'Notre Approche')}
                  </h2>
                  <p className="text-[#86868b] text-base leading-relaxed">
                    <span data-section="about-approach-desc">{getText('about_approach_desc', 'Nous développons des solutions sur-mesure qui s\'adaptent à vos besoins spécifiques. Chaque projet est unique, et nous nous engageons à vous accompagner à chaque étape de votre transformation digitale.')}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h2 data-section="about-values" className="text-3xl md:text-4xl font-bold mb-8 text-[#f5f5f7]">{getText('about_values_title', 'Nos Valeurs')}</h2>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { key: 'simplicite', title: 'Simplicité', desc: 'Des solutions simples et efficaces, sans complexité inutile. Si c\'est compliqué à expliquer, c\'est qu\'on n\'a pas encore trouvé la bonne solution.' },
                    { key: 'rapidite', title: 'Rapidité d\'exécution', desc: 'De l\'idée au logiciel qui tourne, en semaines, pas en mois. On avance étape par étape, avec vérification à chaque jalon.' },
                    { key: 'innovation', title: 'Innovation', desc: 'Toujours à la pointe des technologies' },
                    { key: 'proximity', title: 'Proximité', desc: 'Un accompagnement personnalisé' },
                    { key: 'excellence', title: 'Excellence', desc: 'Des solutions de qualité supérieure' }
                  ].map((value) => (
                    <AppleCard key={value.key} padding="md" hover glowColor="violet">
                      <h3 className="text-xl font-bold mb-3 text-[#f5f5f7] group-hover:text-violet-400 transition-colors">
                        <span data-section={`about-${value.key}-title`}>{getText(`about_${value.key}_title`, value.title)}</span>
                      </h3>
                      <p className="text-[#86868b] leading-relaxed font-normal">
                        <span data-section={`about-${value.key}-desc`}>{getText(`about_${value.key}_desc`, value.desc)}</span>
                      </p>
                    </AppleCard>
                  ))}
                </div>
              </div>
            </div>
          </AppleCard>
        </AppleSection>
      </main>

      <Footer />
    </>
  )
}

