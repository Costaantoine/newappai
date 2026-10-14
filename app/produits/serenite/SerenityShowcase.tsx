'use client'

// Page produit Serenity — portage fidèle de vitrine-serenity.newappai.com
// (/home/ccuser/serenity-vitrine/site/index.html sur DEV). Les écrans montrent
// une famille fictive (Alice, Bob, Emma, Léo).

import { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cartContext'
import { getCartIdForSlug, getCatalogPrice } from '@/lib/productPrices'
import { getStaticProductImage } from '@/lib/productImages'
import ProduitVisuel from '@/components/ProduitVisuel'

const APP_URL = 'https://serenity.newappai.com/'
const MEDIA = '/produits/serenite'

// Même article que l'ancienne fiche /produits/[slug] (id et prix du catalogue).
const SERENITY_CART_ID = getCartIdForSlug('serenite')
export const SERENITY_CART_ITEM = {
  id: SERENITY_CART_ID,
  title: 'Serenity',
  price: getCatalogPrice(SERENITY_CART_ID) as number,
  image: getStaticProductImage('serenite'),
}

const MESSAGE_TENDU = 'Tu es <span class="mot-tendu">ENCORE</span> en retard ! C’est <span class="mot-tendu">toujours</span> pareil avec toi, Emma t’a attendu 20 minutes.'
const MESSAGE_CALME = 'Je me sens inquiète : Emma t’a attendu 20 minutes à la sortie. Pourrais-tu me prévenir quand tu as un empêchement, pour qu’on trouve une solution ensemble ?'

const MODULES = [
  { img: 'm-accueil.webp', alt: 'Accueil avec raccourcis et note Serenity', titre: 'Accueil', texte: 'Vos raccourcis, rangés comme vous voulez' },
  { img: 'm-agenda.webp', alt: 'Agenda familial du mois avec les gardes', titre: 'Agenda', texte: 'Activités, rendez-vous et gardes' },
  { img: 'm-messages.webp', alt: 'Fil de messages entre Alice et Bob', titre: 'Messages', texte: 'Des échanges posés, même tendus' },
  { img: 'm-finances.webp', alt: 'Résumé des dépenses du mois', titre: 'Finances', texte: 'Qui a payé, qui doit combien' },
  { img: 'm-famille.webp', alt: 'Fiche famille avec parents et enfants', titre: 'Famille', texte: 'Parents, enfants, proches' },
  { img: 'm-bebe.webp', alt: 'Suivi de bébé : repas, couches, sommeil', titre: 'Bébé', texte: 'Repas, couches, sommeil' },
  { img: 'm-grossesse.webp', alt: 'Préparer l’arrivée de bébé', titre: 'Grossesse', texte: 'Rendez-vous, valise, démarches' },
  { img: 'm-enfant.jpg', alt: 'Espace enfant avec appel des parents et humeur du jour', titre: 'Espace enfant', texte: 'Appeler papa ou maman, dire comment il va' },
  { img: 'm-modules.webp', alt: 'Choix des modules affichés', titre: 'À la carte', texte: 'Vous gardez seulement ce qui vous sert' },
]

const CARTES = [
  { icone: 'cles', titre: 'À la carte', texte: 'Gardez seulement les espaces utiles : école, courses et repas, animaux, personnes à charge, documents…' },
  { icone: 'langues', titre: 'En quatre langues', texte: 'Français, anglais, espagnol et portugais. Chacun lit l’application dans sa langue.' },
  { icone: 'ecran', titre: 'Téléphone et ordinateur', texte: 'La même application sur le téléphone et sur grand écran, en thème clair ou sombre.' },
  { icone: 'cadenas', titre: 'Accès protégé', texte: 'Connexion par code PIN, documents privés ou partagés selon votre choix.' },
  { icone: 'coeur', titre: 'Un espace pour les enfants', texte: 'Appeler un parent, écrire un message, dire comment ils se sentent, vérifier leur sac.' },
  { icone: 'tel', titre: 'Les numéros d’aide à portée', texte: 'Les lignes d’écoute et d’urgence pour parents et enfants, toujours accessibles dans l’application.' },
]

const Icone = ({ nom }: { nom: string }) => <svg aria-hidden="true"><use href={`#i-${nom}`} /></svg>

function Point({ titre, children }: { titre: string; children: React.ReactNode }) {
  return <li><Icone nom="ok" /><div><strong>{titre}</strong>{children}</div></li>
}

function Telephone({ id, nom, label, autoplay = false }: { id: string; nom: string; label: string; autoplay?: boolean }) {
  return (
    <div className="tel">
      <video id={id} src={`${MEDIA}/videos/${nom}.mp4`} poster={`${MEDIA}/videos/${nom}-poster.jpg`} muted playsInline loop
        autoPlay={autoplay} preload={autoplay ? 'metadata' : 'none'} aria-label={label} />
      <button className="lecture" data-video={id} aria-label={autoplay ? 'Mettre en pause la vidéo' : 'Lire la vidéo'}>
        <Icone nom={autoplay ? 'pause' : 'play'} />
      </button>
    </div>
  )
}

function BoutonPanier() {
  const { items, addItem } = useCart()
  const dejaAjoute = items.some((item) => item.id === SERENITY_CART_ID)
  return (
    <div className="panier flottant">
      <button type="button" className="btn btn-panier" onClick={() => addItem(SERENITY_CART_ITEM)}>
        <Icone nom={dejaAjoute ? 'ok' : 'panier'} />{dejaAjoute ? 'Ajouter au panier (+1)' : 'Ajouter au panier'}
      </button>
      {dejaAjoute && <a className="voir-panier" href="/panier">Voir le panier <Icone nom="fleche" /></a>}
    </div>
  )
}

// Les téléphones défilent seuls, en boucle : la série est rendue deux fois
// et le rail recule de la moitié de sa largeur (voir .rail dans serenity.css).
function BandeModules() {
  const [enPause, setEnPause] = useState(false)
  const serie = (copie: boolean) => MODULES.map((m) => (
    <figure key={`${copie ? 'copie-' : ''}${m.titre}`} aria-hidden={copie ? 'true' : undefined}>
      <div className="tel petit"><img src={`${MEDIA}/shots/${m.img}`} alt={copie ? '' : m.alt} loading="lazy" /></div>
      <figcaption>{m.titre}<span>{m.texte}</span></figcaption>
    </figure>
  ))
  return (
    <>
      <div className="defile-controles">
        <button type="button" className="btn btn-clair defile-pause" aria-pressed={enPause} onClick={() => setEnPause((p) => !p)}>
          <Icone nom={enPause ? 'play' : 'pause'} />{enPause ? 'Lecture' : 'Pause'}
        </button>
      </div>
      <div className={`bande${enPause ? ' en-pause' : ''}`} aria-label="Aperçu des espaces de l’application">
        <div className="rail">{serie(false)}{serie(true)}</div>
      </div>
    </>
  )
}

const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Le message qui s'apaise (signature du héros)
function useReecriture(racine: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const boite = racine.current?.querySelector<HTMLElement>('#reecriture')
    const bulle = racine.current?.querySelector<HTMLElement>('#bulle')
    const etat = racine.current?.querySelector<HTMLElement>('#etat')
    const etiquette = racine.current?.querySelector<HTMLElement>('#etiquette')
    if (!boite || !bulle || !etat || !etiquette) return
    const calmeMode = matchMedia('(prefers-reduced-motion: reduce)').matches
    let actif = true

    async function taper(texte: string, vitesse: number) {
      if (calmeMode) { bulle!.textContent = texte; return }
      for (let i = 1; i <= texte.length && actif; i++) {
        bulle!.innerHTML = texte.slice(0, i) + '<span class="curseur"></span>'
        await attendre(vitesse)
      }
      if (actif) bulle!.textContent = texte
    }
    async function cycle() {
      while (actif) {
        boite!.classList.remove('apaisee'); etat!.textContent = 'Brouillon'; etiquette!.textContent = 'Ton tendu'
        bulle!.innerHTML = MESSAGE_TENDU; await attendre(3400); if (!actif) return
        etat!.textContent = 'Serenity propose…'; await attendre(900); if (!actif) return
        boite!.classList.add('apaisee'); etiquette!.textContent = 'Apaisé'
        await taper(MESSAGE_CALME, 26); if (!actif) return
        etat!.textContent = 'Version apaisée prête à envoyer'; await attendre(5200)
        if (calmeMode) return
      }
    }
    cycle()
    return () => { actif = false }
  }, [racine])
}

