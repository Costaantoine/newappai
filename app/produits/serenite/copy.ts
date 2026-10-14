import type { Copy } from '@/lib/produitCopy'

// Textes de la fiche Serenity, en 4 langues.

export interface SerenityCopy {
  meta: { title: string; description: string; ogDescription: string }
  nav: { sections: string; fonctionnalites: string; messages: string; depenses: string; bebe: string; essayer: string; gratuitement: string; logoLabel: string }
  hero: {
    surTitre: string; titreDebut: string; titreFin: string; chapo: string
    essayer: string; voir: string
    reecritureDe: string; analyse: string; tension: string
    video: string
  }
  reecriture: { brouillon: string; tendu: string; propose: string; apaise: string; prete: string; messageTendu: string; messageCalme: string }
  modules: {
    surTitre: string; titre: string; intro: string; apercu: string
    items: { alt: string; titre: string; texte: string }[]
    pause: string; lecture: string
  }
  messages: {
    surTitre: string; titre: string; intro: string
    etapes: { titre: string; texte: string }[]
    video: string
  }
  depenses: {
    surTitre: string; titre: string; intro: string
    points: { titre: string; texte: string }[]
    video: string
  }
  agenda: {
    surTitre: string; titre: string; intro: string
    points: { titre: string; texte: string }[]
    alt: string
  }
  bebe: {
    surTitre: string; titre: string; intro: string
    points: { titre: string; texte: string }[]
    video: string; graphAlt: string
  }
  cartes: { surTitre: string; titre: string; items: { titre: string; texte: string }[] }
  final: { surTitre: string; titre: string; intro: string; bouton: string }
  pied: { droits: string; fictive: string }
  panier: { ajouter: string; ajouterPlus: string; voir: string }
  video: { lire: string; pause: string }
  presentation: { mode: string; quitter: string; compteur: (i: number, n: number) => string }
}

