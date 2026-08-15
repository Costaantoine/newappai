/**
 * Construction du prompt de mission envoyé à Claude Code (CLI) sur le VPS
 * pour générer le site one-page final du client. Exécuté depuis le dossier
 * de travail du job (cwd = /root/vitrine-jobs/<jobId>/) — les chemins
 * relatifs ci-dessous (site/, assets/) pointent donc dans ce dossier.
 */

import type { SiteConfig } from '@/components/webdesign/types'
import type { ImportSummary } from './importSocial'

const REFERENCE_DIR = '/root/vitrine-ref/webolharosol/webolharosol.newappai.com/'

const LANGUAGE_LABELS: Record<string, string> = {
  fr: 'français',
  pt: 'português',
  en: 'english',
  es: 'español',
}

function formatServices(config: SiteConfig): string {
  const filled = config.services.filter((s) => s.name.trim())
  if (filled.length === 0) {
    return "Aucune prestation renseignée par le client. Génère 3-5 prestations génériques et cohérentes avec le secteur \"" +
      config.business.sector + "\", SANS AUCUN PRIX (contenu marketing uniquement, jamais de tarif inventé)."
  }
  return filled
    .map((s) => {
      const price = s.price.trim() ? ` — ${s.price.trim()}` : ' — prix non communiqué (ne pas en inventer un)'
      const desc = s.description.trim() ? ` : ${s.description.trim()}` : ''
      return `- ${s.name.trim()}${price}${desc}`
    })
    .join('\n')
}

function formatContact(config: SiteConfig): string {
  const c = config.contact
  const digits = c.phone.replace(/[^0-9]/g, '')
  const lines: string[] = []

  lines.push(
    c.phone.trim()
      ? `- Téléphone / WhatsApp : ${c.phone.trim()} → lien WhatsApp obligatoire : https://wa.me/${digits}`
      : '- Téléphone/WhatsApp : NON RENSEIGNÉ. Aucun bouton WhatsApp fonctionnel possible : masque le bouton flottant WhatsApp ou remplace par un lien mailto si un email existe.'
  )
  lines.push(
    c.email.trim()
      ? `- Email : ${c.email.trim()}`
      : '- Email : non renseigné → masquer tout lien/mention email.'
  )
  lines.push(
    c.instagram.trim()
      ? `- Instagram : ${c.instagram.trim()}`
      : '- Instagram : non renseigné → masquer l\'icône Instagram (jamais de lien mort).'
  )
  lines.push(
    c.facebook.trim()
      ? `- Facebook : ${c.facebook.trim()}`
      : '- Facebook : non renseigné → masquer l\'icône Facebook (jamais de lien mort).'
  )
  lines.push(
    c.address.trim()
      ? `- Adresse : ${c.address.trim()} → intègre une carte (Google Maps embed iframe, ou lien "Voir sur Google Maps") pointant vers cette adresse.`
      : '- Adresse : NON RENSEIGNÉE → ne construis PAS de section carte/adresse.'
  )
  lines.push(
    c.hours.trim()
      ? `- Horaires : ${c.hours.trim()}`
      : '- Horaires : NON RENSEIGNÉS → INTERDIT d\'inventer des horaires par défaut. Masque entièrement la section horaires.'
  )
  return lines.join('\n')
}

function formatGallery(config: SiteConfig): string {
  if (config.gallery.length === 0) {
    return 'Aucune photo fournie par le client. Utilise des images libres de droits (Unsplash) pertinentes pour le secteur, ou des placeholders élégants (dégradés/motifs) — jamais de cadre vide ou cassé.'
  }
  return `${config.gallery.length} photo(s)/vidéo(s) fournies par le client, disponibles dans le dossier ./assets/ (à la racine de ce job). Liste le dossier (ls assets/) et utilise CES fichiers réels pour la galerie et le hero — ne les remplace par des images génériques que si le dossier est vide ou illisible.`
}

function formatLogo(config: SiteConfig): string {
  if (config.business.logo) {
    return 'Le client a fourni un logo, présent dans ./assets/ (fichier logo, à identifier dans le dossier) — utilise-le tel quel comme logo et comme base du favicon.'
  }
  return "Aucun logo fourni. Crée un monogramme (initiales du nom de l'entreprise) en SVG, aux couleurs du client, à utiliser comme logo et comme favicon."
}

