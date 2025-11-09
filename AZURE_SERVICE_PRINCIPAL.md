Azure Service Principal (SP) creation guide
=========================================

If you can obtain permission (or ask an admin) to create a service principal, the SP can be used to give GitHub Actions the rights to update your Azure Container App automatically. If you cannot create an SP (student account), skip this and use the ACR admin approach described in DEPLOY.md.

1) Create the SP (run where you have `az` and permission):

```bash
SUBSCRIPTION_ID="<your-subscription-id>"
RESOURCE_GROUP="MrTiendaRG"
SP_NAME="gh-actions-deploy"

az ad sp create-for-rbac \
  --name "$SP_NAME" \
  --role Contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
  --sdk-auth
```

This prints a JSON blob like:

```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  ...
}
```

2) Add that JSON as the GitHub secret `AZURE_CREDENTIALS` for your repository (Settings → Secrets → Actions → New repository secret).

3) Add these repository secrets as well:
- `ACR_LOGIN_SERVER` — e.g. `mrtiendacr.azurecr.io`
- `RESOURCE_GROUP` — `MrTiendaRG`
- `CONTAINER_APP_NAME` — `mrtienda-web`
- `APEX_DOMAIN` — `domainvast.xyz`

Notes:
- The SP will have Contributor rights on the resource group; adjust scope/role if you need finer-grained permissions.
- If you cannot create the SP yourself, ask a tenant admin to run the command and add the `AZURE_CREDENTIALS` secret to the repo.
