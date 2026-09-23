'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppleHero from '@/components/AppleHero'
import AppleCard from '@/components/AppleCard'
import AppleSection from '@/components/AppleSection'
import SEOHead from '@/components/SEOHead'

// Texte fourni tel quel par le client (Antoine) pour "Notre histoire" — ne pas
// reformuler ni faire passer par l'i18n existant, conformément à la mission.
const NOTRE_HISTOIRE = [
  "Quand l'intelligence artificielle générative est devenue accessible aux entreprises, nous avons fait un choix simple : prendre le temps de comprendre cette technologie avant de l'utiliser.",
  "Nous nous sommes formés. Pas sur une semaine, en continu — les modèles évoluent vite, et rester utile exige de suivre chaque évolution de près : nouveaux modèles, nouveaux outils, nouvelles façons de les faire travailler ensemble.",
  "Aujourd'hui, nous maîtrisons le sujet. Pas de façon théorique : nous concevons, déployons et maintenons des applications qui utilisent l'IA au quotidien, pour des clients réels, avec des contraintes réelles de coût, de fiabilité et de sécurité.",
  "Nous avons été parmi les premiers à nous positionner sur ce terrain, à un moment où la plupart des entreprises commençaient à peine à en entendre parler. Cette avance de temps s'est transformée en avance de compétence.",
  "L'équipe humaine derrière NewAppAI est restée volontairement petite : nous sommes 4 personnes.",
  "Pendant tout ce temps, en parallèle du travail avec nos clients, nous avons développé du personnel spécialisé en intelligence artificielle pour compléter notre équipe — des agents IA formés et supervisés par nous, chacun dédié à une fonction précise plutôt qu'à des tâches génériques.",
  "Ce personnel spécialisé multiplie par 10 nos capacités dans cinq domaines : la création, la conception, la production, le contrôle et la sécurité. Concrètement, cela signifie qu'une équipe de 4 personnes peut aujourd'hui livrer, vérifier et sécuriser un volume de travail qui aurait nécessité une équipe bien plus grande il y a encore quelques années.",
]

const VALUES = [
  { key: 'simplicite', title: 'Simplicité', desc: "Des solutions simples et efficaces, sans complexité inutile. Si c'est compliqué à expliquer, c'est qu'on n'a pas encore trouvé la bonne solution." },
  { key: 'rapidite', title: "Rapidité d'exécution", desc: "De l'idée au logiciel qui tourne, en semaines, pas en mois. On avance étape par étape, avec vérification à chaque jalon." },
  { key: 'innovation', title: 'Innovation', desc: 'Toujours à la pointe des technologies' },
  { key: 'proximity', title: 'Proximité', desc: 'Un accompagnement personnalisé' },
  { key: 'excellence', title: 'Excellence', desc: 'Des solutions de qualité supérieure' },
  { key: 'transparence', title: 'Transparence', desc: 'Un discours clair, sans jargon technique ni coûts cachés. Vous savez toujours où en est votre projet.' },
]

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="Notre histoire | NewAppAI"
        description="Depuis l'arrivée de l'IA, nous nous sommes formés et nous comptons parmi les premiers à en maîtriser le sujet. Découvrez l'équipe NewAppAI."
        ogUrl="https://newappai.com/about"
      />
      <Header />

      <main className="min-h-screen bg-[#000000] overflow-x-hidden">
        <AppleHero
          title="Notre Histoire"
          subtitle="Une passion pour l'innovation, une mission pour votre réussite."
          titleDataSection="about-title"
          subtitleDataSection="about-subtitle"
        />

        <AppleSection variant="light">
          <div className="max-w-[720px] mx-auto text-left">
            <h2 className="apple-title mb-8 text-center">Notre histoire</h2>
            {NOTRE_HISTOIRE.map((paragraph, i) => (
              <p key={i} data-section={`about-notre-histoire-${i}`} className="text-[17px] leading-[1.47] text-black/80 mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </AppleSection>

        <AppleSection>
          <div className="max-w-[980px] mx-auto">
            <h2 data-section="about-values" className="apple-title text-center mb-16">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VALUES.map((value) => (
                <AppleCard key={value.key} padding="md" hover>
                  <h3 className="text-xl font-bold mb-3 text-[#f5f5f7]">
                    <span data-section={`about-${value.key}-title`}>{value.title}</span>
                  </h3>
                  <p className="text-white/60 leading-relaxed font-normal">
                    <span data-section={`about-${value.key}-desc`}>{value.desc}</span>
                  </p>
                </AppleCard>
              ))}
            </div>
          </div>
        </AppleSection>
      </main>

      <Footer />
    </>
  )
}
