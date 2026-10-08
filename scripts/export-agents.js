#!/usr/bin/env node
/**
 * Agency-Agents Export Utility
 * Converts markdown agent personas with YAML frontmatter into IDE-compatible configuration files.
 */

import fs from 'fs';
import path from 'path';

const DIVISIONS_DIR = path.join(process.cwd(), 'divisions');

function parseAgentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const yamlBlock = match[1];
  const markdownBody = match[2].trim();
  const metadata = {};

  yamlBlock.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith('[') && val.endsWith(']')) {
        try { val = JSON.parse(val); } catch {}
      }
      metadata[key] = val;
    }
  });

  return { metadata, markdownBody, filePath };
}

export function getAllAgents() {
  const agents = [];
  if (!fs.existsSync(DIVISIONS_DIR)) return agents;

  const divisionFolders = fs.readdirSync(DIVISIONS_DIR);
  for (const div of divisionFolders) {
    const divPath = path.join(DIVISIONS_DIR, div);
    if (!fs.statSync(divPath).isDirectory()) continue;

    const files = fs.readdirSync(divPath).filter(f => f.endsWith('.md'));
    for (const f of files) {
      const agent = parseAgentFile(path.join(divPath, f));
      if (agent) {
        agents.push({
          ...agent.metadata,
          division: agent.metadata.division || div,
          prompt: agent.markdownBody,
          fileName: f
        });
      }
    }
  }
  return agents;
}

function exportTarget(target) {
  const agents = getAllAgents();
  console.log(`Found ${agents.length} agent persona(s) across divisions.`);

  if (target === 'cursor' || target === 'all') {
    const cursorRulesContent = `# Agency-Agents (.cursorrules)\n# Converted for Cursor IDE\n\n` +
      agents.map(a => `## @${a.name} (${a.division})\n${a.description}\n\n\`\`\`markdown\n${a.prompt}\n\`\`\`\n`).join('\n---\n\n');
    fs.writeFileSync(path.join(process.cwd(), '.cursorrules'), cursorRulesContent, 'utf-8');
    console.log('✔ Generated .cursorrules successfully');
  }

  if (target === 'claude' || target === 'all') {
    const claudeMdContent = `# CLAUDE.md - Agency Agents Context\n\n` +
      agents.map(a => `### @${a.name} [${a.division}]\n${a.prompt}\n`).join('\n\n---\n\n');
    fs.writeFileSync(path.join(process.cwd(), 'CLAUDE.md'), claudeMdContent, 'utf-8');
    console.log('✔ Generated CLAUDE.md successfully');
  }

  if (target === 'copilot' || target === 'all') {
    const copilotDir = path.join(process.cwd(), '.github');
    if (!fs.existsSync(copilotDir)) fs.mkdirSync(copilotDir, { recursive: true });
    const copilotContent = `# GitHub Copilot Custom Instructions\n\n` +
      agents.map(a => `### Persona: ${a.name} (${a.division})\n${a.prompt}\n`).join('\n---\n');
    fs.writeFileSync(path.join(copilotDir, 'copilot-instructions.md'), copilotContent, 'utf-8');
    console.log('✔ Generated .github/copilot-instructions.md successfully');
  }
}

const args = process.argv.slice(2);
const targetArg = args.find(a => a.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1] : 'all';

if (import.meta.url === `file://${process.argv[1]}`) {
  exportTarget(target);
}
