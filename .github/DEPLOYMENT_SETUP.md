# Deployment Setup Guide

This guide explains how to configure your GitHub repository for successful deployment of the Biet Network application.

## Required GitHub Secrets

The following secrets must be configured in your GitHub repository for the deployment to work correctly:

### 1. WALLETCONNECT_PROJECT_ID

**Purpose**: Required for WalletConnect functionality in the web application.

**How to obtain**:
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign in or create an account
3. Create a new project
4. Copy the Project ID

**How to add to GitHub**:
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `WALLETCONNECT_PROJECT_ID`
5. Value: Paste your WalletConnect Project ID
6. Click **Add secret**

## Verifying the Setup

After adding the secret:

1. Go to the **Actions** tab in your GitHub repository
2. Manually trigger the workflow or push to the `BIE-1` branch
3. Check the workflow logs for the "Verify WalletConnect Project ID" step
4. You should see: `✓ WalletConnect Project ID is configured`

If you see a warning instead, the secret is not properly configured.

## Environment Variables in Production

The following environment variables are automatically set during the build process:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Set from the GitHub secret
- `GITHUB_ACTIONS`: Set to 'true' during CI/CD
- `NEXT_TELEMETRY_DISABLED`: Set to 1 to disable Next.js telemetry

## Troubleshooting

### WalletConnect not working in production

**Symptom**: Console warning: "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set"

**Solution**:
1. Verify the secret is added to GitHub (see above)
2. Ensure the secret name is exactly `WALLETCONNECT_PROJECT_ID` (without the `NEXT_PUBLIC_` prefix)
3. Re-run the deployment workflow
4. Check the build logs to confirm the environment variable is set

### Build fails with environment variable errors

**Solution**:
1. Check that all required secrets are configured
2. Verify the workflow file (`.github/workflows/nextjs.yml`) is up to date
3. Ensure the secret values don't contain special characters that need escaping

## Local Development

For local development, create a `.env.local` file in the `apps/web` directory:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

**Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Additional Resources

- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
