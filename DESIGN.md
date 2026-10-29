# Design

## Visual Theme

Light. Recruteur en journée, bureau, lumière naturelle. Fond légèrement teinté bleu vers le froid — pas blanc pur, pas crème. Grille de points technique en fond (dot grid ingénieur, subtil). Film grain à 3-4 % d'opacité sur tout le site.

## Colors

Strategy: **Committed** — le bleu OKLCH porte 30-50 % de la surface hero. Les autres sections reviennent sur fond teinté neutre.

```
--color-bg:           oklch(97.2% 0.008 240)   /* fond global teinté bleu-froid */
--color-bg-card:      oklch(99.2% 0.004 240)   /* cartes et surfaces élevées */
--color-bg-subtle:    oklch(95.5% 0.013 240)   /* zones légèrement enfoncées */
--color-text:         oklch(22% 0.05 242)      /* texte principal — navy profond */
--color-text-muted:   oklch(52% 0.04 245)      /* texte secondaire */
--color-text-light:   oklch(68% 0.035 245)     /* texte tertiaire, labels */
--color-accent:       oklch(51% 0.18 245)      /* bleu brand */
--color-accent-light: oklch(94% 0.04 245)      /* fond accent doux */
--color-accent-hover: oklch(43% 0.17 245)      /* hover */
--color-green:        oklch(57% 0.14 155)      /* santé, bio, stages */
--color-green-light:  oklch(95% 0.04 155)      /* fond green doux */
--color-border:       oklch(88% 0.022 240)     /* séparateurs */
--color-border-light: oklch(94% 0.012 240)     /* séparateurs légers */
```

## Typography

Fonts déjà commitées — identité en place, pas de changement.

- **Heading**: Newsreader (serif, display cuts utilisés à grande échelle)
- **Body**: Inter
- **Mono**: JetBrains Mono (données chiffrées, labels techniques, code)

Scale fluid (clamp), ratio ≥ 1.30 entre les paliers :
- Display: clamp(56px, 9.5vw, 116px), weight 400
- H1: clamp(40px, 5.5vw, 72px), weight 400
- H2: clamp(32px, 4vw, 48px), weight 400
- H3: clamp(20px, 2.5vw, 28px), weight 500
- Body large: clamp(16px, 1.8vw, 19px), line-height 1.75
- Body: 15-17px, line-height 1.8
- Label: 11-12px, uppercase, letter-spacing 0.08-0.1em
- Data/mono: 12-14px JetBrains Mono

## Spacing

Rythme varié — pas de padding identique partout.
- Section majeure : padding-block 120-140px
- Section mineure : padding-block 80-100px
- Composant dense : padding 24-40px
- Élément serré : padding 8-16px

## Elevation

- Niveau 0 : fond page
- Niveau 1 : cartes (border 1px border-light + box-shadow 0 2px 8px oklch(0% 0 0 / 4%))
- Niveau 2 : cartes hover (box-shadow 0 16px 48px oklch(51% 0.18 245 / 12%))
- Niveau 3 : popovers, dropdowns (box-shadow 0 24px 64px oklch(0% 0 0 / 14%))

## Components

### Buttons
- Primary: background accent, color white, border-radius 14px, padding 16px 34px, shadow
- Ghost: border 1.5px border, color text, transparent background
- Hover scale: 1.04, transition ease-out-quart

### Cards
- border-radius: 20px
- border: 1px border
- background: bg-card
- Pas de side-stripe borders. Accent en fond, en texte, ou avec un blot de couleur.

### Tags/Badges
- border-radius: 20px (pill)
- padding: 5px 12px
- background: accent-light, color accent (pour accent)
- ou background: bg-subtle, color text-muted (pour neutres)

### Inputs
- border-radius: 10px
- border: 1.5px border
- focus: border accent
- background: bg-card

## Motion

- Ease préféré : cubic-bezier(0.22, 1, 0.36, 1) (ease-out-quint approximé)
- Durée reveals : 0.6-0.9s
- Stagger entre enfants : 0.08-0.12s
- Pas de bounce, pas d'elastic
- `prefers-reduced-motion`: animations désactivées, transitions ≤ 200ms
