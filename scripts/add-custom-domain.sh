#!/bin/bash
# Add custom domain to Cloudflare Pages project
# Usage: ./scripts/add-custom-domain.sh [domain]

DOMAIN="${1:-1319.tryambakam.space}"
PROJECT_NAME="somatic-canticles"

echo "Adding custom domain $DOMAIN to project $PROJECT_NAME..."

# Get account ID from wrangler config or environment
ACCOUNT_ID=$(grep -o 'account_id = "[^"]*"' wrangler.toml 2>/dev/null | cut -d'"' -f2 || echo "")

if [ -z "$ACCOUNT_ID" ]; then
    echo "Account ID not found in wrangler.toml"
    echo "Please set CLOUDFLARE_ACCOUNT_ID environment variable or update wrangler.toml"
    exit 1
fi

# Check for API token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "CLOUDFLARE_API_TOKEN not set"
    echo "Please set your Cloudflare API token:"
    echo "  export CLOUDFLARE_API_TOKEN='your-token-here'"
    echo ""
    echo "Get your token from: https://dash.cloudflare.com/profile/api-tokens"
    echo "Required permissions: Zone:Read, Page Rules:Edit, Account:Read"
    exit 1
fi

# Add custom domain via API
echo "Using Account ID: $ACCOUNT_ID"
echo ""

curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/domains" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"domain\": \"$DOMAIN\"}"

echo ""
echo ""
echo "Domain addition request sent!"
echo ""
echo "Next steps:"
echo "1. Check Cloudflare Dashboard → Pages → $PROJECT_NAME → Custom Domains"
echo "2. The domain should show as 'Active' once DNS is configured"
echo "3. If needed, add a CNAME record: $DOMAIN → somatic-canticles.pages.dev"
