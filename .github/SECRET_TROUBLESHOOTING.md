# GitHub Secrets Troubleshooting Guide

## Issue: Secret appears empty in GitHub Actions

If you're seeing `if [ -z "" ]` in your workflow logs, it means the secret is not being accessed correctly.

## Common Causes & Solutions

### 1. ✅ Verify Secret Name (Most Common)

**Problem**: Secret name doesn't match exactly.

**Solution**:
- Secret name MUST be: `WALLETCONNECT_PROJECT_ID`
- Case-sensitive! `walletconnect_project_id` ≠ `WALLETCONNECT_PROJECT_ID`
- No spaces before or after the name
- No special characters

**How to check**:
1. Go to: `https://github.com/YOUR_USERNAME/bietnetwork.org/settings/secrets/actions`
2. Look for a secret named exactly: `WALLETCONNECT_PROJECT_ID`
3. If it has a different name, delete it and recreate with the correct name

### 2. ✅ Check Secret Location

**Problem**: Secret is set in the wrong place.

**Solution**: Secrets must be set at the **Repository** level, not:
- ❌ Organization level (unless you want it there)
- ❌ Environment level (we're not using environments)
- ❌ In a `.env` file (that's for local development only)

**Correct location**:
```
Repository → Settings → Secrets and variables → Actions → Repository secrets
```

### 3. ✅ Verify Repository Access

**Problem**: You don't have the right permissions.

**Solution**:
- You need **Admin** or **Write** access to the repository
- If you're not the owner, ask the repository owner to add the secret
- Check your role: `Repository → Settings → Collaborators`

### 4. ✅ Check Branch Protection Rules

**Problem**: Branch protection might restrict secret access.

**Solution**:
1. Go to: `Repository → Settings → Branches`
2. Check if `BIE-1` branch has protection rules
3. Ensure "Require approval for all outside collaborators" is not blocking you

### 5. ✅ Verify Workflow Permissions

**Problem**: Workflow doesn't have permission to access secrets.

**Solution**:
1. Go to: `Repository → Settings → Actions → General`
2. Under "Workflow permissions", ensure it's set to:
   - ✅ "Read and write permissions" OR
   - ✅ "Read repository contents and packages permissions" with secrets access
3. Make sure "Allow GitHub Actions to create and approve pull requests" is enabled if needed

### 6. ✅ Secret Value Issues

**Problem**: Secret value is invalid or empty.

**Solution**:
- Secret value must not be empty
- No leading/trailing spaces
- Should be a valid WalletConnect Project ID (typically 32 characters)
- Get it from: https://cloud.walletconnect.com/

**How to verify**:
1. Delete the existing secret
2. Create a new one with the same name
3. Paste the value carefully (no extra spaces)
4. Save and re-run the workflow

## Step-by-Step Verification

### Step 1: Check if secret exists
```bash
# You can't see the value, but you can see if it exists
# Go to: https://github.com/YOUR_USERNAME/bietnetwork.org/settings/secrets/actions
# You should see: WALLETCONNECT_PROJECT_ID in the list
```

### Step 2: Verify the workflow file
The workflow should have:
```yaml
env:
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: ${{ secrets.WALLETCONNECT_PROJECT_ID }}
```

### Step 3: Re-run the workflow
1. Go to: `Actions` tab
2. Select the failed workflow run
3. Click "Re-run all jobs"
4. Check the "Verify WalletConnect Project ID" step
5. You should see: ✓ WalletConnect Project ID is configured

## Still Not Working?

### Try this debug workflow:

Create a test workflow to verify secrets are accessible:

```yaml
name: Debug Secrets
on: workflow_dispatch

jobs:
  debug:
    runs-on: ubuntu-latest
    steps:
      - name: Check Secret
        run: |
          if [ -z "${{ secrets.WALLETCONNECT_PROJECT_ID }}" ]; then
            echo "Secret is EMPTY or NOT SET"
          else
            echo "Secret is SET"
            echo "Length: ${#WALLETCONNECT_PROJECT_ID}"
          fi
        env:
          WALLETCONNECT_PROJECT_ID: ${{ secrets.WALLETCONNECT_PROJECT_ID }}
```

### Contact GitHub Support

If none of the above works:
1. Ensure you're the repository owner or have admin access
2. Try creating the secret through GitHub CLI:
   ```bash
   gh secret set WALLETCONNECT_PROJECT_ID --body "your_project_id"
   ```
3. Contact GitHub Support if the issue persists

## Quick Checklist

- [ ] Secret name is exactly: `WALLETCONNECT_PROJECT_ID`
- [ ] Secret is set at Repository level (not Organization or Environment)
- [ ] You have Admin/Write access to the repository
- [ ] Secret value is not empty
- [ ] No extra spaces in name or value
- [ ] Workflow file uses: `${{ secrets.WALLETCONNECT_PROJECT_ID }}`
- [ ] Branch protection rules don't block secret access
- [ ] Workflow permissions allow secret access

## Getting Your WalletConnect Project ID

1. Visit: https://cloud.walletconnect.com/
2. Sign in or create an account
3. Click "Create New Project" or select existing project
4. Copy the "Project ID" (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
5. This is the value you need to add as the secret

## Example: Correct Secret Setup

**Name**: `WALLETCONNECT_PROJECT_ID`  
**Value**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`  
**Location**: Repository → Settings → Secrets and variables → Actions → Repository secrets

---

**Need more help?** Check the main deployment guide: [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md)
