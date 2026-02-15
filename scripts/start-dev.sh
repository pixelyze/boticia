#!/bin/bash

# Vérifie si Supabase est en cours d'exécution
echo "🔍 Vérification du serveur Supabase..."

if supabase status > /dev/null 2>&1; then
  echo "✅ Supabase (boticia) est déjà en cours d'exécution"
else
  echo "🛑 Arrêt des autres projets Supabase..."
  supabase stop --all > /dev/null 2>&1

  echo "🚀 Démarrage de Supabase (boticia)..."
  supabase start

  if [ $? -eq 0 ]; then
    echo "✅ Supabase démarré avec succès"
  else
    echo "❌ Erreur lors du démarrage de Supabase"
    exit 1
  fi
fi

echo ""
echo "🚀 Démarrage du serveur Nuxt..."
npm run dev