function formatDesign(config: SiteConfig): string {
  const custom = config.design.customColor?.trim()
  if (custom) {
    return `Code couleur du client (PRIORITAIRE, à utiliser comme couleur d'accent principale du site, remplaçant l'accent violet/or de la référence) : ${custom}`
  }
  return `Aucun code couleur libre fourni par le client — garde une couleur d'accent proche de la référence webolharosol (ou choisis un accent cohérent avec le secteur "${config.business.sector}"), adaptée au style "${config.design.styleId}".`
}

export function buildMission(config: SiteConfig, importSummary?: ImportSummary | null): string {
  const language = config.language || 'fr'
  const languageLabel = LANGUAGE_LABELS[language] || language

  const importSection = importSummary
    ? `## CONTENU RÉEL IMPORTÉ DES RÉSEAUX SOCIAUX DU CLIENT (source de vérité)

Le dossier ./import/photos/ de ce job contient ${importSummary.photos} photo(s) réelle(s) du client (récupérées depuis ${importSummary.platform}), et ./import/textes.md contient sa bio et ses posts réels.

- Utilise CES photos comme visuels du site (galerie, sections, fonds) — prioritaires sur tout visuel générique.
- Utilise les TEXTES RÉELS (bio, captions) comme source du contenu marketing ; ne JAMAIS inventer d'information factuelle (règle 3) : horaires, prix, adresses, numéros viennent uniquement du client.
- Si ./import/photos/ est vide ou illisible, ignore-le et continue avec le contenu du formulaire.
- Règle 1bis toujours applicable : aucune marque étrangère (dont les logos/watermarks des plateformes sociales) ne doit apparaître sur le site.

`
    : ''

  return `Tu es un développeur web chargé de générer un site vitrine one-page STATIQUE pour un client, dans le cadre de l'outil "Vitrine" de newappai.

${importSection}## RÈGLE 1 — DESIGN DE RÉFÉRENCE OBLIGATOIRE

Le design du site à produire DOIT reproduire la structure, les sections, le header, le hero, le footer et les styles de la référence suivante, disponible en local sur ce VPS :

  ${REFERENCE_DIR}

Lis OBLIGATOIREMENT en entier :
  - ${REFERENCE_DIR}index.html
  - tous les fichiers CSS dans ${REFERENCE_DIR}_astro/
  - les images dans ${REFERENCE_DIR}images/ (pour comprendre le style visuel, pas pour les copier telles quelles dans le site du client)

Adapte ensuite cette structure et ce style au secteur d'activité du client ("${config.business.sector}") : garde l'ossature (header sticky, hero plein écran, sections services/galerie/contact/footer, animations, typographie), mais adapte les textes, les couleurs et les images au client.

## RÈGLE 1bis — MARQUE DU SITE (NE JAMAIS COPIER LA MARQUE DE LA RÉFÉRENCE)

La référence webolharosol sert UNIQUEMENT d'exemple de structure et de style. Ne copie JAMAIS sa marque : pas le logo logo-ds.png, pas de badge "DigiSmart"/"Developed by DigiSmart", pas de textes de marque DigiSmart. Le site du client est un produit newappai : le seul badge autorisé est « DEVELOPED BY NEWAPPAI » en footer (avec un lien vers https://newappai.com si un lien est demandé).

## RÈGLE 2 — SITE STATIQUE, SANS FRAMEWORK

Le site final est un site one-page 100% STATIQUE : HTML/CSS/JS pur, sans framework, sans étape de build (comme la référence /root/filipac-ref sur ce VPS). Un seul fichier HTML principal + assets.

Fichier à produire : ./site/index.html (chemin relatif au dossier courant de ce job) + un dossier ./site/assets/ pour les images/vidéos utilisées dans le rendu final.

## RÈGLE 3 — INTERDICTION DE RÉUTILISER UN TEMPLATE EXISTANT

N'utilise ET NE COPIE JAMAIS le template codé en dur "generateSite" (ou tout autre template pré-fait) qui existe ailleurs dans les projets newappai. Ce template sert UNIQUEMENT à un aperçu provisoire instantané côté client, jamais à la livraison finale. Le design vient UNIQUEMENT de la référence webolharosol (règle 1).

## INFOS CLIENT

**Entreprise**
- Nom : ${config.business.name || '(non renseigné — à ne jamais laisser vide dans le rendu, utilise un nom générique cohérent avec le secteur si vraiment absent)'}
- Secteur : ${config.business.sector}
- Description : ${config.business.description.trim() || `NON RENSEIGNÉE → génère un texte marketing d'accueil (2-3 phrases) à partir du nom et du secteur, du type "Bienvenue chez ${config.business.name || '[nom]'}, votre ${config.business.sector} de confiance...". Contenu marketing uniquement, aucun fait inventé (pas d'adresse, pas d'horaires, pas de chiffres).`}
${config.business.website ? `- Site existant du client (informatif uniquement, NE PAS scraper son contenu, juste pour contexte) : ${config.business.website}` : ''}

**Prestations**
${formatServices(config)}

**Contact**
${formatContact(config)}

**Langue**
Le site doit être ENTIÈREMENT rédigé en ${languageLabel} (code langue : ${language}). Tous les textes, boutons, labels — y compris les substitutions générées automatiquement — doivent être dans cette langue.

**Photos / vidéos**
${formatGallery(config)}

**Logo**
${formatLogo(config)}

**Code couleur**
${formatDesign(config)}

## RÈGLES DE SUBSTITUTION (STRICTES — jamais d'invention factuelle)

JAMAIS d'information factuelle inventée : horaires, prix, tarifs, menu, adresse, numéros. Si une info importante est absente, applique EXACTEMENT ces règles :
- Champ vide en général → masquer la section correspondante, OU la remplacer par un CTA honnête vers WhatsApp (ex. "Contactez-nous pour en savoir plus" avec le lien WhatsApp du client s'il existe).
- Description vide → texte marketing généré depuis le nom + le secteur (jamais de fait inventé).
- Pas de photo → images Unsplash pertinentes pour le secteur, ou placeholders élégants (jamais d'image cassée).
- Pas de logo → monogramme (initiales) aux couleurs du client.
- Réseaux sociaux vides → icônes correspondantes masquées (jamais de lien mort ou vers "#").
- Horaires/prix/menu absents → jamais de valeur par défaut inventée : section masquée ou CTA WhatsApp.

## EXIGENCES TECHNIQUES

1. Bouton WhatsApp flottant (si un numéro de téléphone/WhatsApp est fourni — voir règles de substitution sinon).
2. Badge « DEVELOPED BY NEWAPPAI » visible dans le footer.
3. Site entièrement rédigé en ${languageLabel}.
4. Meta SEO : balises <title> et <meta name="description"> pertinentes pour le secteur et le nom du client.
5. Favicon (basé sur le logo ou le monogramme généré).
6. Responsive (mobile + desktop), fidèle au niveau de qualité de la référence webolharosol.

## LIVRABLE

Le site final complet doit se trouver dans : ./site/index.html + ./site/assets/ (dossier relatif au répertoire courant de ce job). Crée ces dossiers s'ils n'existent pas.

## CHECKLIST FINALE OBLIGATOIRE

Termine ta réponse par une checklist explicite confirmant chacun des points suivants (réponds par oui/non pour chaque ligne, et corrige avant de conclure si un point est "non") :
- [ ] Badge "DEVELOPED BY NEWAPPAI" présent en footer
- [ ] Code couleur du client appliqué (ou accent cohérent si non fourni)
- [ ] Contacts réels du client utilisés (pas d'exemple générique)
- [ ] Site rédigé dans la langue demandée (${languageLabel})
- [ ] Bouton WhatsApp présent (si numéro fourni)
- [ ] Design basé sur la référence webolharosol (règle 1), et PAS sur le template generateSite (règle 3)
- [ ] Aucune information factuelle inventée (horaires, prix, adresse)
- [ ] ./site/index.html existe et s'ouvre correctement
`
}
