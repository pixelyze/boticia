# Plan: Amélioration CMS Boticia

## Hypothesis
Le CMS actuel nécessite des compétences techniques (JSON) et manque de retour visuel immédiat. En implémentant un éditeur par blocs avec prévisualisation temps réel, nous rendrons la gestion du contenu accessible à tous les utilisateurs.

## Expected Outcomes (定量的)
- **Temps d'édition** : Réduction de 70% (15min → 4min pour éditer une page)
- **Erreurs utilisateur** : Réduction de 90% (pas de JSON invalide)
- **Adoption** : 100% des utilisateurs non-techniques peuvent éditer
- **Satisfaction** : Interface intuitive, courbe d'apprentissage < 5min

## Architecture

### Phase 1 : Éditeur Visuel par Blocs ⭐ PRIORITÉ

**Composants à créer** :

```
/components/cms/
  ├── BlockEditor.vue           # Éditeur principal par blocs
  ├── BlockList.vue            # Liste des blocs avec drag-and-drop
  ├── BlockItem.vue            # Un bloc individuel éditable
  ├── BlockLibrary.vue         # Bibliothèque de blocs prédéfinis
  ├── blocks/
  │   ├── HeroBlock.vue        # Bloc Hero avec formulaire visuel
  │   ├── TextBlock.vue        # Bloc texte avec éditeur riche
  │   ├── ImageBlock.vue       # Bloc image avec upload
  │   ├── CTABlock.vue         # Bloc Call-to-Action
  │   ├── FeatureBlock.vue     # Bloc fonctionnalités
  │   └── ...
  └── BlockToolbar.vue         # Barre d'outils contextuelle
```

**Features** :
- ✅ Drag-and-drop avec `@vueuse/core` (useSortable)
- ✅ Édition inline (click pour éditer)
- ✅ Formulaires dynamiques par type de bloc
- ✅ Validation en temps réel
- ✅ Ajout rapide de blocs via menu "+"

### Phase 2 : Prévisualisation Temps Réel ⭐ PRIORITÉ

**Architecture Split-View** :

```
┌─────────────────────────────────────────┐
│  Header (Titre, Actions, Status)        │
├──────────────────┬──────────────────────┤
│                  │                      │
│  📝 Éditeur      │  👁️ Prévisualisation │
│  (Blocs)         │  (Iframe/Component)  │
│                  │                      │
│  Drag & Drop     │  Mise à jour         │
│  Formulaires     │  en temps réel       │
│  Inline Edit     │  (debounced 300ms)   │
│                  │                      │
└──────────────────┴──────────────────────┘
```

**Composants** :
```
/components/cms/
  ├── PreviewPane.vue          # Panneau de prévisualisation
  ├── PreviewFrame.vue         # Iframe de prévisualisation
  ├── DeviceSelector.vue       # Desktop/Tablet/Mobile
  └── PreviewToolbar.vue       # Barre d'outils preview
```

**Implémentation** :
- Composable `usePreview()` qui sync l'état
- Debounce 300ms pour performance
- Support responsive (desktop/tablet/mobile)

### Phase 3 : Composants de Blocs Prédéfinis

**Bibliothèque de Blocs** :

1. **Hero Blocks**
   - Hero avec image de fond
   - Hero minimaliste
   - Hero avec CTA

2. **Content Blocks**
   - Texte simple
   - Texte avec image (gauche/droite)
   - Citation
   - Liste à puces

3. **Call-to-Action**
   - CTA principal
   - CTA secondaire
   - Formulaire de contact

4. **Media Blocks**
   - Image simple
   - Galerie d'images
   - Vidéo
   - Carrousel

5. **Layout Blocks**
   - Colonnes (2/3/4)
   - Grille de cards
   - Accordéon
   - Tabs

**Structure JSON simplifiée** :

```typescript
interface Block {
  id: string;
  type: 'hero' | 'text' | 'image' | 'cta' | ...;
  content: {
    // Contenu spécifique au type
  };
  settings: {
    visible: boolean;
    className?: string;
    animation?: string;
  };
}
```

### Phase 4 : Améliorations UX

**1. Édition Inline**
- Click sur le texte → éditeur riche apparaît
- Pas de modal
- Sauvegarde auto (debounced)

**2. Sidebar Contextuelle**
```
┌────────────────────┬──────────────┐
│  Éditeur + Preview │  📋 Sidebar  │
│                    │              │
│                    │  Paramètres  │
│                    │  du bloc     │
│                    │  sélectionné │
│                    │              │
└────────────────────┴──────────────┘
```

**3. Raccourcis Clavier**
- `Cmd+S` : Sauvegarder
- `Cmd+P` : Publier
- `/` : Ouvrir menu de blocs
- `Cmd+D` : Dupliquer bloc
- `Cmd+Backspace` : Supprimer bloc

**4. Animations & Feedback**
- Loading states clairs
- Succès/Erreur toast notifications
- Transitions fluides (brutal style)

### Phase 5 : Performance & DX

**Optimisations** :
- Lazy loading des blocs
- Virtual scrolling pour grandes listes
- Debouncing intelligent (300ms édition, 1s auto-save)
- Optimistic UI updates

**Developer Experience** :
- TypeScript strict pour tous les blocs
- Documentation des types de blocs
- Storybook pour la bibliothèque de blocs
- Tests unitaires des composants critiques

## Risks & Mitigation

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Complexité drag-and-drop | Moyen | Faible | Utiliser @vueuse/core (testé) |
| Performance avec beaucoup de blocs | Moyen | Moyen | Virtual scrolling + lazy loading |
| Migration du contenu existant | Faible | Faible | Script de migration JSON → Blocs |
| Courbe d'apprentissage | Faible | Faible | Interface intuitive + onboarding |

## Implementation Order

### Sprint 1 (3-4 heures)
1. Créer composants de base (BlockEditor, BlockList, BlockItem)
2. Implémenter drag-and-drop
3. Créer 3 blocs de base (Hero, Text, Image)
4. Formulaires d'édition pour ces blocs

### Sprint 2 (2-3 heures)
5. Prévisualisation temps réel (split-view)
6. Composable usePreview()
7. Device selector (desktop/mobile)

### Sprint 3 (2-3 heures)
8. Bibliothèque de blocs complète (10+ blocs)
9. Sidebar contextuelle
10. Raccourcis clavier

### Sprint 4 (1-2 heures)
11. Optimisations performance
12. Tests & polish
13. Documentation

**Total estimé : 8-12 heures de développement**

## Success Metrics

- [ ] L'utilisateur peut créer une page complète sans voir de JSON
- [ ] Prévisualisation mise à jour en < 500ms après modification
- [ ] Drag-and-drop fluide (60fps)
- [ ] Bibliothèque d'au moins 10 blocs prédéfinis
- [ ] Tests utilisateur : 100% réussite sans formation

## Design Cohérence

Tous les composants suivent le design system boticia-ui :
- Borders épaisses (border-2, border-4)
- Shadows géométriques (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`)
- Couleurs : cream (#F5F3EE), dark (#2B2B2B)
- Typography : Playfair Display (headings), Source Sans 3 (body)
