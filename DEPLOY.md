# Deployment Guide for MrTiendaWeb

This document explains how to configure GitHub Actions to build and push Docker images to your Azure Container Registry (ACR), and how to update the Azure Container App to use the pushed image.

Two workflows were added:

- `.github/workflows/deploy-container-app.yml` — builds, pushes, updates the Container App and runs headless checks. Requires `AZURE_CREDENTIALS` (service principal) to be set as a GitHub Secret.
- `.github/workflows/push-image.yml` — builds and pushes an amd64 image to ACR using ACR username/password (for accounts that cannot create a service principal). After the run it uploads an `image-tag.txt` artifact containing the pushed image tag.

If you cannot create a service principal (student account), use `push-image.yml` and then manually update the Container App using the `az` CLI (instructions below).

## Enable ACR admin user (if you will use ACR username/password)
1. Open Azure Portal → your ACR instance (`mrtiendacr`).
2. Settings → Access keys (or "Access control (IAM)" depending on portal layout).
3. Enable "Admin user" and copy the Username and Password (or one of the passwords).
4. In your GitHub repository settings → Secrets → Actions, add the following secrets:
   - `ACR_LOGIN_SERVER` — e.g. `mrtiendacr.azurecr.io`
   - `ACR_USERNAME` — the admin username from portal
   - `ACR_PASSWORD` — the admin password
   - `RESOURCE_GROUP` — `MrTiendaRG`
   - `CONTAINER_APP_NAME` — `mrtienda-web`
   - `APEX_DOMAIN` — `domainvast.xyz`

## If you can create a service principal (recommended)
1. Run (on a machine where you have `az`):

```bash
az ad sp create-for-rbac --name "gh-actions-deploy" --role Contributor \
  --scopes /subscriptions/<your-sub-id>/resourceGroups/MrTiendaRG --sdk-auth
```

2. Copy the JSON output and add it as the GitHub secret `AZURE_CREDENTIALS`.
3. Also add `ACR_LOGIN_SERVER`, `RESOURCE_GROUP`, `CONTAINER_APP_NAME`, and `APEX_DOMAIN` secrets.

## How to manually update the Container App after `push-image.yml` runs
1. On the workflow run page, download the `image-tag` artifact or open `image-tag.txt` to find the pushed tag (e.g. `mrtiendacr.azurecr.io/mrtienda-web:v17-...`).
2. Run this command locally (after `az login`):

```bash
az login
az containerapp update \
  --name mrtienda-web \
  --resource-group MrTiendaRG \
  --image <image_full_tag>
```

Replace `<image_full_tag>` with the value from `image-tag.txt` (e.g. `mrtiendacr.azurecr.io/mrtienda-web:v17-...`).

## Helpful scripts
- `scripts/update-containerapp.sh` — small helper to run `az containerapp update` locally (created in repo). See next section.

## Troubleshooting
- If the Container App fails to pull the image, ensure that the registry is added to the Container App registries and the secret referenced exists. If you used `push-image.yml` with ACR admin user, the Container App already had a registry secret before and should be able to pull `latest` or the specific tag.
- If you hit platform errors, ensure the image is built for linux/amd64 (the workflows buildx with that platform).

If you'd like, I can also add a small GitHub Action that (with admin consent) updates the Container App automatically using a short-lived token — tell me which approach you'd prefer.
