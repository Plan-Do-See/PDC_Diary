import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import SwaggerParser from '@apidevtools/swagger-parser';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = path.resolve(import.meta.dirname, '..');
const backend = path.resolve(process.argv[2] || path.join(root, '../PDC_Diary_Spring'));
const read = p => fs.readFileSync(path.join(root, p));
const bytes = read('contracts/openapi.yaml');
assert(bytes.equals(read('contracts/openapi.json')), 'JSON/YAML mirrors differ');
const api = JSON.parse(bytes), manifest = JSON.parse(read('contracts/api-publication.json'));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), manifest.sha256);
await SwaggerParser.validate(structuredClone(api), { resolve: { external: false } });
const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv); ajv.addSchema({ $id: 'urn:pds:api', ...api });
const methodNames = ['get', 'post', 'put', 'delete', 'patch'];
const ids = new Set(); let operations = 0, examples = 0;
for (const [route, item] of Object.entries(api.paths)) for (const [method, op] of Object.entries(item)) {
  if (!methodNames.includes(method)) continue;
  operations++; assert(op.operationId && !ids.has(op.operationId), `operationId: ${route}`); ids.add(op.operationId);
  assert(op.summary && op.description && op.tags?.length, `Missing frontend description: ${method} ${route}`);
  for (const name of [...route.matchAll(/\{([^}]+)\}/g)].map(m => m[1])) assert(op.parameters?.some(p => p.in === 'path' && p.name === name && p.required), `Missing path parameter ${name}`);
  if (route.startsWith('/api/v1/me/')) assert(op.security?.every(s => Object.hasOwn(s, 'session')), `Private scope security: ${route}`);
  if (method !== 'get' && route.startsWith('/api/v1/')) assert(op.security?.every(s => Object.hasOwn(s, 'csrf')), `CSRF missing: ${route}`);
  const media = [...Object.values(op.requestBody?.content || {}), ...Object.values(op.responses).flatMap(r => Object.values(r.content || {}))];
  for (const content of media) if (content.example !== undefined) {
    const validate = ajv.compile({ ...content.schema, components: api.components });
    assert(validate(content.example), `${method} ${route} example invalid: ${JSON.stringify(validate.errors)}`); examples++;
  }
}
assert.equal(operations, manifest.operations); assert.equal(Object.keys(api.paths).length, manifest.paths);
let sourceCheck = 'not available (portable mirror validated)';
if (fs.existsSync(path.join(backend, 'src/main/java'))) {
  assert(bytes.equals(fs.readFileSync(path.join(backend, 'contracts/openapi.yaml'))), 'Backend mirror is stale; run docs:sync');
  for (const file of manifest.source_files) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(backend, file.path))).digest('hex'), file.sha256, `Source changed since documentation sync: ${file.path}`);
  const expected = new Set();
  for (const file of manifest.source_files.filter(f => f.path.endsWith('Controller.java'))) {
    const src = fs.readFileSync(path.join(backend, file.path), 'utf8');
    const base = src.match(/@RequestMapping\("([^"]+)"\)/)?.[1] || '';
    const matches = [...src.matchAll(/@(Get|Post|Put|Delete)Mapping(?:\("([^"]*)"\))?/g)];
    for (const [index, match] of matches.entries()) {
      const route = base + (match[2] || ''), method = match[1].toLowerCase();
      const body = src.slice(match.index, matches[index + 1]?.index || src.length);
      for (const p of route.includes('{scope:public|me}') ? [route.replace('{scope:public|me}', 'public'), route.replace('{scope:public|me}', 'me')] : [route]) {
        expected.add(`${method} ${p}`); const op = api.paths[p]?.[method]; assert(op, `Missing controller route: ${method} ${p}`);
        assert.equal(Boolean(op.requestBody), body.includes('@RequestBody'), `Body contract: ${method} ${p}`);
        for (const h of body.matchAll(/@RequestHeader\("([^"]+)"\)/g)) assert(op.parameters?.some(x => x.in === 'header' && x.name === h[1] && x.required), `Missing header ${h[1]}: ${p}`);
      }
    }
  }
  for (const p of ['post /api/v1/auth/logout', 'get /oauth2/authorization/{provider}', 'get /login/oauth2/code/{provider}', 'get /actuator/health']) expected.add(p);
  const actual = new Set(Object.entries(api.paths).flatMap(([p, item]) => Object.keys(item).filter(m => methodNames.includes(m)).map(m => `${m} ${p}`)));
  assert.deepEqual([...actual].sort(), [...expected].sort(), 'Documented and implemented routes differ');
  sourceCheck = `${expected.size} controller/framework operations matched`;
}
console.log(JSON.stringify({ openapi: api.info.version, paths: manifest.paths, operations, examplesValidated: examples, sourceCheck, schemas: Object.keys(api.components.schemas).length }, null, 2));
