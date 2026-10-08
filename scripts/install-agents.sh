#!/usr/bin/env bash
# ==============================================================================
# Agency-Agents: Local Installation & IDE Integration Script
# Author: Michael Sitarzewski (msitarzewski/agency-agents)
# ==============================================================================

set -e

echo "======================================================================"
echo "          🤖 AGENCY-AGENTS: SPECIALIZED AI PERSONAS INSTALLER        "
echo "======================================================================"

TARGET_DIR="${1:-$HOME/.agency-agents}"
mkdir -p "$TARGET_DIR"

echo "📂 Installing agent definitions to: $TARGET_DIR"
cp -r divisions/ "$TARGET_DIR/" || true

echo ""
echo "Select your primary AI Coding Environment to configure:"
echo "1) Cursor (.cursorrules)"
echo "2) Claude Code (CLAUDE.md)"
echo "3) GitHub Copilot (.github/copilot-instructions.md)"
echo "4) Gemini CLI (.geminiconfig)"
echo "5) All Environments"
echo ""
read -p "Enter choice [1-5]: " CHOICE

case "$CHOICE" in
  1)
    echo "⚙️ Exporting to .cursorrules..."
    node scripts/export-agents.js --target=cursor
    ;;
  2)
    echo "⚙️ Exporting to CLAUDE.md..."
    node scripts/export-agents.js --target=claude
    ;;
  3)
    echo "⚙️ Exporting to GitHub Copilot..."
    node scripts/export-agents.js --target=copilot
    ;;
  4)
    echo "⚙️ Exporting to Gemini CLI..."
    node scripts/export-agents.js --target=gemini
    ;;
  5)
    echo "⚙️ Exporting to All supported targets..."
    node scripts/export-agents.js --target=all
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "✅ Installation complete! Reference any agent in your prompts by typing: @[Agent Name]"
echo "Example: 'Act as @Backend Architect and design the PostgreSQL schema for a multi-tenant SaaS.'"
