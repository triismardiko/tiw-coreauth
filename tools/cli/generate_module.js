#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

if (args[0] === 'generate' && args[1] === 'module') {
  const moduleName = args[2];
  if (!moduleName) {
    console.error('❌ Nama module harus diberikan.');
    process.exit(1);
  }

  const modulePath = path.join(__dirname, '../../src/modules', moduleName);

  if (fs.existsSync(modulePath)) {
    console.error('❌ Module sudah ada.');
    process.exit(1);
  }

  // Buat folder utama dan subfolder
  fs.mkdirSync(modulePath, { recursive: true });
  fs.mkdirSync(path.join(modulePath, 'middlewares'));
  fs.mkdirSync(path.join(modulePath, 'models'));
  fs.mkdirSync(path.join(modulePath, 'controllers'));
    fs.mkdirSync(path.join(modulePath, 'entities'));
      fs.mkdirSync(path.join(modulePath, 'routes'));
        fs.mkdirSync(path.join(modulePath, 'schemas'));
    fs.mkdirSync(path.join(modulePath, 'services'));
  
  // File list
  const files = {
    'controllers': `// ${moduleName}.controller.js\nexport async function exampleHandler(req, reply) {\n  reply.send({ message: "${moduleName} works!" });\n}`,
    'routes': `// ${moduleName}.route.js\nexport default async function ${moduleName}Routes(fastify) {\n  fastify.get('/${moduleName}', async (req, reply) => {\n    reply.send({ message: '${moduleName} route OK' });\n  });\n}`,
    'schemas': `// ${moduleName}.schema.js\nexport const ${moduleName}Schema = {\n  tags: ['${moduleName}'],\n  summary: 'Example schema',\n};`,
    'services': `// ${moduleName}.service.js\nexport async function doSomething() {\n  return 'ok';\n}`
  };

  for (const [folder, content] of Object.entries(files)) {
    const filePath = path.join(modulePath, `${folder}/${moduleName}.${folder}.js`);
    fs.writeFileSync(filePath, content);
  }

  console.log(`✅ Module "${moduleName}" berhasil dibuat di src/modules/${moduleName}`);
} else {
  console.log('Perintah tidak dikenali. Gunakan:');
  console.log('node cli generate module <nama>');
}
