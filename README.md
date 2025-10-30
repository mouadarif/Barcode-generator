# Générateur de Codes-Barres 2D Ultra-Interactif

Une application web moderne et hautement interactive pour générer des codes-barres en grille 2D avec une interface utilisateur exceptionnelle.

## 🎯 Fonctionnalités Principales

### Import et Génération de Données
- **Import CSV/Excel** : Importez vos données depuis des fichiers CSV ou Excel
- **Générateur de séquences** : Créez automatiquement des séries de codes-barres numérotés
- **Validation en temps réel** : Vérification automatique de la validité des données

### Gestion Avancée des Couleurs
- **Colorisation par ligne** : Appliquez des couleurs à des lignes entières
- **Colorisation par colonne** : Personnalisez les couleurs par colonne
- **Colorisation par cellule** : Contrôle précis cellule par cellule
- **Palettes prédéfinies** : 10 couleurs tendance prêtes à l'emploi
- **Fonctionnalités spéciales** :
  - Appliquer à toutes les lignes
  - Rayures zébrées (zebra striping)
  - Sélection multiple avec Ctrl+Clic

### Gestion de l'Espacement
- **Espacement global** : Contrôle uniforme pour toute la grille
- **Espacement par ligne** : Ajustez l'espace entre les lignes individuellement
- **Espacement par colonne** : Personnalisez l'espace entre les colonnes
- **Sliders interactifs** : Prévisualisation en temps réel des changements

### Contrôles de Vue Interactive
- **Zoom** : De 25% à 400% avec molette ou slider
- **Pan** : Navigation par glisser-déposer
- **Sélection multiple** : Ctrl+Clic et Shift+Drag
- **Overlays visuels** : Effets de survol et de sélection

### Système de Presets
- **Sauvegarde** : Enregistrez vos configurations en localStorage
- **Chargement** : Récupérez vos presets sauvegardés
- **Export/Import JSON** : Partagez vos configurations
- **Gestion complète** : Renommer, dupliquer, supprimer

### Export et Impression
- **Export PDF** : Documents multi-pages optimisés pour l'impression
- **Export PNG** : Images haute résolution (300 DPI)
- **Impression optimisée** : Dialogue personnalisé avec options
- **Raccourcis clavier** : Ctrl+P pour imprimer, Ctrl+E pour exporter

## 🚀 Technologies Utilisées

- **React 19** avec TypeScript
- **Vite** pour le build ultra-rapide
- **Tailwind CSS 4** pour le styling
- **shadcn/ui** pour les composants de base
- **Zustand** pour la gestion d'état
- **JsBarcode** pour la génération de codes-barres
- **jsPDF** pour l'export PDF
- **html2canvas** pour la capture d'écran
- **react-colorful** pour les color pickers
- **PapaParse** pour le parsing CSV
- **XLSX** pour le parsing Excel

## 📦 Installation

```bash
# Cloner le repository
git clone <repository-url>

# Installer les dépendances
cd barcode-generator
pnpm install

# Lancer le serveur de développement
pnpm dev
```

## 🎨 Utilisation

### 1. Importer des Données

**Option A : Fichier CSV/Excel**
1. Cliquez sur "Import" dans la sidebar
2. Sélectionnez l'onglet "Importer"
3. Cliquez sur "Sélectionner un fichier"
4. Choisissez votre fichier CSV ou Excel

Format attendu :
- Colonne "value" ou "code" pour le code-barres
- Colonne "text" ou "label" pour le texte (optionnel)

**Option B : Générateur de Séquences**
1. Cliquez sur "Import" dans la sidebar
2. Sélectionnez l'onglet "Générer"
3. Configurez le préfixe, le numéro de départ et le nombre
4. Cliquez sur "Générer"

### 2. Configurer la Grille

1. Cliquez sur "Grille" dans la sidebar
2. Ajustez le nombre de colonnes et de lignes
3. Choisissez le format de page (A4 ou A1)
4. Définissez les marges

### 3. Personnaliser les Couleurs

1. Cliquez sur "Couleurs" dans la sidebar
2. Choisissez l'onglet (Lignes, Colonnes ou Cellules)
3. Sélectionnez l'élément à coloriser
4. Utilisez les color pickers ou les palettes prédéfinies
5. Appliquez les couleurs

### 4. Ajuster l'Espacement

1. Cliquez sur "Espacement" dans la sidebar
2. Utilisez l'espacement global ou personnalisez par ligne/colonne
3. Ajustez avec les sliders ou les inputs numériques

### 5. Personnaliser les Styles

1. Cliquez sur "Styles" dans la sidebar
2. Ajustez la hauteur des codes-barres
3. Modifiez la largeur des barres
4. Changez la taille du texte
5. Ajustez les marges et le padding

### 6. Sauvegarder un Preset

1. Cliquez sur "Sauvegarder" dans le header
2. Donnez un nom à votre preset
3. Cliquez sur "Sauvegarder"

### 7. Exporter ou Imprimer

**Export :**
1. Cliquez sur "Exporter" dans le header
2. Choisissez le format (PDF ou PNG)
3. Cliquez sur "Exporter"

**Impression :**
1. Cliquez sur "Imprimer" dans le header
2. Choisissez le mode (Couleur ou N&B)
3. Cliquez sur "Imprimer"

## ⌨️ Raccourcis Clavier

- `Ctrl+Z` : Annuler
- `Ctrl+Y` : Refaire
- `Ctrl+S` : Sauvegarder un preset
- `Ctrl+P` : Imprimer
- `Ctrl+E` : Exporter
- `Ctrl+Clic` : Sélection multiple
- `+/-` : Zoom
- `Esc` : Désélectionner

## 🎨 Thèmes

L'application supporte le mode clair et le mode sombre. Cliquez sur l'icône de lune/soleil dans le header pour basculer entre les thèmes.

## 📝 Format des Fichiers d'Import

### CSV
```csv
value,text
LOC-0001,Emplacement A1
LOC-0002,Emplacement A2
LOC-0003,Emplacement A3
```

### Excel
Même structure que le CSV, avec les colonnes :
- `value` ou `code` : Le code-barres à générer
- `text` ou `label` : Le texte à afficher (optionnel)

## 🔧 Configuration

L'application fonctionne entièrement côté client sans base de données. Les données sont stockées dans :
- **localStorage** : Presets et configurations
- **Mémoire** : Données de session

## 🚀 Déploiement

```bash
# Build de production
pnpm build

# Prévisualiser le build
pnpm preview
```

Le dossier `dist` contient les fichiers prêts pour le déploiement sur n'importe quel hébergeur statique (Vercel, Netlify, etc.).

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
