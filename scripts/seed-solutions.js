const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = {
  projectId: "newappai-9dd90",
  clientEmail: "firebase-adminsdk-fbsvc@newappai-9dd90.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIygtlr872PQ6u\nOGXGf5Q1uPLdFn4KtD7E7fIGOrKAFPRJj5cQhj1G7KtBXETj1hOgnffSVREWCqO5\n6z0WsPRXoQMJSExxeE/DBj6d2HfZMzfXRwEz1x/tdzyn29N2liPgR0/12P9S3IfI\ns0qDBHKqub9sUXE5ETgjjdDtrfxH3Lc0HLLtEfMQEiP+F7Eqk5uD4LHkMWD+UkR6\nKM/CQiS87+xoMRteWvAtDn1kjakQB7tyVhOn8Et6VVV4uNpDuCK2FQA92irScexN\nwvfwkQw/3ihVG0AR4YL7cDGyv8cHcYFPR0DOXKpJWDRlo5kXSYOsLrQvOBdLlZDi\nOcIs56KhAgMBAAECggEAG+0V9rekBlVppEuNxDTcTTiC9sL5Fs4I6OTbQ4iIaQ4B\nB/YjoZW6EhI6o2WM409T/YPbAvL35GPob6RLI8vKwCFRxcm7cBC2rz5AGT4RNTFN\nc/CZNzeVZjauRf5qA9VP+hKRCXV71W98pypgk6ZbuGkLOap+H9zIPRGtXFFVhDzs\nDmzw+lGHGZCjbdGhsi6gd4rY/ttTl5uKpXQ+No8OPwQz311cUEZzUKujgUvuXLzD\nx+5emC2yeatPlsLSYZa81wN7QI/XcC8QRctUdoxkeD7T34Yt8CpYLJLYJ4aZ3dUr\nN+WH0xBGdO4sETSt6UOfQY9+Y+LdorAF3dg4sYW3EQKBgQD63YZGmuVgxU3WJ3PF\nlE/zAftifPXs5Ebi92TVYTERfl6jiyIVZOkNKkSeutmYNdPq0QIjPydyBW/SSuoW\nNac/cvhiCld0rFd9VZxXdOnx5Ur7pndGppzsdQCnimTWUGxUq79VFVg7QoxBOUwY\nlx4Vvchk3KyePbDoOx4lRWYudQKBgQDM5iINoyFwFMsvaK7/5efpmuIQskvCNaYY\n4bKomXuqV79nfSsBb0xunvIVWOrCDbUwzcFKIJixQYGFQVf86qqAKYRNbQb3a0OQ\n5pSaTr97EAcGMfBpBXpVkMVK5gYjkNKloS3GIKZ5DB2CrgxQR4GNon3KcF1QSVwl\nuLcNK2e1/QKBgFxuULIlEkzUhbhZMvPikI6V9Vy1dBtDhMbNpm5kcCLk79PMSNOf\nKas7HqtpZxEJDDrhpar88vi0/h16ksN6I1RidRgSfWS0t0urxn4Gysfg1v7ft+Tl\nML6C4anZeQvp9/A+k7Gyup6jB3Bkvx/0VhZmpbZcBJINYug+F/5dkqedAoGAAid1\nOjF524TMcg4msNgI7SLMt6I4O612tpJA35blfu/3Oi5NsnEqG4uePe02Yp3kRsQT\nASWAlXR72RvLwgPxlv+YvXuk9BrzleVmsIydZLzRZhZGUcRV+epQuK3caKlQHZ+p\nLIkRVvpyoPoVdQ6bZRLNQcCWqo5q4pajjgbjyz0CgYEAjB47FU/YUG/+aUA5SHRi\n1wDIpVEl4bczmUZe2TK0wNUPnQkTs2p106QSpUV+3hQVqHB1mm0XWd9bavfdqCyK\n0AduQNrgu/UbqdlhQZ/VO6OWGcWf2YclebWvV2NQWk2RH4IqDSgNrz3bmeC7FnTs\nWqiGcCL8SwjFyJ5IXso8jBs=\n-----END PRIVATE KEY-----\n"
};

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

