<template>
  <div class="categories-container">
    <h1>Categories</h1>
    <ul v-if="categories.length > 0">
      <p>Liste des catégories</p>
      <li v-for="category in categories" :key="category.id">
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
      error: null      // gestion en cas d'erreur
    };
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

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
</style>
