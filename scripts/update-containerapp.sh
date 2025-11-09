#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <image_full_tag>"
  echo "Example: $0 mrtiendacr.azurecr.io/mrtienda-web:v17-20251109092822"
  exit 2
fi

IMAGE="$1"
RESOURCE_GROUP="MrTiendaRG"
APP_NAME="mrtienda-web"

echo "Updating Container App $APP_NAME in $RESOURCE_GROUP to image $IMAGE"
az login --only-show-errors
az containerapp update --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --image "$IMAGE"
echo "Update requested. Use 'az containerapp revision list' to check revision health." 
