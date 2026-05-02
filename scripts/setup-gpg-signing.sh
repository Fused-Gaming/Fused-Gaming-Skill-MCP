#!/bin/bash

# Setup GPG Signing for Git Commits
# This script helps configure GPG key signing for your local git environment

set -e

echo "🔐 Git GPG Signing Setup"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if GPG is installed
if ! command -v gpg &> /dev/null; then
    echo -e "${RED}❌ GPG is not installed${NC}"
    echo ""
    echo "Install GPG:"
    echo "  macOS: brew install gnupg"
    echo "  Ubuntu/Debian: sudo apt-get install gnupg"
    echo "  Windows: https://www.gnupg.org/download/"
    exit 1
fi

echo -e "${GREEN}✓ GPG is installed${NC}"
echo "  Version: $(gpg --version | head -1)"
echo ""

# Check for existing keys
echo -e "${BLUE}📋 Checking for existing GPG keys...${NC}"
KEYS=$(gpg --list-secret-keys --keyid-format=long | grep -c "sec" || true)

if [ "$KEYS" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $KEYS existing GPG key(s)${NC}"
    echo ""
    echo "Your keys:"
    gpg --list-secret-keys --keyid-format=long
    echo ""
else
    echo -e "${YELLOW}⚠ No existing GPG keys found${NC}"
fi

echo ""
echo -e "${BLUE}Setup Options:${NC}"
echo "1. Generate a new GPG key"
echo "2. Use existing GPG key"
echo "3. Export GPG key for GitHub Actions"
echo "4. Test GPG signing"
echo "5. Configure git to use GPG"
echo "6. Exit"
echo ""

read -p "Select option (1-6): " option

case $option in
    1)
        echo ""
        echo -e "${BLUE}🔑 Generating new GPG key...${NC}"
        echo ""
        echo "Follow the interactive prompts:"
        echo "  - Key type: RSA (recommend option 1)"
        echo "  - Key size: 4096 (recommended)"
        echo "  - Expiration: 0 (no expiration) or 2y (2 years)"
        echo "  - Real name: Your name"
        echo "  - Email: Your email address"
        echo "  - Passphrase: Strong password (16+ chars recommended)"
        echo ""
        gpg --full-generate-key
        echo ""
        echo -e "${GREEN}✓ Key generated successfully${NC}"
        ;;
    2)
        echo ""
        echo -e "${BLUE}🔑 Using existing GPG key${NC}"
        gpg --list-secret-keys --keyid-format=long
        echo ""
        read -p "Enter the Key ID (long form): " KEY_ID

        if gpg --list-secret-keys "$KEY_ID" &> /dev/null; then
            echo -e "${GREEN}✓ Key found: $KEY_ID${NC}"
        else
            echo -e "${RED}❌ Key not found${NC}"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo -e "${BLUE}📤 Exporting GPG key for GitHub Actions${NC}"
        echo ""
        gpg --list-secret-keys --keyid-format=long
        echo ""
        read -p "Enter the email or Key ID to export: " KEY_IDENTIFIER

        OUTPUT_FILE="gpg-private-key.asc"

        if gpg --armor --export-secret-keys "$KEY_IDENTIFIER" > "$OUTPUT_FILE"; then
            echo ""
            echo -e "${GREEN}✓ Key exported to: $OUTPUT_FILE${NC}"
            echo ""
            echo "Next steps:"
            echo "1. Copy the contents of $OUTPUT_FILE"
            echo "2. Go to GitHub repository → Settings → Secrets and variables → Actions"
            echo "3. Click 'New repository secret'"
            echo "4. Name: GPG_PRIVATE_KEY"
            echo "5. Paste the contents"
            echo "6. Also add your GPG passphrase as GPG_PASSPHRASE secret"
            echo ""
            echo -e "${YELLOW}⚠️  IMPORTANT: Never commit $OUTPUT_FILE to version control${NC}"
            echo "   Add to .gitignore: gpg-private-key.asc"
            echo ""
        else
            echo -e "${RED}❌ Export failed${NC}"
            exit 1
        fi
        ;;
    4)
        echo ""
        echo -e "${BLUE}🧪 Testing GPG signing${NC}"
        echo ""
        read -p "Enter the email or Key ID to test: " KEY_IDENTIFIER

        if echo "test message" | gpg --armor --detach-sign --local-user "$KEY_IDENTIFIER" > /tmp/test.sig; then
            echo -e "${GREEN}✓ Signing works correctly${NC}"
            rm -f /tmp/test.sig
            echo ""
            echo "Your GPG key is ready for signing commits!"
        else
            echo -e "${RED}❌ Signing failed${NC}"
            exit 1
        fi
        ;;
    5)
        echo ""
        echo -e "${BLUE}⚙️  Configuring git to use GPG${NC}"
        echo ""
        gpg --list-secret-keys --keyid-format=long
        echo ""
        read -p "Enter the Key ID (short form, last 16 chars): " KEY_ID
        read -p "Enter your git user.name: " GIT_NAME
        read -p "Enter your git user.email: " GIT_EMAIL

        echo ""
        echo -e "${BLUE}Configuring git...${NC}"

        git config --global user.name "$GIT_NAME"
        git config --global user.email "$GIT_EMAIL"
        git config --global user.signingkey "$KEY_ID"
        git config --global commit.gpgsign true
        git config --global tag.gpgsign true

        echo ""
        echo -e "${GREEN}✓ Git configuration complete${NC}"
        echo ""
        echo "Configuration:"
        git config --global --list | grep -E "user|gpg"
        echo ""
        echo "Now commits will be signed automatically:"
        echo "  git commit -m \"message\"  # Auto-signed"
        echo "  git tag -s v1.0.0        # Signed tag"
        ;;
    6)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Resources:"
echo "  - Publish Guide: docs/PUBLISH_GUIDE.md"
echo "  - GitHub Actions: .github/workflows/publish.yml"
echo "  - NPM Publishing: docs/NPM_PUBLISHING.md"
