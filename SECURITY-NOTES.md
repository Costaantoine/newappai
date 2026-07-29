# SECURITY-NOTES — newPC (100.101.125.48)

## Ports fermés au public (via iptables)
Ces règles sont persistantes au reboot via netfilter-persistent (/etc/iptables/rules.v4).

| Port | Service | Raison | Fermé le |
|------|---------|--------|----------|
| 3097 | CascadeProjects dev copy (Next.js) | Dev copy exposée, middleware different de la prod | 2026-07-29 |
| 5433 | PostgreSQL (Docker newappai-db) | Base de donnees, doit rester en localhost | 2026-07-29 |
| 3000 | Hermes Studio (node) | Admin UI Hermes, accessible via Tailscale | 2026-07-29 |
| 3001 | FreeLLM API (Docker) | Proxy LLM, bind change en 127.0.0.1:3001 | 2026-07-29 |
| 8090 | Conculega backend (uvicorn) | Projet non-NewAppAI | 2026-07-29 |

## Ports ouverts au public (legitimes)
| Port | Service | Raison |
|------|---------|--------|
| 22 | SSH | Acces admin |
| 80/443 | Traefik (PJP) | Site newappai.com |
| 3020 | Next.js standalone | Site newappai.com (via PJP) |

## Notes
- FreeLLM: bind a 127.0.0.1 dans ~/freellmapi/.env (HOST_BIND=127.0.0.1)
- Persistance: netfilter-persistent restore les règles au boot
- Rechargement: sudo netfilter-persistent reload

## Acces via Tailscale
- L'interface tailscale0 est ACCEPTEE avant les regles DROP
- Tous les ports listes ci-dessus restent accessibles depuis le tailnet
  (100.101.125.48) mais sont bloques depuis l'exterieur (IP publique)
