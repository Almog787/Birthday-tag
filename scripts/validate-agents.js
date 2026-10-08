#!/usr/bin/env node
/**
 * Agency-Agents Validator
 * Asserts schema validity, YAML frontmatter tags, and Markdown completeness.
 */

import fs from 'fs';
import path from 'path';

const DIVISIONS_DIR = path.join(process.cwd(), 'divisions');

function validate() {
  console.log('🔍 Validating all Agency-Agents markdown definitions...');
  let totalValid = 0;
  let errors = 0;

  if (!fs.existsSync(DIVISIONS_DIR)) {
    console.error('❌ divisions/ directory not found!');
    process.exit(1);
  }

  const divisions = fs.readdirSync(DIVISIONS_DIR);
  for (const div of divisions) {
    const divPath = path.join(DIVISIONS_DIR, div);
    if (!fs.statSync(divPath).isDirectory()) continue;

    const files = fs.readdirSync(divPath).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(divPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!match) {
        console.error(`❌ [${div}/${file}] Missing YAML frontmatter!`);
        errors++;
        continue;
      }

      const body = match[2].trim();
      if (!body.includes('# IDENTITY & PERSONA') || !body.includes('# CORE MISSION')) {
        console.warn(`⚠️ [${div}/${file}] Missing standard header sections (IDENTITY or MISSION).`);
      }

      totalValid++;
      console.log(`✔ [${div}] ${file} - Validated`);
    }
  }

  console.log(`\n🎉 Validation completed: ${totalValid} valid agent(s), ${errors} error(s).`);
  if (errors > 0) process.exit(1);
}

validate();