// Vidéos lues quand elles sont visibles + bouton lecture/pause ; apparition au défilement
function useVideosEtApparitions(racine: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = racine.current
    if (!el) return
    const nettoyages: (() => void)[] = []

    el.querySelectorAll<HTMLButtonElement>('.lecture').forEach((b) => {
      const v = el.querySelector<HTMLVideoElement>(`#${b.dataset.video}`)
      if (!v) return
      const maj = () => {
        b.innerHTML = `<svg><use href="#i-${v.paused ? 'play' : 'pause'}"/></svg>`
        b.setAttribute('aria-label', v.paused ? 'Lire la vidéo' : 'Mettre en pause la vidéo')
      }
      const clic = () => { v.dataset.manuel = '1'; if (v.paused) v.play().catch(() => {}); else v.pause() }
      b.addEventListener('click', clic); v.addEventListener('play', maj); v.addEventListener('pause', maj)
      nettoyages.push(() => { b.removeEventListener('click', clic); v.removeEventListener('play', maj); v.removeEventListener('pause', maj) })
    })

    const videos = el.querySelectorAll<HTMLVideoElement>('video')
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const vo = new IntersectionObserver((es) => es.forEach((e) => {
        const v = e.target as HTMLVideoElement
        if (v.dataset.manuel) return
        if (e.isIntersecting) v.play().catch(() => {}); else v.pause()
      }), { threshold: 0.45 })
      videos.forEach((v) => vo.observe(v))
      nettoyages.push(() => vo.disconnect())
    } else {
      videos.forEach((v) => { v.removeAttribute('autoplay'); v.pause() })
    }

    const ao = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('vu'); ao.unobserve(e.target) }
    }), { threshold: 0.12 })
    el.querySelectorAll('section.bloc .wrap > *, .final .wrap > *').forEach((x) => { x.classList.add('apparait'); ao.observe(x) })
    nettoyages.push(() => ao.disconnect())

    return () => nettoyages.forEach((n) => n())
  }, [racine])
}

