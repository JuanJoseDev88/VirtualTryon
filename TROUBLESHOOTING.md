# Troubleshooting Guide

## FASHN_API_KEY is not configured

If you're getting the error "FASHN_API_KEY is not configured", try these steps:

### 1. Check your .env file
Make sure your `.env` file in the root directory contains:
```
VITE_FASHN_API_KEY=your_actual_api_key_here
```

### 2. Restart the development server
After adding or modifying environment variables, you MUST restart the Astro dev server:
```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
# or
yarn dev
```

### 3. Check the browser console
Open browser developer tools and look for environment variable debug logs. You should see:
```
Environment check: { hasApiKey: true, apiKeyLength: 37, allEnvVars: [...] }
```

### 4. Verify .env file location
The `.env` file must be in the root directory of your project (same level as `package.json`).

### 5. Check for hidden characters
Make sure there are no extra spaces or hidden characters in your .env file:
```
# Wrong (has spaces)
VITE_FASHN_API_KEY = your_key_here

# Correct (no spaces around =)
VITE_FASHN_API_KEY=your_key_here
```

### 6. Alternative: Hardcode for testing
If environment variables still don't work, you can temporarily hardcode the API key in `src/data/services/tryOnService.ts`:

```typescript
// Temporary fix - replace with your actual API key
const FASHN_API_KEY = 'your_actual_api_key_here';
// const FASHN_API_KEY = import.meta.env.VITE_FASHN_API_KEY;
```

**Remember to remove the hardcoded key before committing to version control!**

### 7. Check Astro version
Make sure you're using a recent version of Astro that supports `import.meta.env`:
```bash
npm list astro
```

### 8. Clear cache
Sometimes clearing the build cache helps:
```bash
rm -rf dist/
rm -rf .astro/
npm run dev
```