const solutionsToSeed = [
  // DigiSmart Solutions
  { key: 'solutions_title', section: 'solutions', type: 'title', category: 'digismart', fr: 'Des outils intelligents pour chaque étape de votre activité.', en: 'Smart tools for every stage of your business.', pt: 'Ferramentas inteligentes para cada etapa da sua atividade.', es: 'Herramientas inteligentes para cada etapa de su actividad.' },
  { key: 'solutions_subtitle', section: 'solutions', type: 'subtitle', category: 'digismart', fr: 'Choisissez l\'innovation qui s\'adapte à votre métier.', en: 'Choose the innovation that fits your business.', pt: 'Escolha a inovação que se adapta ao seu negócio.', es: 'Elija la innovación que se adapta a su negocio.' },
  
  { key: 'digismart_title', section: 'solutions', type: 'title', category: 'digismart', fr: 'DigiSmart Solutions', en: 'DigiSmart Solutions', pt: 'DigiSmart Solutions', es: 'DigiSmart Solutions' },
  { key: 'digismart_subtitle', section: 'solutions', type: 'subtitle', category: 'digismart', fr: 'La Suite Tout-en-Un pour Restaurants & Commerces', en: 'The All-in-One Suite for Restaurants & Retail', pt: 'A Suíte Tudo-em-Um para Restaurantes e Comércios', es: 'La Suite Todo-en-Uno para Restaurantes y Comercios' },
  { key: 'digismart_cta', section: 'solutions', type: 'description', category: 'digismart', fr: 'Visiter le site officiel', en: 'Visit official website', pt: 'Visitar o site oficial', es: 'Visitar el sitio oficial' },
  { key: 'digismart_newtab', section: 'solutions', type: 'description', category: 'digismart', fr: 'Ouverture dans un nouvel onglet', en: 'Opens in a new tab', pt: 'Abertura em uma nova guia', es: 'Apertura en una nueva pestaña' },
  
  { key: 'clickcollect_title', section: 'solutions', type: 'title', category: 'digismart', fr: 'Click & Collect', en: 'Click & Collect', pt: 'Click & Collect', es: 'Click & Collect' },
  { key: 'clickcollect_desc', section: 'solutions', type: 'description', category: 'digismart', fr: 'Gagnez en efficacité et simplifiez le quotidien de vos clients.', en: 'Increase efficiency and simplify your customers\' daily lives.', pt: 'Ganhe eficiência e simplifique o dia a dia de seus clientes.', es: 'Gane en eficiencia y simplifique el día a día de sus clientes.' },
  
  { key: 'reservations_title', section: 'solutions', type: 'title', category: 'digismart', fr: 'Réservations', en: 'Reservations', pt: 'Reservas', es: 'Reservas' },
  { key: 'reservations_desc', section: 'solutions', type: 'description', category: 'digismart', fr: 'Valorisez votre savoir-faire en offrant un service de réservation simple et moderne.', en: 'Showcase your expertise with a simple and modern reservation service.', pt: 'Valorize seu saber-fazer oferecendo um serviço de reserva simples e moderno.', es: 'Valore su saber hacer ofreciendo un servicio de reserva simple y moderno.' },
  
  { key: 'iaphone_title', section: 'solutions', type: 'title', category: 'digismart', fr: 'IA Téléphonique', en: 'AI Phone Assistant', pt: 'IA Telefônica', es: 'IA Telefónica' },
  { key: 'iaphone_desc', section: 'solutions', type: 'description', category: 'digismart', fr: 'Assurez une présence téléphonique constante et offrez une réponse immédiate à chaque appel.', en: 'Ensure constant phone presence and provide immediate response to every call.', pt: 'Garanta presença telefônica constante e ofereça resposta imediata a cada ligação.', es: 'Asegure presencia telefónica constante y ofrezca respuesta inmediata a cada llamada.' },
  { key: 'iaphone_badge', section: 'solutions', type: 'badge', category: 'digismart', fr: 'En cours de développement', en: 'In development', pt: 'Em desenvolvimento', es: 'En desarrollo' },
  
  { key: 'gps_title', section: 'solutions', type: 'title', category: 'digismart', fr: 'Suivi Live GPS', en: 'Live GPS Tracking', pt: 'Rastreamento GPS ao Vivo', es: 'Seguimiento GPS en Vivo' },
  { key: 'gps_desc', section: 'solutions', type: 'description', category: 'digismart', fr: 'Offrez une visibilité en temps réel à vos clients et facilitez le travail de vos livreurs.', en: 'Give your customers real-time visibility and make your delivery drivers\' work easier.', pt: 'Ofereça visibilidade em tempo real aos seus clientes e facilite o trabalho de seus entregadores.', es: 'Ofrezca visibilidad en tiempo real a sus clientes y facilite el trabajo de sus repartidores.' },
  { key: 'gps_badge', section: 'solutions', type: 'badge', category: 'digismart', fr: 'En cours de développement', en: 'In development', pt: 'Em desenvolvimento', es: 'En desarrollo' },
  
  { key: 'borne_title', section: 'solutions', type: 'title', category: 'digismart', fr: 'Borne de Commande', en: 'Order Kiosk', pt: 'Terminal de Pedido', es: 'Terminal de Pedidos' },
  { key: 'borne_desc', section: 'solutions', type: 'description', category: 'digismart', fr: 'Optimisez l\'accueil dans votre établissement et boostez votre chiffre d\'affaires.', en: 'Optimize reception in your establishment and boost your revenue.', pt: 'Otimize o acolhimento em seu estabelecimento e aumente seu faturamento.', es: 'Optimice la acogida en su establecimiento y aumente sus ingresos.' },
  { key: 'borne_badge', section: 'solutions', type: 'badge', category: 'digismart', fr: 'En cours de développement', en: 'In development', pt: 'Em desenvolvimento', es: 'En desarrollo' },
  
  { key: 'payment_title', section: 'solutions', type: 'title', category: 'digismart', fr: 'Paiement Intégré', en: 'Integrated Payment', pt: 'Pagamento Integrado', es: 'Pago Integrado' },
  { key: 'payment_desc', section: 'solutions', type: 'description', category: 'digismart', fr: 'Sécurisez vos revenus et offrez une expérience d\'achat complète dès la commande.', en: 'Secure your revenue and offer a complete purchase experience from the order.', pt: 'Proteja suas receitas e ofereça uma experiência de compra completa desde o pedido.', es: 'Asegure sus ingresos y ofrezca una experiencia de compra completa desde el pedido.' },
  { key: 'payment_badge', section: 'solutions', type: 'badge', category: 'digismart', fr: 'En cours de développement', en: 'In development', pt: 'Em desenvolvimento', es: 'En desarrollo' },
  
  // Solutions Industrie
  { key: 'industrie_title', section: 'solutions', type: 'title', category: 'industrie', fr: 'Pôle Industrie', en: 'Industry Hub', pt: 'Pólo Indústria', es: 'Polo Industria' },
  { key: 'industrie_subtitle', section: 'solutions', type: 'subtitle', category: 'industrie', fr: 'Smart Factory & Logistique 4.0', en: 'Smart Factory & Logistics 4.0', pt: 'Smart Factory & Logística 4.0', es: 'Smart Factory & Logística 4.0' },
  
  { key: 'mb_title', section: 'solutions', type: 'title', category: 'industrie', fr: 'MB : Solution de gestion d\'atelier', en: 'MB: Workshop Management Solution', pt: 'MB: Solução de gestão de oficina', es: 'MB: Solución de gestión de taller' },
  { key: 'mb_subtitle', section: 'solutions', type: 'subtitle', category: 'industrie', fr: 'Le pilote de votre production', en: 'Your production pilot', pt: 'O piloto da sua produção', es: 'El pilote de su producción' },
  { key: 'mb_desc', section: 'solutions', type: 'description', category: 'industrie', fr: 'Éliminez l\'incertitude et passez à l\'atelier 4.0.', en: 'Eliminate uncertainty and move to Workshop 4.0.', pt: 'Elimine a incerteza e passe para a oficina 4.0.', es: 'Elimine la incertidumbre y pase al taller 4.0.' },
  
  { key: 'talkie_title', section: 'solutions', type: 'title', category: 'industrie', fr: 'Talkie-Pro', en: 'Talkie-Pro', pt: 'Talkie-Pro', es: 'Talkie-Pro' },
  { key: 'talkie_subtitle', section: 'solutions', type: 'subtitle', category: 'industrie', fr: 'Le lien instantané entre vos équipes', en: 'The instant connection between your teams', pt: 'O elo instantâneo entre suas equipes', es: 'El enlace instantáneo entre sus equipos' },
  { key: 'talkie_desc', section: 'solutions', type: 'description', category: 'industrie', fr: 'Gardez le contact, où que vous soyez dans l\'entreprise.', en: 'Stay in touch, wherever you are in the company.', pt: 'Mantenha o contato, onde quer que você esteja na empresa.', es: 'Mantenga el contacto, dondequiera que esté en la empresa.' }
];

async function seedSolutions() {
  try {
    console.log('Début de l\'ajout des solutions...')
    
    for (const solution of solutionsToSeed) {
      const docRef = await db.collection('solutions').add({
        ...solution,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp()
      });
      console.log(`✅ Solution ajoutée: ${solution.key} (ID: ${docRef.id})`);
    }
    
    console.log(`\n🎉 ${solutionsToSeed.length} solutions ont été ajoutées avec succès !`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des solutions:', error);
  }
}

seedSolutions();
