# Mise en ligne sur un serveur

Le site, l'API Spring Boot, l'API Rust et PostgreSQL tournent dans des conteneurs Docker sur un seul serveur. Caddy sert le site sur le domaine, obtient et renouvelle seul le certificat HTTPS, et relaie `/api/v1/*` vers Spring Boot et `/api/signal/*` vers Rust.

```
navigateur ──HTTPS──> Caddy (web) ──> site statique
                          ├── /api/v1/*     ──> api    (Spring Boot) ──> db (PostgreSQL)
                          └── /api/signal/* ──> signal (Rust)
```

Seuls les ports 80 et 443 sont ouverts sur Internet ; la base n'est jamais exposée.

## 1. Le serveur

Un VPS sous **Ubuntu 24.04**, avec **2 Go de RAM au minimum** (4 Go sont plus confortables pour reconstruire les images sur place), 1 à 2 vCPU et 20 Go de disque. OVHcloud, Hetzner et Scaleway proposent ce format pour quelques euros par mois. Comparez les offres du moment.

## 2. Le domaine et le DNS

Chez le registraire, créez ces enregistrements, avec l'adresse IPv4 du serveur :

| Type | Nom | Valeur |
|---|---|---|
| `A` | `@` (le domaine nu) | IP du serveur |
| `A` | `www` | IP du serveur |

Si le serveur a une adresse IPv6, ajoutez les mêmes en `AAAA`. Comptez de quelques minutes à quelques heures de propagation ; `nslookup lucasdesmartin.fr` doit renvoyer l'IP du serveur avant l'étape 5.

## 3. Sécuriser le serveur (une fois)

Connecté en `root` par SSH :

```bash
adduser lucas && usermod -aG sudo lucas
rsync --archive --chown=lucas:lucas ~/.ssh /home/lucas    # reprend la clé SSH de root

apt update && apt upgrade -y
apt install -y ufw unattended-upgrades git
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 443/udp
ufw enable
```

Vérifiez que `ssh lucas@IP` fonctionne, puis désactivez la connexion par mot de passe et celle de `root` : `PasswordAuthentication no` et `PermitRootLogin no` dans `/etc/ssh/sshd_config`, puis `systemctl restart ssh`.

## 4. Installer Docker

En tant que `lucas` :

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker lucas
```

Déconnectez-vous et reconnectez-vous pour que le groupe `docker` soit pris en compte.

## 5. Déployer

```bash
git clone https://github.com/LucasDesm/Portfolio.git
cd Portfolio
cp deploy/.env.example .env
nano .env    # SITE_DOMAIN, et POSTGRES_PASSWORD généré avec : openssl rand -base64 32
docker compose up -d --build
```

Contrôles :

```bash
docker compose ps                  # les 4 services doivent être "running" (db : "healthy")
docker compose logs -f web         # Caddy : obtention du certificat
curl -I https://lucasdesmartin.fr
curl https://lucasdesmartin.fr/api/v1/projects | head -c 200
```

Si Caddy ne parvient pas à obtenir le certificat, le DNS ne pointe généralement pas encore vers le serveur. Caddy réessaie seul ; attendez la propagation.

## 6. Mettre à jour le site

Après un `git push` depuis votre ordinateur :

```bash
cd ~/Portfolio
git pull
docker compose up -d --build
```

Les contenus modifiés dans `frontend/src/lib/data.ts` doivent avoir été exportés (`npm run export-content`) et commités avant le push : l'API recharge `portfolio.json` à chaque démarrage.

## 7. Sauvegarder la base

La base ne contient que les messages de contact ; le contenu du site est reconstruit depuis le dépôt.

```bash
docker compose exec db pg_dump -U portfolio portfolio > sauvegarde-$(date +%F).sql
```

## Variables

| Variable | Rôle |
|---|---|
| `SITE_DOMAIN` | Domaine servi par Caddy (le `www.` redirige vers lui) |
| `POSTGRES_DB`, `POSTGRES_USER` | Base et utilisateur PostgreSQL (`portfolio` par défaut) |
| `POSTGRES_PASSWORD` | Mot de passe de la base, obligatoire |

Le fichier `.env` reste sur le serveur : il est ignoré par git et par Docker.
