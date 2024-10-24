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
        <button @click="openEditModal(category)" class="edit-category-button">Éditer</button>
        <button @click="confirmDeleteCategory(category.id)" class="delete-category-button">Supprimer</button>
      </li>
    </ul>

    <!-- MODAL DE CONFIRMATION DE SUPPRESSION -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDeleteModal">&times;</span>
        <h2>Confirmation de suppression</h2>
        <p>Voulez-vous vraiment supprimer la catégorie avec l'ID {{ categoryToDelete }} ?</p>
        <button @click="deleteCategory" class="confirm-delete-button">Oui, supprimer</button>
        <button @click="closeDeleteModal" class="cancel-delete-button">Annuler</button>
      </div>
    </div>

    <p v-else>Il n'y a aucune catégorie trouvée.</p>
    <button @click="showModal = true" class="add-category-button">Ajouter une catégorie</button>

    <!-- MODAL POUR AJOUTER UNE CATEGORIE -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Ajouter une catégorie</h2>
        <form @submit.prevent="addCategory" class="formulaire">
          <input
              type="text"
              v-model="newCategory.title"
              placeholder="Titre de la catégorie"
              required
              class="category-input"
          />
          <p class="input-info">Le titre doit contenir entre 3 et 255 caractères.</p>

          <button type="submit" class="add-category-button">Ajouter la catégorie</button>
        </form>
      </div>
    </div>

    <!-- MODAL POUR ÉDITER UNE CATEGORIE -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Éditer la catégorie</h2>
        <form @submit.prevent="editCategory" class="formulaire">
          <input
              type="text"
              v-model="editCategoryData.title"
              placeholder="Titre de la catégorie"
              required
              class="category-input"
          />
          <p class="input-info">Le titre doit contenir entre 3 et 255 caractères.</p>
          <input
              type="text"
              v-model="editCategoryData.updated_at"
              placeholder="Date de mise à jour"
              readonly
              class="category-input"
          />
          <p class="input-info">Date de mise à jour actuelle</p>

          <button type="submit" class="add-category-button">Sauvegarder les modifications</button>
        </form>
      </div>
    </div>
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
      pageInput: '',     // pour mettre la saisie du numéro de navigation
      showModal: false,
      showEditModal: false,
      showDeleteModal: false,
      categoryToDelete: null,   // stockage de l'id à supprimer
      newCategory: {
        title: ''
      },
      editCategoryData: {
        id: null,
        title: '',
        updated_at: new Date().toISOString() // Initialiser avec la date actuelle
      }
    };
  },
  computed: {
    // FILTRAGE DES CATEGORIES CELON LES CONTENUE DU CHAMP DE RECHERCHE
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
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
      try {
        const response = await fetch("http://symfony.mmi-troyes.fr:8319/api/categories", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }

        const data = await response.json();
        this.categories = data['hydra:member']; // Stocker les catégories récupérées
      } catch (error) {
        this.errorMessage = 'Erreur lors de la récupération des catégories.';
        console.error(error);
      }
    },

    // Ouvrir le modal de confirmation de suppression
    confirmDeleteCategory(id) {
      this.categoryToDelete = id;
      this.showDeleteModal = true;
    },
    // Fermer le modal de suppression
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.categoryToDelete = null;
    },
    // Supprimer la catégorie
    async deleteCategory() {
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/categories/${this.categoryToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la catégorie');
        }

        // Met à jour la liste des catégories après la suppression
        this.categories = this.categories.filter(category => category.id !== this.categoryToDelete);
        this.closeDeleteModal(); // Ferme la modal de suppression
      } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie :', error);
      }
    },

    async addCategory() {
      try {
        // Vérification des conditions du titre de la catégorie
        if (!this.newCategory.title || this.newCategory.title.length < 3 || this.newCategory.title.length > 255) {
          alert('Le titre doit contenir entre 3 et 255 caractères.');
          return;
        }

        const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
        const response = await fetch('http://symfony.mmi-troyes.fr:8319/api/categories', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newCategory) // Envoyer les données de la nouvelle catégorie
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout de la catégorie');
        }

        const data = await response.json(); // Récupérer les données de la réponse
        this.categories.push(data); // Ajouter la nouvelle catégorie à la liste
        this.resetNewCategory(); // Réinitialiser le formulaire de nouvelle catégorie
        this.closeModal(); // Fermer la modal si nécessaire
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie :', error);
      }
    },
    resetNewCategory() {
      this.newCategory = {
        title: ''
      };
    },
    closeModal() {
      this.showModal = false;
    },
    // OUVERTURE DU MODAL D'ÉDITION
    openEditModal(category) {
      this.editCategoryData = { id: category.id, title: category.title, updated_at: new Date().toISOString() }; // Mettre à jour avec la date actuelle
      this.showEditModal = true;
    },
    async editCategory() {
      try {
        // Validation du titre de la catégorie
        if (!this.editCategoryData.title || this.editCategoryData.title.length < 3 || this.editCategoryData.title.length > 255) {
          alert('Le titre doit contenir entre 3 et 255 caractères.');
          return;
        }

        // Ajouter l'updated_at avec la date actuelle
        this.editCategoryData.updated_at = new Date().toISOString(); // Mettre à jour la date

        const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/categories/${this.editCategoryData.id}`, {
          method: 'PUT', // Méthode pour mettre à jour la catégorie
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.editCategoryData), // Données à envoyer
        });

        // Vérification de la réponse
        if (!response.ok) {
          throw new Error('Erreur lors de l\'édition de la catégorie'); // Gestion d'erreur si la réponse n'est pas ok
        }

        const data = await response.json(); // Conversion de la réponse en JSON

        // Mettre à jour la catégorie dans le tableau local
        const index = this.categories.findIndex(category => category.id === this.editCategoryData.id);
        if (index !== -1) {
          this.$set(this.categories, index, data); // Mise à jour de la catégorie
        }

        this.closeEditModal(); // Fermer la modal d'édition
      } catch (error) {
        console.error('Erreur lors de l\'édition de la catégorie :', error); // Affichage de l'erreur
        alert('Une erreur s\'est produite lors de la mise à jour de la catégorie.'); // Alerte à l'utilisateur
      }
    },

    closeEditModal() {
      this.showEditModal = false;
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
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  width: 300px;
  padding: 10px;
  margin-right: 20px;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-controls button {
  margin: 0 5px;
}

.page-input-container {
  margin-left: 20px;
}

.page-input {
  width: 100px;
  padding: 5px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  min-width: 300px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.category-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}

.add-category-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

.add-category-button:hover {
  background-color: #45a049;
}

.input-info {
  font-size: 0.9em;
  color: #777;
}

.delete-category-button {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  margin-left: 10px;
}

.delete-category-button:hover {
  background-color: #d32f2f;
}

.confirm-delete-button {
  background-color: #f44336;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

.confirm-delete-button:hover {
  background-color: #d32f2f;
}

.cancel-delete-button {
  background-color: #bbb;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

.cancel-delete-button:hover {
  background-color: #999;
}

</style>
