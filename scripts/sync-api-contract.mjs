import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const backend = path.resolve(process.argv[2] || path.join(root, '../PDC_Diary_Spring'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bytes = fs.readFileSync(path.join(backend, 'contracts/openapi.yaml'));
const api = JSON.parse(bytes);
if (api.openapi !== '3.1.0') throw new Error('Expected OpenAPI 3.1 source');
fs.writeFileSync(path.join(root, 'contracts/openapi.yaml'), bytes);
fs.writeFileSync(path.join(root, 'contracts/openapi.json'), bytes);
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const sources = walk(path.join(backend, 'src/main')).filter(p => /\.(java|yaml|sql)$/.test(p)).sort();
let commit = null;
try { commit = execFileSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: backend, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
const manifest = {
  version: 1, synced_at: new Date().toISOString(), source_repository: 'https://github.com/Plan-Do-See/PDC_Diary_Spring',
  source_path: 'contracts/openapi.yaml', source_commit: commit,
  source_state: 'working_tree_snapshot_not_deployed_release', openapi_version: api.info.version,
  sha256: hash(bytes), paths: Object.keys(api.paths).length,
  operations: Object.values(api.paths).reduce((n, p) => n + Object.keys(p).filter(m => ['get','post','put','delete','patch'].includes(m)).length, 0),
  source_files: sources.map(p => ({ path: path.relative(backend, p).replaceAll('\\', '/'), sha256: hash(fs.readFileSync(p)) }))
};
fs.writeFileSync(path.join(root, 'contracts/api-publication.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Synced OpenAPI ${api.info.version}: ${manifest.paths} paths, ${manifest.operations} operations.`);
