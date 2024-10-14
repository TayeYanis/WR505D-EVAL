<template>
  <div class="categories-container">
    <h1>Categories</h1>
    <!-- CHAMP DE RECHERCHE VIA INPUT APPLIQUATION D'UN PLACEHOLDER POUR INDIQUER CE QUI EST MIT PAR DEFAULT -->
    <div class="search-container">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher une catégorie..."
          class="search-bar"
      />
      <!-- CONTROLES DE PAGINATION -->
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">←</button>
        <span>Page {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">→</button>
      </div>

      <!-- CHAMP POUR ALLER À UNE PAGE SPÉCIFIQUE -->
      <div class="page-input-container">
        <input
            type="number"
            v-model.number="pageInput"
            placeholder="Aller à la page"
            @keyup.enter="goToPage"
            class="page-input"
        />
      </div>
    </div>

    <ul v-if="paginatedCategories.length > 0">
      <p>Liste des catégories</p>
      <!-- MISE EN PLACE D'UN BOUCLE POUR LES CATEGORIES TROUVER PAR LA RECHERCHE -->
      <li v-for="category in paginatedCategories" :key="category.id">
        {{ category.title }}
      </li>
    </ul>
    <p v-else>Il n'y a aucune catégorie trouvée.</p>
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
        currentPage: 1,  // par default de la pagination
        itemsPerPage: 3,  // définissemnt du nombre de films limite par page
        pageInput: ''     // pour mettre la saisie du numéro de navigation
      };
    },
    computed: {
      // FILTRAGE DES CATEGORIES CELON LES CONTENUE DU CHAMP DE RECHERCE
      filteredCategories() {
        return this.categories.filter(category =>
            category.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      // CATEGORIES PAGINÉES SELON LA PAGE ACTUELLE
      paginatedCategories() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredCategories.slice(start, end);
      },
      // CALCUL DU NOMBRE TOTAL DE PAGES
      totalPages() {
        return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
      }
    },
    created() {
      this.fetchCategories();  // Appeler la méthode afin de récupérer les éléments de l'entité Catégorie
    },
    methods: {
      // RÉCUPÉRATION DES CATEGORIES
      async fetchCategories() {
        try {
          const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/categories');
          this.categories = response.data['hydra:member'];
        } catch (error) {
          this.error = 'Erreur lors de la récupération des catégories.';
          console.error(error);
        }
      },
      // NAVIGUER À LA PAGE PRÉCÉDENTE
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      // NAVIGUER À LA PAGE SUIVANTE
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      // ALLER À UNE PAGE SPÉCIFIQUE EN APPUYANT SUR ENTER
      goToPage() {
        if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
          this.currentPage = this.pageInput;
          this.pageInput = '';
        } else {
          alert(`Veuillez entrer un numéro de page valide entre 1 et ${this.totalPages}`);
        }
      }
    },
    watch: {
      // RÉINITIALISER LA PAGE ACTUELLE LORSQUE LA RECHERCHE CHANGE
      searchQuery() {
        this.currentPage = 1; // Retour à la première page lors du changement de recherche
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

  .search-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-bar {
    padding: 10px;
    width: 100%;
    max-width: 400px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .pagination-controls button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 10px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
  }

  .pagination-controls button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .page-input-container {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }

  .page-input {
    padding: 8px;
    font-size: 14px;
    width: 80px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }

  .page-input:focus {
    outline: none;
    border-color: #4caf50;
  }

  .page-input-container::before {
    content: "Aller à la page :";
    margin-right: 10px;
    font-size: 14px;
    color: #333;
  }
</style>
