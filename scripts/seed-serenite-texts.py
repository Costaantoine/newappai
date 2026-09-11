#!/usr/bin/env python3
# Seed the serenite Text keys in the database (4 languages).
import os, sys, uuid, re
import psycopg2

env_path = '/root/newappai-build-v2/.env'
db_url = None
with open(env_path) as f:
    for line in f:
        if line.startswith('DATABASE_URL='):
            db_url = line.strip().split('=', 1)[1]
            break

if not db_url:
    print('ERROR: DATABASE_URL not found')
    sys.exit(1)

m = re.match(r'postgres(ql)?://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
if not m:
    print('ERROR: Cannot parse DATABASE_URL')
    sys.exit(1)

user, password, host, port, dbname = m.group(2), m.group(3), m.group(4), m.group(5), m.group(6)
conn = psycopg2.connect(host=host, port=port, dbname=dbname, user=user, password=password)
cur = conn.cursor()

TEXTS = {
    'serenite_badge': {'fr': 'Test \u2014 S\u00e9r\u00e9nit\u00e9', 'en': 'Test \u2014 Serenity', 'pt': 'Teste \u2014 Serenidade', 'es': 'Prueba \u2014 Serenidad'},
    'serenite_title': {'fr': 'Communication apais\u00e9e entre parents', 'en': 'Peaceful communication between parents', 'pt': 'Comunica\u00e7\u00e3o pac\u00edfica entre pais', 'es': 'Comunicaci\u00f3n pac\u00edfica entre padres'},
    'serenite_description': {'fr': "Avant d'envoyer un message tendu, notre IA vous propose une reformulation plus douce.", 'en': 'Before sending a tense message, our AI suggests a softer version.', 'pt': 'Antes de enviar uma mensagem tensa, a nossa IA prop\u00f5e uma reformula\u00e7\u00e3o mais suave.', 'es': 'Antes de enviar un mensaje tenso, nuestra IA propone una versi\u00f3n m\u00e1s suave.'},
    'serenite_disclaimer': {'fr': "Ceci est une d\u00e9monstration. N'entrez pas d'informations personnelles r\u00e9elles. Les messages ne sont pas conserv\u00e9s mais sont trait\u00e9s par un service d'intelligence artificielle tiers.", 'en': 'This is a demonstration. Do not enter real personal information. Messages are not stored but are processed by a third-party AI service.', 'pt': 'Isto \u00e9 uma demonstra\u00e7\u00e3o. N\u00e3o insira informa\u00e7\u00f5es pessoais reais. As mensagens n\u00e3o s\u00e3o armazenadas, mas s\u00e3o processadas por um servi\u00e7o de IA de terceiros.', 'es': 'Esto es una demostraci\u00f3n. No introduzca informaci\u00f3n personal real. Los mensajes no se almacenan pero son procesados por un servicio de IA de terceros.'},
    'serenite_input_placeholder': {'fr': 'Tapez ou collez un message...', 'en': 'Type or paste a message...', 'pt': 'Escreva ou cole uma mensagem...', 'es': 'Escribe o pega un mensaje...'},
    'serenite_btn_soften': {'fr': '\u2728 Adoucir mon message', 'en': '\u2728 Soften my message', 'pt': '\u2728 Suavizar a minha mensagem', 'es': '\u2728 Suavizar mi mensaje'},
    'serenite_loading': {'fr': 'Analyse en cours...', 'en': 'Analyzing...', 'pt': 'Analisando...', 'es': 'Analizando...'},
    'serenite_error_generic': {'fr': 'Erreur. R\u00e9essayez.', 'en': 'Error. Please try again.', 'pt': 'Erro. Tente novamente.', 'es': 'Error. Int\u00e9ntelo de nuevo.'},
    'serenite_error_rate': {'fr': 'Trop de requ\u00eates. R\u00e9essayez dans une minute.', 'en': 'Too many requests. Try again in one minute.', 'pt': 'Demasiados pedidos. Tente novamente em um minuto.', 'es': 'Demasiadas solicitudes. Int\u00e9ntelo de nuevo en un minuto.'},
    'serenite_label_ok': {'fr': 'Message OK', 'en': 'Message OK', 'pt': 'Mensagem OK', 'es': 'Mensaje OK'},
    'serenite_label_original': {'fr': 'Message original', 'en': 'Original message', 'pt': 'Mensagem original', 'es': 'Mensaje original'},
    'serenite_label_softened': {'fr': 'Message adouci', 'en': 'Softened message', 'pt': 'Mensagem suavizada', 'es': 'Mensaje suavizado'},
    'serenite_critique_title': {'fr': 'Niveau critique', 'en': 'Critical level', 'pt': 'N\u00edvel cr\u00edtico', 'es': 'Nivel cr\u00edtico'},
    'serenite_critique_msg': {'fr': "Cette d\u00e9mo n'est pas con\u00e7ue pour traiter ce type de message. Si vous ou un enfant \u00eates en danger, contactez le 119 (All\u00f4 Enfance en Danger) ou le 3919 (violences conjugales). En cas d'urgence imm\u00e9diate, appelez le 17 ou le 112.", 'en': 'This demo is not designed to handle this type of message. If you or a child are in danger, call 112 (European emergency). For immediate danger, call your local emergency number.', 'pt': 'Esta demo n\u00e3o foi concebida para lidar com este tipo de mensagem. Se voc\u00ea ou uma crian\u00e7a estiverem em perigo, ligue para o 112 (emerg\u00eancia europeia). Em caso de perigo imediato, ligue 112.', 'es': 'Esta demo no est\u00e1 dise\u00f1ada para manejar este tipo de mensaje. Si usted o un ni\u00f1o est\u00e1n en peligro, llame al 112 (emergencias europeas). En caso de peligro inmediato, llame al 112.'},
    'serenite_ex1_label': {'fr': 'Retard', 'en': 'Lateness', 'pt': 'Atraso', 'es': 'Retraso'},
    'serenite_ex1_text': {'fr': "Tu es encore en retard pour la remise, c'est la troisi\u00e8me fois ce mois-ci. C'est vraiment n'importe quoi", 'en': "You're late for the handover again, that's the third time this month. It's really unacceptable", 'pt': "Est\u00e1s outra vez atrasado/a para a entrega, \u00e9 a terceira vez este m\u00eas. Isto \u00e9 inaceit\u00e1vel", 'es': "Otra vez llegas tarde a la entrega, es la tercera vez este mes. Esto es realmente inaceptable"},
    'serenite_ex1_reason': {'fr': 'G\u00e9n\u00e9ralisation et reproche', 'en': 'Generalization and blame', 'pt': 'Generaliza\u00e7\u00e3o e reprova\u00e7\u00e3o', 'es': 'Generalizaci\u00f3n y reproche'},
    'serenite_ex2_label': {'fr': 'Orthodontiste', 'en': 'Orthodontist', 'pt': 'Ortodontista', 'es': 'Ortodoncista'},
    'serenite_ex2_text': {'fr': "\u00c9videmment que tu ne te rappelles pas de l'orthodontiste, tu ne penses jamais aux enfants", 'en': "Of course you don't remember the orthodontist, you never think about the children", 'pt': "Claro que n\u00e3o te lembras do ortodontista, nunca pensas nas crian\u00e7as", 'es': "Por supuesto que no te acuerdas del ortodoncista, nunca piensas en los ni\u00f1os"},
    'serenite_ex2_reason': {'fr': 'M\u00e9pris et accusation', 'en': 'Contempt and accusation', 'pt': 'Desprezo e acusa\u00e7\u00e3o', 'es': 'Desprecio y acusaci\u00f3n'},
    'serenite_ex3_label': {'fr': 'Ironie', 'en': 'Irony', 'pt': 'Ironia', 'es': 'Iron\u00eda'},
    'serenite_ex3_text': {'fr': "Ah oui pardon, j'oubliais que les enfants c'est juste mon probl\u00e8me", 'en': "Oh right sorry, I forgot that the children are just my problem", 'pt': "Ah sim desculpa, esqueci-me que as crian\u00e7as s\u00f3o problema meu", 'es': "Ah s\u00ed perd\u00f3n, olvidaba que los ni\u00f1os son solo mi problema"},
    'serenite_ex3_reason': {'fr': 'Ironie et passive-agressivit\u00e9', 'en': 'Irony and passive-aggressiveness', 'pt': 'Ironia e passividade agressiva', 'es': 'Iron\u00eda y pasivo-agresividad'},
    'serenite_ex4_label': {'fr': 'Frustration', 'en': 'Frustration', 'pt': 'Frustra\u00e7\u00e3o', 'es': 'Frustraci\u00f3n'},
    'serenite_ex4_text': {'fr': "Je suis fatigu\u00e9 de tout g\u00e9rer seule, tu t'en fiches compl\u00e8tement", 'en': "I'm tired of managing everything alone, you couldn't care less", 'pt': "Estou cansado/a de gerir tudo sozinho/a, voc\u00ea n\u00e3o se importa nada", 'es': "Est\u00e1 agotado/a de gestionar todo solo/a, no te importa nada en absoluto"},
    'serenite_ex4_reason': {'fr': 'Frustration et g\u00e9n\u00e9ralisation', 'en': 'Frustration and generalization', 'pt': 'Frustra\u00e7\u00e3o e generaliza\u00e7\u00e3o', 'es': 'Frustraci\u00f3n y generalizaci\u00f3n'},
    'serenite_how_title': {'fr': 'Comment \u00e7a marche', 'en': 'How it works', 'pt': 'Como funciona', 'es': 'C\u00f3mo funciona'},
    'serenite_how_step1_title': {'fr': '\u00c9crivez votre message', 'en': 'Write your message', 'pt': 'Escreva a sua mensagem', 'es': 'Escriba su mensaje'},
    'serenite_how_step1_desc': {'fr': 'Saisissez ou collez le message que vous souhaitez envoyer \u00e0 l\u2019autre parent.', 'en': 'Type or paste the message you want to send to the other parent.', 'pt': 'Escreva ou cole a mensagem que deseja enviar ao outro pai/m\u00e3e.', 'es': 'Escriba o pegue el mensaje que desea enviar al otro padre/madre.'},
    'serenite_how_step2_title': {'fr': 'L\u2019IA analyse la tension', 'en': 'AI analyzes tension', 'pt': 'A IA analisa a tens\u00e3o', 'es': 'La IA analiza la tensi\u00f3n'},
    'serenite_how_step2_desc': {'fr': 'Notre intelligence artificielle \u00e9value le niveau de tension et propose une reformulation si n\u00e9cessaire.', 'en': 'Our artificial intelligence evaluates the tension level and suggests a reformulation if needed.', 'pt': 'A nossa intelig\u00eancia artificial avalia o n\u00edvel de tens\u00e3o e prop\u00f5e uma reformula\u00e7\u00e3o se necess\u00e1rio.', 'es': 'Nuestra inteligencia artificial eval\u00faa el nivel de tensi\u00f3n y propone una reformulaci\u00f3n si es necesario.'},
    'serenite_how_step3_title': {'fr': 'Envoyez en confiance', 'en': 'Send with confidence', 'pt': 'Envie com confian\u00e7a', 'es': 'Env\u00ede con confianza'},
    'serenite_how_step3_desc': {'fr': 'Utilisez la version adoucie pour pr\u00e9server une communication respectueuse avec l\u2019autre parent.', 'en': 'Use the softened version to maintain respectful communication with the other parent.', 'pt': 'Use a vers\u00e3o suavizada para manter uma comunica\u00e7\u00e3o respeitosa com o outro pai/m\u00e3e.', 'es': 'Use la versi\u00f3n suavizada para mantener una comunicaci\u00f3n respetuosa con el otro padre/madre.'},
}

count = 0
for key, langs in TEXTS.items():
    text_id = str(uuid.uuid4())
    cur.execute(
        """INSERT INTO "Text" (id, key, section, fr, en, pt, es, created_at, updated_at)
           VALUES (%s, %s, 'serenite', %s, %s, %s, %s, NOW(), NOW())
           ON CONFLICT DO NOTHING""",
        (text_id, key, langs['fr'], langs['en'], langs['pt'], langs['es'])
    )
    count += 1

conn.commit()
print('Seeded %d serenite text keys (section=serenite)' % count)
cur.close()
conn.close()
