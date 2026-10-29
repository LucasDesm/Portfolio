// Exporte le contenu du site (src/lib/data.ts) vers le JSON lu par l'API Spring Boot.
// data.ts reste l'unique source : le site et l'API servent exactement le même contenu.
//
//   npm run export-content          → écrit le JSON
//   npm run export-content -- --check → échoue si le JSON n'est plus à jour (CI)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PARCOURS, PROJECTS, STAGES } from '../src/lib/data.ts'

const here = dirname(fileURLToPath(import.meta.url))
const target = resolve(here, '../../backend-java/src/main/resources/content/portfolio.json')

const json = JSON.stringify({ projects: PROJECTS, parcours: PARCOURS, stages: STAGES }, null, 2) + '\n'

if (process.argv.includes('--check')) {
  // git peut convertir les fins de ligne sous Windows : on compare le contenu, pas les octets
  const current = existsSync(target) ? readFileSync(target, 'utf8').replace(/\r\n/g, '\n') : ''
  if (current !== json) {
    console.error(`${target} n'est plus à jour : lancez npm run export-content`)
    process.exit(1)
  }
  console.log('Contenu de l\'API à jour.')
} else {
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, json)
  console.log(`${PROJECTS.length} projets, ${PARCOURS.length} étapes, ${STAGES.length} stages → ${target}`)
}
