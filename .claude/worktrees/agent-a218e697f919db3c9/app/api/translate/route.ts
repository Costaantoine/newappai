import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    console.log('Translating text:', text)

    // Traductions basiques fiables pour les termes courants
    const basicTranslations = {
      'Accueil': { en: 'Home', pt: 'Início', es: 'Inicio' },
      'Contact': { en: 'Contact', pt: 'Contato', es: 'Contacto' },
      'Solutions': { en: 'Solutions', pt: 'Soluções', es: 'Soluciones' },
      'Produits': { en: 'Products', pt: 'Produtos', es: 'Productos' },
      'À propos': { en: 'About', pt: 'Sobre', es: 'Acerca de' },
      'Prix': { en: 'Price', pt: 'Preço', es: 'Precio' },
      'Ajouter': { en: 'Add', pt: 'Adicionar', es: 'Agregar' },
      'Modifier': { en: 'Edit', pt: 'Editar', es: 'Modificar' },
      'Supprimer': { en: 'Delete', pt: 'Excluir', es: 'Eliminar' },
      'Enregistrer': { en: 'Save', pt: 'Salvar', es: 'Guardar' },
      'Annuler': { en: 'Cancel', pt: 'Cancelar', es: 'Cancelar' },
      'Valider': { en: 'Validate', pt: 'Validar', es: 'Validar' },
      'Envoyer': { en: 'Send', pt: 'Enviar', es: 'Enviar' },
      'Rechercher': { en: 'Search', pt: 'Pesquisar', es: 'Buscar' },
      'Filtrer': { en: 'Filter', pt: 'Filtrar', es: 'Filtrar' },
      'Trier': { en: 'Sort', pt: 'Classificar', es: 'Ordenar' },
      'Exporter': { en: 'Export', pt: 'Exportar', es: 'Exportar' },
      'Importer': { en: 'Import', pt: 'Importar', es: 'Importar' },
      'Nouveau': { en: 'New', pt: 'Novo', es: 'Nuevo' },
      'Ancien': { en: 'Old', pt: 'Antigo', es: 'Antiguo' },
      'Premier': { en: 'First', pt: 'Primeiro', es: 'Primero' },
      'Dernier': { en: 'Last', pt: 'Último', es: 'Último' },
      'Suivant': { en: 'Next', pt: 'Próximo', es: 'Siguiente' },
      'Précédent': { en: 'Previous', pt: 'Anterior', es: 'Anterior' },
      'Ouvrir': { en: 'Open', pt: 'Abrir', es: 'Abrir' },
      'Fermer': { en: 'Close', pt: 'Fechar', es: 'Cerrar' },
      'Menu': { en: 'Menu', pt: 'Menu', es: 'Menú' },
      'Page': { en: 'Page', pt: 'Página', es: 'Página' },
      'Site': { en: 'Website', pt: 'Site', es: 'Sitio web' },
      'Admin': { en: 'Admin', pt: 'Admin', es: 'Admin' },
      'Utilisateur': { en: 'User', pt: 'Usuário', es: 'Usuario' },
      'Mot de passe': { en: 'Password', pt: 'Senha', es: 'Contraseña' },
      'Email': { en: 'Email', pt: 'Email', es: 'Email' },
      'Téléphone': { en: 'Phone', pt: 'Telefone', es: 'Teléfono' },
      'Adresse': { en: 'Address', pt: 'Endereço', es: 'Dirección' },
      'Ville': { en: 'City', pt: 'Cidade', es: 'Ciudad' },
      'Pays': { en: 'Country', pt: 'País', es: 'País' },
      'Code postal': { en: 'Postal code', pt: 'CEP', es: 'Código postal' }
    }

    // Vérifier si nous avons une traduction basique
    const basic = basicTranslations[text as keyof typeof basicTranslations]
    if (basic) {
      console.log('Found basic translation:', basic)
      return NextResponse.json({
        fr: text,
        en: basic.en,
        pt: basic.pt,
        es: basic.es
      })
    }

    // Pour les textes plus longs, utilisation d'une traduction simple
    try {
      const googleTranslateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`
      const enResponse = await fetch(googleTranslateUrl)
      const enData = await enResponse.json()
      const en = enData[0]?.[0]?.[0] || text

      const ptResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=pt&dt=t&q=${encodeURIComponent(text)}`)
      const ptData = await ptResponse.json()
      const pt = ptData[0]?.[0]?.[0] || text

      const esResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=es&dt=t&q=${encodeURIComponent(text)}`)
      const esData = await esResponse.json()
      const es = esData[0]?.[0]?.[0] || text

      console.log('Google translations:', { en, pt, es })

      return NextResponse.json({
        fr: text,
        en,
        pt,
        es
      })

    } catch (googleError) {
      console.error('Google translate error:', googleError)
      
      // Fallback ultime : retourner le texte original
      return NextResponse.json({
        fr: text,
        en: text,
        pt: text,
        es: text
      })
    }

  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
