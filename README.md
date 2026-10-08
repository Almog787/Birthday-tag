# 🤖 Agency-Agents: Curated AI Agent Personas
> A production-grade collection of specialized AI agent personas for **Cursor**, **Claude Code**, **GitHub Copilot**, **Gemini CLI**, **Windsurf**, and **Aider**.
> 
> *Clone of [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) with an integrated interactive Web Studio, live persona execution, and 1-click IDE export.*

---

## 🎯 What is Agency-Agents?

Generic LLMs frequently produce inconsistent boilerplate and subtle hallucinations because they lack domain constraints, strict architectural boundaries, and standardized deliverables.

**Agency-Agents** organizes the software development, design, and marketing lifecycle into **14+ professional divisions** containing specialized AI agent personas. Each agent has:
- **Dual-Layer Architecture**: YAML frontmatter (for routing, metadata, tags, and tools) + Markdown payload (strict behavioral instructions, negative guardrails, and success metrics).
- **Domain-Specific Deliverables**: Predictable, production-ready outputs instead of hand-waving explanations.
- **Shared Memory & Workflow Interoperability**: Agents can be assembled into multi-agent pipelines (e.g., *Product Manager* ➔ *UI Designer* ➔ *Frontend Developer* ➔ *Backend Architect* ➔ *Code Reviewer*).

---

## 🏢 Professional Divisions Taxonomy

```text
agency-agents/
├── divisions/
│   ├── engineering/          # Backend Architect, Frontend Dev, Security Engineer, DevOps Automator, Code Reviewer...
│   ├── design/               # UI Designer, UX Researcher, Brand Guardian, Design System Lead...
│   ├── product/              # Product Manager, Trend Researcher, Feedback Synthesizer...
│   ├── marketing/            # Growth Hacker, SEO & GEO Specialist, Content Creator...
│   ├── sales/                # Pitch Deck Architect, Proposal Writer, Sales Engineer...
│   ├── finance/              # SaaS Financial Modeler, Unit Economics Auditor...
│   ├── testing/              # E2E Test Engineer, Load Test Specialist, QA Lead...
│   ├── specialized/          # Prompt Engineer, MCP Server Architect, Token Optimizer...
│   ├── spatial-computing/    # VisionOS Architect, WebXR Engineer...
│   ├── game-development/     # Game Mechanics Designer, Level Architect...
│   └── project-management/   # Scrum Master, Agile Delivery Director...
├── scripts/
│   ├── install-agents.sh     # Interactive CLI setup script
│   ├── export-agents.js      # Generator for .cursorrules, CLAUDE.md, and Copilot
│   └── validate-agents.js    # Schema and Markdown validator
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents
```

### 2. Run the Interactive Installer
```bash
bash scripts/install-agents.sh
```

### 3. Export Rules for Your Favorite IDE

#### Cursor IDE (`.cursorrules`)
```bash
node scripts/export-agents.js --target=cursor
```

#### Claude Code (`CLAUDE.md`)
```bash
node scripts/export-agents.js --target=claude
```

#### GitHub Copilot (`.github/copilot-instructions.md`)
```bash
node scripts/export-agents.js --target=copilot
```

---

## 💡 How to Activate Agents in Conversations

Once installed, simply reference the agent in your prompt:

- **Backend Architecture**:  
  `"Act as @Backend Architect and design a high-throughput PostgreSQL schema with foreign keys, partitioned audit tables, and indexing strategies for a multi-tenant SaaS."`

- **Code Review**:  
  `"Act as @Code Reviewer and audit this pull request diff for OWASP security vulnerabilities, unhandled promise rejections, and N+1 query bottlenecks."`

- **Frontend Development**:  
  `"Act as @Frontend Developer and build an accessible, pixel-perfect React + Tailwind component ensuring CLS = 0 and WCAG AAA compliance."`

- **Prompt Engineering**:  
  `"Act as @Prompt Engineer and refine this system prompt using XML delimiters, few-shot examples, and strict JSON output schemas."`

---

## 🧪 Validating Agent Definitions

You can validate all YAML frontmatters and Markdown integrity by running:
```bash
node scripts/validate-agents.js
```

---

## 🌐 Interactive Web Studio
This repository comes with a full-featured web dashboard allowing you to:
- Browse, search, and filter all agent personas by division, tech stack, and tags.
- Chat in real-time with any Agent persona using Gemini.
- Assemble Multi-Agent Teams and run collaborative project workflows.
- View, copy, and export `.cursorrules`, `CLAUDE.md`, or GitHub Copilot instructions with 1-click.
