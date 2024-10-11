#!/bin/bash

# Define o caminho para o package.json
PACKAGE_JSON="package.json"

# Obtém a data no formato YYYYMMDD
TODAY=$(date +%Y%m%d)

# Extrai a versão atual do package.json
CURRENT_VERSION=$(cat $PACKAGE_JSON | grep '"version"' | awk -F '"' '{print $4}')

# Define a base da nova versão
VERSION_BASE="${CURRENT_VERSION%-snapshot.*}-snapshot.${TODAY}"

# Encontra o número do último snapshot do dia, se houver, e incrementa
LAST_SNAPSHOT=$(grep -o "${VERSION_BASE}\.[0-9]*" $PACKAGE_JSON | awk -F '.' '{print $NF}' | sort -nr | head -n1)
NEXT_SNAPSHOT=$((LAST_SNAPSHOT + 1))

# Nova versão do snapshot
NEW_VERSION="${VERSION_BASE}.${NEXT_SNAPSHOT}"

# Atualiza o package.json com a nova versão
sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" $PACKAGE_JSON

# Imprime a nova versão para a saída padrão
echo "Snapshot version updated to \"v$NEW_VERSION\". Use this for your git tag."