export const SERENITY_COPY: Copy<SerenityCopy> = {
  fr: {
    meta: {
      title: 'Serenity — la vie de famille, en plus calme',
      description: 'Serenity réunit l’agenda, les messages, les dépenses, le suivi de bébé et tous les papiers de la famille dans une seule application. Ses messages apaisés aident à se parler sans s’emporter.',
      ogDescription: 'Agenda partagé, messages apaisés, dépenses claires, suivi de bébé : toute la famille au même endroit.',
    },
    nav: { sections: 'Sections', fonctionnalites: 'Fonctionnalités', messages: 'Messages apaisés', depenses: 'Dépenses', bebe: 'Bébé', essayer: 'Essayer', gratuitement: ' gratuitement', logoLabel: 'Serenity, retour en haut' },
    hero: {
      surTitre: 'Application d’organisation familiale',
      titreDebut: 'La vie de famille, ', titreFin: 'en plus calme.',
      chapo: 'Agenda, messages, dépenses, papiers, suivi de bébé : tout ce qui fait tourner la maison, partagé au même endroit. Et quand le ton monte, Serenity vous aide à dire les choses autrement.',
      essayer: 'Essayer gratuitement', voir: 'Voir comment ça marche',
      reecritureDe: 'Message d’Alice à Bob', analyse: 'Analyse Serenity…', tension: 'Tension',
      video: 'Démonstration : l’accueil, l’agenda, les messages et les finances de Serenity',
    },
    reecriture: {
      brouillon: 'Brouillon', tendu: 'Ton tendu', propose: 'Serenity propose…', apaise: 'Apaisé', prete: 'Version apaisée prête à envoyer',
      messageTendu: 'Tu es <span class="mot-tendu">ENCORE</span> en retard ! C’est <span class="mot-tendu">toujours</span> pareil avec toi, Emma t’a attendu 20 minutes.',
      messageCalme: 'Je me sens inquiète : Emma t’a attendu 20 minutes à la sortie. Pourrais-tu me prévenir quand tu as un empêchement, pour qu’on trouve une solution ensemble ?',
    },
    modules: {
      surTitre: 'Tout au même endroit', titre: 'Une seule application pour toute la maison.',
      intro: 'Onze espaces à activer selon votre famille. Chacun choisit ceux qu’il affiche : rien ne vous encombre, rien ne se perd.',
      apercu: 'Aperçu des espaces de l’application', pause: 'Pause', lecture: 'Lecture',
      items: [
        { alt: 'Accueil avec raccourcis et note Serenity', titre: 'Accueil', texte: 'Vos raccourcis, rangés comme vous voulez' },
        { alt: 'Agenda familial du mois avec les gardes', titre: 'Agenda', texte: 'Activités, rendez-vous et gardes' },
        { alt: 'Fil de messages entre Alice et Bob', titre: 'Messages', texte: 'Des échanges posés, même tendus' },
        { alt: 'Résumé des dépenses du mois', titre: 'Finances', texte: 'Qui a payé, qui doit combien' },
        { alt: 'Fiche famille avec parents et enfants', titre: 'Famille', texte: 'Parents, enfants, proches' },
        { alt: 'Suivi de bébé : repas, couches, sommeil', titre: 'Bébé', texte: 'Repas, couches, sommeil' },
        { alt: 'Préparer l’arrivée de bébé', titre: 'Grossesse', texte: 'Rendez-vous, valise, démarches' },
        { alt: 'Espace enfant avec appel des parents et humeur du jour', titre: 'Espace enfant', texte: 'Appeler papa ou maman, dire comment il va' },
        { alt: 'Choix des modules affichés', titre: 'À la carte', texte: 'Vous gardez seulement ce qui vous sert' },
      ],
    },
    messages: {
      surTitre: 'Messages apaisés', titre: 'Le message part. La dispute, non.',
      intro: 'Inspirée de la communication non violente, Serenity relit votre message avant l’envoi et vous propose une version plus posée. Vous restez libre de vos mots.',
      etapes: [
        { titre: 'Vous écrivez', texte: 'Comme vous le pensez, sur le moment.' },
        { titre: 'Serenity propose', texte: 'Elle repère le ton tendu et suggère une formulation qui garde le fond.' },
        { titre: 'Vous choisissez', texte: 'Envoyer la version apaisée, ou la vôtre. Si le ton est très vif, Serenity vous suggère une pause de quelques minutes.' },
      ],
      video: 'Démonstration : un message tendu reformulé avant l’envoi',
    },
    depenses: {
      surTitre: 'Dépenses partagées', titre: 'Des comptes clairs, au centime près.',
      intro: 'Cantine, couches, cours de danse : chacun note ce qu’il paie, Serenity calcule la part de chacun et vous dit qui doit combien.',
      points: [
        { titre: 'Votre répartition', texte: '50/50, 60/40 ou au prorata des revenus, modifiable à tout moment.' },
        { titre: 'Compte commun ou parents séparés', texte: 'Pour les parents séparés, l’autre parent valide chaque dépense avant qu’elle compte.' },
        { titre: 'Dépenses qui reviennent', texte: 'Abonnements, pension, cantine : programmées une fois, comptées chaque mois.' },
        { titre: 'À jour en direct', texte: 'Une dépense ajoutée apparaît tout de suite chez l’autre parent.' },
      ],
      video: 'Démonstration : ajouter une dépense et voir le solde',
    },
    agenda: {
      surTitre: 'Agenda familial', titre: 'Qui récupère Emma mercredi ?',
      intro: 'Les activités, les rendez-vous médicaux, les vacances scolaires et les semaines de garde sur un même calendrier, avec une couleur par personne.',
      points: [
        { titre: 'Un responsable par événement', texte: 'On sait qui accompagne, sans se relancer.' },
        { titre: 'Le planning de garde', texte: 'Chez papa, chez maman : visible d’un coup d’œil, enfant par enfant.' },
      ],
      alt: 'Agenda Serenity sur ordinateur',
    },
    bebe: {
      surTitre: 'Bébé et grossesse', titre: 'Les premiers mois, à deux et sans carnet.',
      intro: 'Biberons, couches, siestes : notés en deux gestes et visibles par les deux parents. Graphiques de la semaine, conseils pratiques, vaccins. Et avant la naissance : rendez-vous, valise de maternité, achats et démarches.',
      points: [
        { titre: 'La journée de bébé d’un coup d’œil', texte: 'Dernier repas, durée de sommeil, nombre de couches.' },
        { titre: 'Préparer l’arrivée', texte: 'Listes prêtes à cocher, à adapter à votre situation.' },
      ],
      video: 'Démonstration : suivi de bébé et préparation de la naissance',
      graphAlt: 'Graphique des repas de bébé sur la semaine',
    },
    cartes: {
      surTitre: 'Pensée pour chaque famille', titre: 'Ensemble ou séparés, avec ou sans enfants petits.',
      items: [
        { titre: 'À la carte', texte: 'Gardez seulement les espaces utiles : école, courses et repas, animaux, personnes à charge, documents…' },
        { titre: 'En quatre langues', texte: 'Français, anglais, espagnol et portugais. Chacun lit l’application dans sa langue.' },
        { titre: 'Téléphone et ordinateur', texte: 'La même application sur le téléphone et sur grand écran, en thème clair ou sombre.' },
        { titre: 'Accès protégé', texte: 'Connexion par code PIN, documents privés ou partagés selon votre choix.' },
        { titre: 'Un espace pour les enfants', texte: 'Appeler un parent, écrire un message, dire comment ils se sentent, vérifier leur sac.' },
        { titre: 'Les numéros d’aide à portée', texte: 'Les lignes d’écoute et d’urgence pour parents et enfants, toujours accessibles dans l’application.' },
      ],
    },
    final: { surTitre: 'Essai gratuit', titre: 'Essayez Serenity avec votre famille.', intro: 'Créez votre espace, invitez l’autre parent, et voyez la différence dès la première semaine.', bouton: 'Créer mon espace famille' },
    pied: { droits: '© 2026 Serenity', fictive: 'Les écrans présentés utilisent une famille fictive.' },
    panier: { ajouter: 'Ajouter au panier', ajouterPlus: 'Ajouter au panier (+1)', voir: 'Voir le panier' },
    video: { lire: 'Lire la vidéo', pause: 'Mettre en pause la vidéo' },
    presentation: { mode: 'Mode présentation', quitter: 'Quitter la présentation', compteur: (i, n) => `${i} / ${n} · Échap pour quitter` },
  },
  en: {
    meta: {
      title: 'Serenity — family life, a little calmer',
      description: 'Serenity brings the calendar, messages, expenses, baby tracking and all the family’s paperwork into a single app. Its calmer messages help you talk without flaring up.',
      ogDescription: 'Shared calendar, calmer messages, clear expenses, baby tracking: the whole family in one place.',
    },
    nav: { sections: 'Sections', fonctionnalites: 'Features', messages: 'Calmer messages', depenses: 'Expenses', bebe: 'Baby', essayer: 'Try', gratuitement: ' for free', logoLabel: 'Serenity, back to top' },
    hero: {
      surTitre: 'Family organisation app',
      titreDebut: 'Family life, ', titreFin: 'a little calmer.',
      chapo: 'Calendar, messages, expenses, paperwork, baby tracking: everything that keeps the household running, shared in one place. And when the tone rises, Serenity helps you say things differently.',
      essayer: 'Try for free', voir: 'See how it works',
      reecritureDe: 'Message from Alice to Bob', analyse: 'Serenity is analysing…', tension: 'Tension',
      video: 'Demo: Serenity’s home screen, calendar, messages and finances',
    },
    reecriture: {
      brouillon: 'Draft', tendu: 'Tense tone', propose: 'Serenity suggests…', apaise: 'Calmed', prete: 'Calmer version ready to send',
      messageTendu: 'You’re late <span class="mot-tendu">AGAIN</span>! It’s <span class="mot-tendu">always</span> the same with you, Emma waited 20 minutes for you.',
      messageCalme: 'I’m worried: Emma waited 20 minutes for you at the exit. Could you let me know when something comes up, so we can find a solution together?',
    },
    modules: {
      surTitre: 'Everything in one place', titre: 'One app for the whole household.',
      intro: 'Eleven spaces to switch on depending on your family. Each person chooses which ones to show: nothing clutters your screen, nothing gets lost.',
      apercu: 'Preview of the app’s spaces', pause: 'Pause', lecture: 'Play',
      items: [
        { alt: 'Home screen with shortcuts and a Serenity note', titre: 'Home', texte: 'Your shortcuts, arranged as you like' },
        { alt: 'Family calendar for the month with custody days', titre: 'Calendar', texte: 'Activities, appointments and custody days' },
        { alt: 'Message thread between Alice and Bob', titre: 'Messages', texte: 'Calm exchanges, even when tense' },
        { alt: 'Summary of the month’s expenses', titre: 'Finances', texte: 'Who paid, who owes how much' },
        { alt: 'Family sheet with parents and children', titre: 'Family', texte: 'Parents, children, relatives' },
        { alt: 'Baby tracking: meals, nappies, sleep', titre: 'Baby', texte: 'Meals, nappies, sleep' },
        { alt: 'Getting ready for the baby’s arrival', titre: 'Pregnancy', texte: 'Appointments, hospital bag, paperwork' },
        { alt: 'Child space with call to parents and mood of the day', titre: 'Kids’ space', texte: 'Call mum or dad, say how they feel' },
        { alt: 'Choice of displayed modules', titre: 'À la carte', texte: 'Keep only what’s useful to you' },
      ],
    },
    messages: {
      surTitre: 'Calmer messages', titre: 'The message goes. The argument doesn’t.',
      intro: 'Inspired by nonviolent communication, Serenity rereads your message before it is sent and suggests a calmer version. You stay free with your words.',
      etapes: [
        { titre: 'You write', texte: 'The way you think it, in the moment.' },
        { titre: 'Serenity suggests', texte: 'It spots the tense tone and suggests a wording that keeps the substance.' },
        { titre: 'You choose', texte: 'Send the calmer version, or your own. If the tone is very sharp, Serenity suggests a few minutes’ pause.' },
      ],
      video: 'Demo: a tense message reworded before sending',
    },
    depenses: {
      surTitre: 'Shared expenses', titre: 'Clear accounts, down to the cent.',
      intro: 'School lunches, nappies, dance classes: everyone logs what they pay, Serenity works out each person’s share and tells you who owes what.',
      points: [
        { titre: 'Your split', texte: '50/50, 60/40 or in proportion to income, editable at any time.' },
        { titre: 'Joint account or separated parents', texte: 'For separated parents, the other parent approves each expense before it counts.' },
        { titre: 'Recurring expenses', texte: 'Subscriptions, maintenance, school meals: set up once, counted every month.' },
        { titre: 'Live and up to date', texte: 'An added expense instantly appears for the other parent.' },
      ],
      video: 'Demo: adding an expense and checking the balance',
    },
    agenda: {
      surTitre: 'Family calendar', titre: 'Who’s picking up Emma on Wednesday?',
      intro: 'Activities, medical appointments, school holidays and custody weeks on a single calendar, with one colour per person.',
      points: [
        { titre: 'One person in charge per event', texte: 'Everyone knows who’s taking them, without chasing each other.' },
        { titre: 'The custody schedule', texte: 'At dad’s, at mum’s: visible at a glance, child by child.' },
      ],
      alt: 'Serenity calendar on a computer',
    },
    bebe: {
      surTitre: 'Baby and pregnancy', titre: 'The first months, together and without a notebook.',
      intro: 'Bottles, nappies, naps: logged in two taps and visible to both parents. Weekly charts, practical tips, vaccines. And before the birth: appointments, hospital bag, purchases and paperwork.',
      points: [
        { titre: 'Baby’s day at a glance', texte: 'Last feed, sleep duration, number of nappies.' },
        { titre: 'Getting ready for the arrival', texte: 'Ready-made checklists, adaptable to your situation.' },
      ],
      video: 'Demo: baby tracking and birth preparation',
      graphAlt: 'Chart of the baby’s feeds over the week',
    },
    cartes: {
      surTitre: 'Designed for every family', titre: 'Together or apart, with or without little ones.',
      items: [
        { titre: 'À la carte', texte: 'Keep only the useful spaces: school, shopping and meals, pets, dependants, documents…' },
        { titre: 'In four languages', texte: 'French, English, Spanish and Portuguese. Everyone reads the app in their own language.' },
        { titre: 'Phone and computer', texte: 'The same app on your phone and on a big screen, in light or dark theme.' },
        { titre: 'Protected access', texte: 'PIN code login, private or shared documents as you choose.' },
        { titre: 'A space for children', texte: 'Call a parent, write a message, say how they feel, check their bag.' },
        { titre: 'Help numbers within reach', texte: 'Listening and emergency lines for parents and children, always available in the app.' },
      ],
    },
    final: { surTitre: 'Free trial', titre: 'Try Serenity with your family.', intro: 'Create your space, invite the other parent, and see the difference from the first week.', bouton: 'Create my family space' },
    pied: { droits: '© 2026 Serenity', fictive: 'The screens shown use a fictional family.' },
    panier: { ajouter: 'Add to cart', ajouterPlus: 'Add to cart (+1)', voir: 'View cart' },
    video: { lire: 'Play video', pause: 'Pause video' },
    presentation: { mode: 'Presentation mode', quitter: 'Exit presentation', compteur: (i, n) => `${i} / ${n} · Esc to exit` },
  },
  pt: {
    meta: {
      title: 'Serenity — a vida em família, mais tranquila',
      description: 'A Serenity reúne a agenda, as mensagens, as despesas, o acompanhamento do bebé e todos os papéis da família numa única aplicação. As suas mensagens apaziguadas ajudam a falar sem se exaltar.',
      ogDescription: 'Agenda partilhada, mensagens apaziguadas, despesas claras, acompanhamento do bebé: toda a família no mesmo sítio.',
    },
    nav: { sections: 'Secções', fonctionnalites: 'Funcionalidades', messages: 'Mensagens apaziguadas', depenses: 'Despesas', bebe: 'Bebé', essayer: 'Experimentar', gratuitement: ' grátis', logoLabel: 'Serenity, voltar ao topo' },
    hero: {
      surTitre: 'Aplicação de organização familiar',
      titreDebut: 'A vida em família, ', titreFin: 'mais tranquila.',
      chapo: 'Agenda, mensagens, despesas, papéis, acompanhamento do bebé: tudo o que faz a casa funcionar, partilhado no mesmo sítio. E quando o tom sobe, a Serenity ajuda-o a dizer as coisas de outra forma.',
      essayer: 'Experimentar grátis', voir: 'Ver como funciona',
      reecritureDe: 'Mensagem da Alice para o Bob', analyse: 'Análise da Serenity…', tension: 'Tensão',
      video: 'Demonstração: o início, a agenda, as mensagens e as finanças da Serenity',
    },
    reecriture: {
      brouillon: 'Rascunho', tendu: 'Tom tenso', propose: 'A Serenity sugere…', apaise: 'Apaziguado', prete: 'Versão apaziguada pronta a enviar',
      messageTendu: 'Estás <span class="mot-tendu">OUTRA VEZ</span> atrasado! É <span class="mot-tendu">sempre</span> a mesma coisa contigo, a Emma esperou 20 minutos por ti.',
      messageCalme: 'Fico preocupada: a Emma esperou 20 minutos por ti à saída. Podias avisar-me quando tiveres um imprevisto, para encontrarmos uma solução juntos?',
    },
    modules: {
      surTitre: 'Tudo no mesmo sítio', titre: 'Uma única aplicação para toda a casa.',
      intro: 'Onze espaços para ativar consoante a sua família. Cada um escolhe os que mostra: nada atrapalha, nada se perde.',
      apercu: 'Pré-visualização dos espaços da aplicação', pause: 'Pausa', lecture: 'Reproduzir',
      items: [
        { alt: 'Início com atalhos e nota da Serenity', titre: 'Início', texte: 'Os seus atalhos, organizados como quiser' },
        { alt: 'Agenda familiar do mês com as guardas', titre: 'Agenda', texte: 'Atividades, consultas e guardas' },
        { alt: 'Conversa de mensagens entre a Alice e o Bob', titre: 'Mensagens', texte: 'Conversas calmas, mesmo quando tensas' },
        { alt: 'Resumo das despesas do mês', titre: 'Finanças', texte: 'Quem pagou, quem deve quanto' },
        { alt: 'Ficha da família com pais e filhos', titre: 'Família', texte: 'Pais, filhos, familiares' },
        { alt: 'Acompanhamento do bebé: refeições, fraldas, sono', titre: 'Bebé', texte: 'Refeições, fraldas, sono' },
        { alt: 'Preparar a chegada do bebé', titre: 'Gravidez', texte: 'Consultas, mala, burocracias' },
        { alt: 'Espaço da criança com chamada aos pais e humor do dia', titre: 'Espaço infantil', texte: 'Ligar ao pai ou à mãe, dizer como está' },
        { alt: 'Escolha dos módulos apresentados', titre: 'À la carte', texte: 'Fica só com o que lhe serve' },
      ],
    },
    messages: {
      surTitre: 'Mensagens apaziguadas', titre: 'A mensagem segue. A discussão, não.',
      intro: 'Inspirada na comunicação não violenta, a Serenity relê a sua mensagem antes do envio e propõe uma versão mais serena. Continua livre nas suas palavras.',
      etapes: [
        { titre: 'Escreve', texte: 'Como pensa, no momento.' },
        { titre: 'A Serenity sugere', texte: 'Deteta o tom tenso e propõe uma formulação que mantém o essencial.' },
        { titre: 'Escolhe', texte: 'Enviar a versão apaziguada ou a sua. Se o tom for muito vivo, a Serenity sugere uma pausa de alguns minutos.' },
      ],
      video: 'Demonstração: uma mensagem tensa reformulada antes do envio',
    },
    depenses: {
      surTitre: 'Despesas partilhadas', titre: 'Contas claras, ao cêntimo.',
      intro: 'Cantina, fraldas, aulas de dança: cada um regista o que paga, a Serenity calcula a parte de cada um e diz quem deve quanto.',
      points: [
        { titre: 'A sua repartição', texte: '50/50, 60/40 ou proporcional aos rendimentos, alterável a qualquer momento.' },
        { titre: 'Conta comum ou pais separados', texte: 'Para pais separados, o outro progenitor valida cada despesa antes de ela contar.' },
        { titre: 'Despesas recorrentes', texte: 'Subscrições, pensão, cantina: programadas uma vez, contadas todos os meses.' },
        { titre: 'Atualizado em direto', texte: 'Uma despesa adicionada aparece logo no outro progenitor.' },
      ],
      video: 'Demonstração: adicionar uma despesa e ver o saldo',
    },
    agenda: {
      surTitre: 'Agenda familiar', titre: 'Quem vai buscar a Emma à quarta-feira?',
      intro: 'As atividades, as consultas médicas, as férias escolares e as semanas de guarda no mesmo calendário, com uma cor por pessoa.',
      points: [
        { titre: 'Um responsável por evento', texte: 'Sabe-se quem acompanha, sem andar a lembrar.' },
        { titre: 'O calendário de guarda', texte: 'Em casa do pai, em casa da mãe: visível num relance, filho a filho.' },
      ],
      alt: 'Agenda Serenity no computador',
    },
    bebe: {
      surTitre: 'Bebé e gravidez', titre: 'Os primeiros meses, a dois e sem caderno.',
      intro: 'Biberões, fraldas, sestas: registados em dois toques e visíveis por ambos os pais. Gráficos da semana, conselhos práticos, vacinas. E antes do nascimento: consultas, mala da maternidade, compras e burocracias.',
      points: [
        { titre: 'O dia do bebé num relance', texte: 'Última refeição, duração do sono, número de fraldas.' },
        { titre: 'Preparar a chegada', texte: 'Listas prontas a assinalar, adaptáveis à sua situação.' },
      ],
      video: 'Demonstração: acompanhamento do bebé e preparação do nascimento',
      graphAlt: 'Gráfico das refeições do bebé ao longo da semana',
    },
    cartes: {
      surTitre: 'Pensada para cada família', titre: 'Juntos ou separados, com ou sem crianças pequenas.',
      items: [
        { titre: 'À la carte', texte: 'Fique só com os espaços úteis: escola, compras e refeições, animais, dependentes, documentos…' },
        { titre: 'Em quatro línguas', texte: 'Francês, inglês, espanhol e português. Cada um lê a aplicação na sua língua.' },
        { titre: 'Telemóvel e computador', texte: 'A mesma aplicação no telemóvel e em ecrã grande, em tema claro ou escuro.' },
        { titre: 'Acesso protegido', texte: 'Entrada por código PIN, documentos privados ou partilhados à sua escolha.' },
        { titre: 'Um espaço para as crianças', texte: 'Ligar a um dos pais, escrever uma mensagem, dizer como se sentem, verificar a mochila.' },
        { titre: 'Números de ajuda à mão', texte: 'As linhas de apoio e de emergência para pais e crianças, sempre acessíveis na aplicação.' },
      ],
    },
    final: { surTitre: 'Teste grátis', titre: 'Experimente a Serenity com a sua família.', intro: 'Crie o seu espaço, convide o outro progenitor e veja a diferença logo na primeira semana.', bouton: 'Criar o meu espaço de família' },
    pied: { droits: '© 2026 Serenity', fictive: 'Os ecrãs apresentados utilizam uma família fictícia.' },
    panier: { ajouter: 'Adicionar ao carrinho', ajouterPlus: 'Adicionar ao carrinho (+1)', voir: 'Ver o carrinho' },
    video: { lire: 'Reproduzir o vídeo', pause: 'Pausar o vídeo' },
    presentation: { mode: 'Modo de apresentação', quitter: 'Sair da apresentação', compteur: (i, n) => `${i} / ${n} · Esc para sair` },
  },
  es: {
    meta: {
      title: 'Serenity — la vida en familia, más tranquila',
      description: 'Serenity reúne la agenda, los mensajes, los gastos, el seguimiento del bebé y todos los papeles de la familia en una sola aplicación. Sus mensajes apaciguados ayudan a hablar sin acalorarse.',
      ogDescription: 'Agenda compartida, mensajes apaciguados, gastos claros, seguimiento del bebé: toda la familia en un mismo lugar.',
    },
    nav: { sections: 'Secciones', fonctionnalites: 'Funcionalidades', messages: 'Mensajes apaciguados', depenses: 'Gastos', bebe: 'Bebé', essayer: 'Probar', gratuitement: ' gratis', logoLabel: 'Serenity, volver arriba' },
    hero: {
      surTitre: 'Aplicación de organización familiar',
      titreDebut: 'La vida en familia, ', titreFin: 'más tranquila.',
      chapo: 'Agenda, mensajes, gastos, papeles, seguimiento del bebé: todo lo que hace funcionar la casa, compartido en un mismo lugar. Y cuando sube el tono, Serenity te ayuda a decir las cosas de otra manera.',
      essayer: 'Probar gratis', voir: 'Ver cómo funciona',
      reecritureDe: 'Mensaje de Alice a Bob', analyse: 'Análisis de Serenity…', tension: 'Tensión',
      video: 'Demostración: el inicio, la agenda, los mensajes y las finanzas de Serenity',
    },
    reecriture: {
      brouillon: 'Borrador', tendu: 'Tono tenso', propose: 'Serenity propone…', apaise: 'Apaciguado', prete: 'Versión apaciguada lista para enviar',
      messageTendu: '¡Llegas tarde <span class="mot-tendu">OTRA VEZ</span>! Contigo es <span class="mot-tendu">siempre</span> lo mismo, Emma te esperó 20 minutos.',
      messageCalme: 'Me siento preocupada: Emma te esperó 20 minutos a la salida. ¿Podrías avisarme cuando tengas un imprevisto, para que encontremos una solución juntos?',
    },
    modules: {
      surTitre: 'Todo en un mismo lugar', titre: 'Una sola aplicación para toda la casa.',
      intro: 'Once espacios para activar según tu familia. Cada uno elige los que muestra: nada estorba, nada se pierde.',
      apercu: 'Vista previa de los espacios de la aplicación', pause: 'Pausa', lecture: 'Reproducir',
      items: [
        { alt: 'Inicio con accesos directos y nota de Serenity', titre: 'Inicio', texte: 'Tus accesos directos, ordenados como quieras' },
        { alt: 'Agenda familiar del mes con las custodias', titre: 'Agenda', texte: 'Actividades, citas y custodias' },
        { alt: 'Hilo de mensajes entre Alice y Bob', titre: 'Mensajes', texte: 'Conversaciones serenas, incluso tensas' },
        { alt: 'Resumen de los gastos del mes', titre: 'Finanzas', texte: 'Quién ha pagado, quién debe cuánto' },
        { alt: 'Ficha de familia con padres e hijos', titre: 'Familia', texte: 'Padres, hijos, allegados' },
        { alt: 'Seguimiento del bebé: comidas, pañales, sueño', titre: 'Bebé', texte: 'Comidas, pañales, sueño' },
        { alt: 'Preparar la llegada del bebé', titre: 'Embarazo', texte: 'Citas, maleta, trámites' },
        { alt: 'Espacio infantil con llamada a los padres y estado de ánimo del día', titre: 'Espacio infantil', texte: 'Llamar a papá o a mamá, decir cómo está' },
        { alt: 'Selección de los módulos mostrados', titre: 'A la carta', texte: 'Te quedas solo con lo que te sirve' },
      ],
    },
    messages: {
      surTitre: 'Mensajes apaciguados', titre: 'El mensaje sale. La discusión, no.',
      intro: 'Inspirada en la comunicación no violenta, Serenity relee tu mensaje antes de enviarlo y te propone una versión más serena. Sigues siendo libre con tus palabras.',
      etapes: [
        { titre: 'Tú escribes', texte: 'Como lo piensas, en el momento.' },
        { titre: 'Serenity propone', texte: 'Detecta el tono tenso y sugiere una formulación que conserva el fondo.' },
        { titre: 'Tú eliges', texte: 'Enviar la versión apaciguada o la tuya. Si el tono es muy vivo, Serenity te sugiere una pausa de unos minutos.' },
      ],
      video: 'Demostración: un mensaje tenso reformulado antes de enviarlo',
    },
    depenses: {
      surTitre: 'Gastos compartidos', titre: 'Cuentas claras, al céntimo.',
      intro: 'Comedor, pañales, clases de baile: cada uno anota lo que paga, Serenity calcula la parte de cada uno y te dice quién debe cuánto.',
      points: [
        { titre: 'Tu reparto', texte: '50/50, 60/40 o en proporción a los ingresos, modificable en cualquier momento.' },
        { titre: 'Cuenta común o padres separados', texte: 'En el caso de padres separados, el otro progenitor valida cada gasto antes de que cuente.' },
        { titre: 'Gastos recurrentes', texte: 'Suscripciones, pensión, comedor: programados una vez, contados cada mes.' },
        { titre: 'Al día en directo', texte: 'Un gasto añadido aparece enseguida en el otro progenitor.' },
      ],
      video: 'Demostración: añadir un gasto y ver el saldo',
    },
    agenda: {
      surTitre: 'Agenda familiar', titre: '¿Quién recoge a Emma el miércoles?',
      intro: 'Las actividades, las citas médicas, las vacaciones escolares y las semanas de custodia en un mismo calendario, con un color por persona.',
      points: [
        { titre: 'Un responsable por evento', texte: 'Se sabe quién acompaña, sin tener que recordárselo.' },
        { titre: 'El calendario de custodia', texte: 'En casa de papá, en casa de mamá: visible de un vistazo, hijo por hijo.' },
      ],
      alt: 'Agenda de Serenity en el ordenador',
    },
    bebe: {
      surTitre: 'Bebé y embarazo', titre: 'Los primeros meses, a dos y sin libreta.',
      intro: 'Biberones, pañales, siestas: anotados en dos toques y visibles para ambos padres. Gráficos de la semana, consejos prácticos, vacunas. Y antes del nacimiento: citas, maleta de maternidad, compras y trámites.',
      points: [
        { titre: 'El día del bebé de un vistazo', texte: 'Última comida, duración del sueño, número de pañales.' },
        { titre: 'Preparar la llegada', texte: 'Listas listas para marcar, adaptables a tu situación.' },
      ],
      video: 'Demostración: seguimiento del bebé y preparación del parto',
      graphAlt: 'Gráfico de las comidas del bebé durante la semana',
    },
    cartes: {
      surTitre: 'Pensada para cada familia', titre: 'Juntos o separados, con o sin niños pequeños.',
      items: [
        { titre: 'A la carta', texte: 'Quédate solo con los espacios útiles: colegio, compras y comidas, mascotas, personas a cargo, documentos…' },
        { titre: 'En cuatro idiomas', texte: 'Francés, inglés, español y portugués. Cada uno lee la aplicación en su idioma.' },
        { titre: 'Teléfono y ordenador', texte: 'La misma aplicación en el teléfono y en pantalla grande, en tema claro u oscuro.' },
        { titre: 'Acceso protegido', texte: 'Acceso con código PIN, documentos privados o compartidos según tu elección.' },
        { titre: 'Un espacio para los niños', texte: 'Llamar a un progenitor, escribir un mensaje, decir cómo se sienten, revisar la mochila.' },
        { titre: 'Los números de ayuda a mano', texte: 'Las líneas de escucha y de emergencia para padres e hijos, siempre accesibles en la aplicación.' },
      ],
    },
    final: { surTitre: 'Prueba gratuita', titre: 'Prueba Serenity con tu familia.', intro: 'Crea tu espacio, invita al otro progenitor y comprueba la diferencia desde la primera semana.', bouton: 'Crear mi espacio familiar' },
    pied: { droits: '© 2026 Serenity', fictive: 'Las pantallas mostradas utilizan una familia ficticia.' },
    panier: { ajouter: 'Añadir al carrito', ajouterPlus: 'Añadir al carrito (+1)', voir: 'Ver el carrito' },
    video: { lire: 'Reproducir el vídeo', pause: 'Pausar el vídeo' },
    presentation: { mode: 'Modo presentación', quitter: 'Salir de la presentación', compteur: (i, n) => `${i} / ${n} · Esc para salir` },
  },
}
