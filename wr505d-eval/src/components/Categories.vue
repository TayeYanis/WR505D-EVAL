<template>
  <div class="categories-container">
    <h1>Categories</h1>
    <!-- CHAMP DE REHCHERCHE VIA INPUT APPLIQUATION D'UN PLACEHOLDER POUR INDIQUER CE QUI EST MIT PAR DEFAULT -->
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher une catégorie..."
        class="search-bar"
    />

    <ul v-if="filteredCategories.length > 0">
      <p>Liste des catégories</p>
      <!-- MISE EN PLACE D'UN BOUCLE POUR LES CATEGORIES TROUVER PAR LA RECHERCHE -->
      <li v-for="category in filteredCategories" :key="category.id">
        {{ category.title }}
      </li>
    </ul>
    <p v-else>Il n'y à aucune catégorie trouvée.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Categories',
  data() {
    return {
      categories: [],  // STOCKAGE DE category sur un tableau
      error: null,      // gestion en cas d'erreur
      searchQuery: '',  // Analyse du texte entrée par l'utilisateur
    };
  },
  computed: {
    // FILTRAGE DES CATEGORIES CELON LES CONTENUE DU CHAMP DE RECHERCE
    filteredCategories() {
      return this.categories.filter(category =>
          category.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  created() {
    this.fetchCategories();  // Appeler la méthode afin de récuperer les élement de l'entiter Catégorie
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/categories');
        this.categories = response.data['hydra:member'];
      } catch (error) {
        this.error = 'Erreur lors de la récupération des catégories.';
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
  .categories-container {
    padding: 20px;
  }

  h1 {
    margin-bottom: 20px;
  }

  .search-bar {
    margin-bottom: 20px;
    padding: 10px;
    width: 100%;
    max-width: 400px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
</style>