// Mode présentation : plein écran, une section par écran, flèches du clavier
function usePresentation(racine: React.RefObject<HTMLDivElement | null>, actif: boolean, quitter: () => void) {
  const [compteur, setCompteur] = useState('')
  useEffect(() => {
    const el = racine.current
    if (!el) return
    const diapos = Array.from(el.querySelectorAll<HTMLElement>('.diapo'))
    const courante = () => { let k = 0; diapos.forEach((d, i) => { if (d.getBoundingClientRect().top <= innerHeight * 0.4) k = i }); return k }
    const aller = (i: number) => diapos[Math.max(0, Math.min(diapos.length - 1, i))].scrollIntoView({ behavior: 'smooth' })
    const majCompteur = () => setCompteur(`${courante() + 1} / ${diapos.length} · Échap pour quitter`)

    if (!actif) { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); return }
    document.documentElement.requestFullscreen?.().catch(() => {})
    aller(courante()); majCompteur()

    const surPleinEcran = () => { if (!document.fullscreenElement) quitter() }
    const surDefilement = () => majCompteur()
    const surTouche = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); aller(courante() + 1) }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); aller(courante() - 1) }
      if (e.key === 'Escape') quitter()
    }
    document.addEventListener('fullscreenchange', surPleinEcran)
    addEventListener('scroll', surDefilement, { passive: true })
    addEventListener('keydown', surTouche)
    return () => {
      document.removeEventListener('fullscreenchange', surPleinEcran)
      removeEventListener('scroll', surDefilement)
      removeEventListener('keydown', surTouche)
    }
  }, [racine, actif, quitter])
  return compteur
}

