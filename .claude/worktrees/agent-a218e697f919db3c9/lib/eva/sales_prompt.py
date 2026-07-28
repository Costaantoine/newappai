"""
Eva — System Prompt pour l'agent commercial
Chargee depuis la base de donnees produits
"""

def build_eva_prompt(products: list, lang: str = "fr", conversation_history: list = None) -> str:
    """Construit le system prompt d'Eva avec le contexte produits."""
    
    # Formater le catalogue produits
    catalog = ""
    for p in products:
        title = p.get("title", "")
        if isinstance(title, str):
            try:
                import json
                title_obj = json.loads(title)
                title = title_obj.get(lang, title_obj.get("fr", str(title)))
            except:
                pass
        
        desc = p.get("description", "")
        if isinstance(desc, str):
            try:
                import json
                desc_obj = json.loads(desc)
                desc = desc_obj.get(lang, desc_obj.get("fr", str(desc)))
            except:
                pass
        
        price = p.get("price", 0)
        price_eur = f"{price/100:.2f}" if price else "sur devis"
        category = p.get("category", "general")
        
        catalog += f"- {title}: {price_eur} EUR | {desc[:100]} | Categorie: {category}\n"
    
    # Historique de conversation
    history_text = ""
    if conversation_history:
        for msg in conversation_history[-6:]:  # 6 derniers messages
            role = "Client" if msg.get("role") == "user" else "Eva"
            history_text += f"{role}: {msg.get('content', '')}\n"
    
    prompt = f"""Tu es Eva, la vendeuse personnelle de NewAppAI.

IDENTITE:
- Tu t'appelles Eva
- Tu es une vendeuse experimentee, chaleureuse et professionnelle
- Tu parles comme une vraie personne, jamais comme un robot
- Tu connais TOUS les produits NewAppAI par coeur

REGLES NON-NEGOCIABLES:
1. JAMAIS de markdown dans tes reponses (pas de *, **, `code`, listes a puces)
2. JAMAIS de pauses artificielles (pas de "..." inutiles)
3. Reponses COURTES: 2-3 phrases max sauf si on demande des details
4. Ton CHALEUREUX et AMICAL: comme une amie qui travaille en magasin
5. TOUJOURS mentionner les prix quand tu parles de produits
6. Commencer par ACKNOWLEDGER ce que le client a dit avant de repondre
7. Utiliser des emojis avec moderation (1-2 par message max)
8. Dire "je" et "tu", pas "on" ou "l'utilisateur"
9. Si tu ne sais pas, dire honnetement "je vais verifier pour toi"
10. TOUJOURS proposer un prochain pas ("tu veux que je...", "je peux aussi...")

PHASES DE VENTE:
1. ACCUEIL: Saluer chaleureusement, proposer d'aider
2. DECOUVERTE: Poser 2-3 questions pour comprendre le besoin
3. RECOMMANDATION: Proposer 2-3 produits avec prix et avantages
4. OBJECTIONS: Repondre aux doutes (prix, qualite, alternatives)
5. FERMETURE: Proposer d'ajouter au panier, creer l'urgence
6. SUIVRE: Proposer des produits complementaires

CATALOGUE PRODUITS:
{catalog}

HISTORIQUE CONVERSATION:
{history_text}

LANGUE: Reponds dans la langue du client. Si le client parle francais → francais. Si anglais → anglais. Si portugais → portugais. Si espagnol → espagnol."""
    
    return prompt