export default function SerenityShowcase({ className = '' }: { className?: string }) {
  const racine = useRef<HTMLDivElement>(null)
  const [modePres, setModePres] = useState(false)
  const [quitter] = useState(() => () => setModePres(false))
  useReecriture(racine)
  useVideosEtApparitions(racine)
  const compteur = usePresentation(racine, modePres, quitter)

  return (
    <>
    {/* Barre de navigation du site, hors de .sv pour garder ses propres styles */}
    <Header />
    <div ref={racine} className={`sv ${modePres ? 'mode-pres' : ''} ${className}`}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="i-ok" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" /></symbol>
        <symbol id="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.5v13l11-6.5z" /></symbol>
        <symbol id="i-pause" viewBox="0 0 24 24"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></symbol>
        <symbol id="i-fleche" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" /></symbol>
        <symbol id="i-ecran" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v11H4zM9 20h6M12 16v4" /></symbol>
        <symbol id="i-cadenas" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" /></symbol>
        <symbol id="i-langues" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 5h10M8 3v2m3 0c-1 4-4 7-7 8m2-4c1.5 2 3.5 3.5 6 4M13 21l4-9 4 9m-6.5-3h5" /></symbol>
        <symbol id="i-cles" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" /></symbol>
        <symbol id="i-coeur" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></symbol>
        <symbol id="i-panier" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 11h10.2L20 8H6.2M10 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /></symbol>
        <symbol id="i-tel" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></symbol>
      </svg>

      <header className="top">
        <div className="wrap">
          <a className="logo" href="#accueil" aria-label="Serenity, retour en haut">
            <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#dcebfa" /><path d="M7 18c4-1 6-4 9-8 1 3 0 6-2 8 3 0 6-1 9-4-1 5-5 9-11 9-2 0-4-1-5-2" fill="none" stroke="#12304f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Serenity
          </a>
          <nav aria-label="Sections">
            <a href="#modules">Fonctionnalités</a>
            <a href="#messages">Messages apaisés</a>
            <a href="#depenses">Dépenses</a>
            <a href="#bebe">Bébé</a>
          </nav>
          <a className="btn btn-plein" href={APP_URL}>Essayer<span className="long">&nbsp;gratuitement</span></a>
        </div>
      </header>

      <main id="accueil">
        {/* Héros */}
        <section className="hero diapo">
          <div className="wrap">
            <div>
              <p className="sur-titre">Application d’organisation familiale</p>
              <h1>La vie de famille, <em>en plus calme.</em></h1>
              <p className="chapo">Agenda, messages, dépenses, papiers, suivi de bébé : tout ce qui fait tourner la maison, partagé au même endroit. Et quand le ton monte, Serenity vous aide à dire les choses autrement.</p>
              <div className="actions">
                <a className="btn btn-plein" href={APP_URL}>Essayer gratuitement <Icone nom="fleche" /></a>
                <a className="btn btn-clair" href="#messages">Voir comment ça marche</a>
              </div>
              <div className="reecriture" id="reecriture" aria-live="polite">
                <div className="entete"><span>Message d’Alice à Bob</span><span id="etat">Analyse Serenity…</span></div>
                <div className="bulle" id="bulle" />
                <div className="jauge" aria-hidden="true"><span>Tension</span><div className="piste"><div className="niveau" /></div><span className="etiquette" id="etiquette">Ton tendu</span></div>
              </div>
            </div>
            <Telephone id="v-accueil" nom="accueil" autoplay label="Démonstration : l’accueil, l’agenda, les messages et les finances de Serenity" />
          </div>
        </section>

        <ProduitVisuel src="/images/produits/serenite-photo-5940330148995469271.jpg" alt="Serenity : une famille qui organise son quotidien ensemble" legende="Quand le ton monte, Serenity vous aide à dire les choses autrement." police="var(--sv-font-display)" accent="#5fc79b" cadrage="52% 40%" priority />

        {/* Modules */}
        <section className="bloc ciel diapo" id="modules">
          <div className="wrap">
            <p className="sur-titre">Tout au même endroit</p>
            <h2>Une seule application pour toute la maison.</h2>
            <p className="intro">Onze espaces à activer selon votre famille. Chacun choisit ceux qu’il affiche : rien ne vous encombre, rien ne se perd.</p>
            <BandeModules />
          </div>
        </section>

        {/* Messages apaisés */}
        <section className="bloc nuit diapo" id="messages">
          <div className="wrap duo">
            <div>
              <p className="sur-titre">Messages apaisés</p>
              <h2>Le message part. La dispute, non.</h2>
              <p className="intro">Inspirée de la communication non violente, Serenity relit votre message avant l’envoi et vous propose une version plus posée. Vous restez libre de vos mots.</p>
              <ol className="etapes">
                <li><div><strong>Vous écrivez</strong>Comme vous le pensez, sur le moment.</div></li>
                <li><div><strong>Serenity propose</strong>Elle repère le ton tendu et suggère une formulation qui garde le fond.</div></li>
                <li><div><strong>Vous choisissez</strong>Envoyer la version apaisée, ou la vôtre. Si le ton est très vif, Serenity vous suggère une pause de quelques minutes.</div></li>
              </ol>
            </div>
            <div className="paire">
              <Telephone id="v-message" nom="message" label="Démonstration : un message tendu reformulé avant l’envoi" />
            </div>
          </div>
        </section>

        {/* Dépenses */}
        <section className="bloc diapo" id="depenses">
          <div className="wrap duo inverse">
            <div>
              <p className="sur-titre">Dépenses partagées</p>
              <h2>Des comptes clairs, au centime près.</h2>
              <p className="intro">Cantine, couches, cours de danse : chacun note ce qu’il paie, Serenity calcule la part de chacun et vous dit qui doit combien.</p>
              <ul className="liste-points">
                <Point titre="Votre répartition">50/50, 60/40 ou au prorata des revenus, modifiable à tout moment.</Point>
                <Point titre="Compte commun ou parents séparés">Pour les parents séparés, l’autre parent valide chaque dépense avant qu’elle compte.</Point>
                <Point titre="Dépenses qui reviennent">Abonnements, pension, cantine : programmées une fois, comptées chaque mois.</Point>
                <Point titre="À jour en direct">Une dépense ajoutée apparaît tout de suite chez l’autre parent.</Point>
              </ul>
            </div>
            <div className="paire">
              <Telephone id="v-depense" nom="depense" label="Démonstration : ajouter une dépense et voir le solde" />
            </div>
          </div>
        </section>

        {/* Agenda */}
        <section className="bloc ciel diapo" id="agenda">
          <div className="wrap duo">
            <div>
              <p className="sur-titre">Agenda familial</p>
              <h2>Qui récupère Emma mercredi ?</h2>
              <p className="intro">Les activités, les rendez-vous médicaux, les vacances scolaires et les semaines de garde sur un même calendrier, avec une couleur par personne.</p>
              <ul className="liste-points">
                <Point titre="Un responsable par événement">On sait qui accompagne, sans se relancer.</Point>
                <Point titre="Le planning de garde">Chez papa, chez maman : visible d’un coup d’œil, enfant par enfant.</Point>
              </ul>
            </div>
            <img className="ecran-large" src={`${MEDIA}/shots/d-agenda.webp`} alt="Agenda Serenity sur ordinateur" loading="lazy" />
          </div>
        </section>

        {/* Bébé & grossesse */}
        <section className="bloc diapo" id="bebe">
          <div className="wrap duo inverse">
            <div>
              <p className="sur-titre">Bébé et grossesse</p>
              <h2>Les premiers mois, à deux et sans carnet.</h2>
              <p className="intro">Biberons, couches, siestes : notés en deux gestes et visibles par les deux parents. Graphiques de la semaine, conseils pratiques, vaccins. Et avant la naissance : rendez-vous, valise de maternité, achats et démarches.</p>
              <ul className="liste-points">
                <Point titre="La journée de bébé d’un coup d’œil">Dernier repas, durée de sommeil, nombre de couches.</Point>
                <Point titre="Préparer l’arrivée">Listes prêtes à cocher, à adapter à votre situation.</Point>
              </ul>
            </div>
            <div className="paire">
              <Telephone id="v-bebe" nom="bebe" label="Démonstration : suivi de bébé et préparation de la naissance" />
              <div className="tel petit"><img src={`${MEDIA}/shots/m-bebe-graph.webp`} alt="Graphique des repas de bébé sur la semaine" loading="lazy" /></div>
            </div>
          </div>
        </section>

        {/* Pour toutes les familles */}
        <section className="bloc ciel diapo" id="pour-vous">
          <div className="wrap">
            <p className="sur-titre">Pensée pour chaque famille</p>
            <h2>Ensemble ou séparés, avec ou sans enfants petits.</h2>
            <div className="cartes">
              {CARTES.map((c) => (
                <div className="carte" key={c.titre}><Icone nom={c.icone} /><h3>{c.titre}</h3><p>{c.texte}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* Appel final */}
        <section className="final diapo" id="essai">
          <div className="wrap">
            <p className="sur-titre">Essai gratuit</p>
            <h2>Essayez Serenity avec votre famille.</h2>
            <p className="intro">Créez votre espace, invitez l’autre parent, et voyez la différence dès la première semaine.</p>
            <div className="actions">
              <a className="btn btn-plein" href={APP_URL}>Créer mon espace famille <Icone nom="fleche" /></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap"><span>© 2026 Serenity</span><span>Les écrans présentés utilisent une famille fictive.</span></div>
      </footer>

      {!modePres && <BoutonPanier />}
      <button className="btn btn-plein presentation" onClick={() => setModePres((on) => !on)}>
        <Icone nom="ecran" /><span>{modePres ? 'Quitter la présentation' : 'Mode présentation'}</span>
      </button>
      <div className="compteur" aria-live="polite">{modePres ? compteur : ''}</div>
    </div>
    {!modePres && <Footer />}
    </>
  )
}
