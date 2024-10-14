<template>
  <div class="actors-container">
    <h1>Actors</h1>
    <!-- CHAMP DE REHCHERCHE VIA INPUT APPLIQUATION D'UN PLACEHOLDER POUR INDIQUER CE QUI EST MIT PAR DEFAULT -->
    <div class="search-pagination">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un acteur par prénom ou nom..."
          class="search-bar"
      />
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">←</button>
        <span>Page {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">→</button>
      </div>
      <!-- CHAMP DE SAISI DE NAVIGATION DIRECT -->
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

    <!-- Liste des acteurs paginée -->
    <div v-if="paginatedActors.length > 0">
      <p>Liste des acteurs</p>
      <div class="list-actors">
        <div
            v-for="actor in paginatedActors"
            :key="actor.id"
            class="actor-card"
            @click="goToActorDetails(actor.id)"
        >
          <div class="actor-img-container" v-if="actor.media">
            <img :src="actor.media" alt="Image de l'acteur" class="actor-media" />
          </div>
          <h2>{{ actor.firstname }} {{ actor.lastname }}</h2>
          <p><strong>Biographie :</strong> {{ actor.bio }}</p>
          <p class="actors-genre"><strong>Genre :</strong> {{ actor.gender }}</p>
        </div>
      </div>
    </div>
    <p v-else>Aucun acteur trouvé.</p>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: 'Actors',
  data() {
    return {
      actors: [],  // STOCKAGE DE actor sur un tableau
      error: null,  // gestion en cas d'erreur
      searchQuery: '', // Analyse du texte entrée par l'utilisateur
      currentPage: 1,  // par default de la pagination
      itemsPerPage: 8,  // définissemnt du nombre d'acteurs limite par page
      pageInput: ''  // pour mettre la saisi du numéra de navigation
    };
  },
  created() {
    this.fetchActors();  // Appeler la méthode afin de récuperer les élement de l'entiter Actor
  },
  computed: {
    // FILTRAGE DES ACTEURS CELON LES CONTENUE DU CHAMP DE RECHERCE EN PRENANT EN COMPTE 2 CHAMP
    filteredActors() {
      return this.actors.filter(actor => {
        const fullName = `${actor.firstname} ${actor.lastname}`.toLowerCase();
        return fullName.includes(this.searchQuery.toLowerCase());
      });
    },

    paginatedActors() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredActors.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredActors.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchActors() {
      let allActors = [];

      try {
        const responsePage1 = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors?page=1&itemsPerPage=50');
        const actorsPage1 = responsePage1.data['hydra:member'];

        const responsePage2 = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors?page=2&itemsPerPage=50');
        const actorsPage2 = responsePage2.data['hydra:member'];

        allActors = actorsPage1.concat(actorsPage2);

        this.actors = allActors;
      } catch (error) {
        this.error = 'Erreur lors de la récupération des acteurs.';
        console.error(error);

      }
    },
    goToActorDetails(id) {
      this.$router.push({ name: 'ActorDetail', params: { id } }); // Rediriger vers la page ActorDetail avec l'ID
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage() {
      if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
        this.currentPage = this.pageInput;
        this.pageInput = '';  // renitialisation de la valeur à nul après l'entrée d'une page
      } else {
        alert(`Veuillez entrer un numéro de page valide entre 1 et ${this.totalPages}`);
      }
    }
  },
  watch: {
    // Si la recherche change, on retourne à la première page
    searchQuery() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
  .actors-container {
    padding: 20px;
  }

  .search-pagination {
    display: flex;
    justify-content: space-between;
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
  }

  .pagination-controls {
    display: flex;
    align-items: center;
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

  .list-actors {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
  }

  .actor-card {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    cursor: pointer;
    text-align: center;
  }

  .actor-img-container {
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 50%;
    margin-bottom: 10px;
    margin-left: 25%;
  }

  .actor-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  p {
    margin: 5px 0;
  }

  .actors-genre {
    text-transform: uppercase;
  }

  strong {
    font-weight: bold;
  }

  .page-input-container {
    display: flex;
    align-items: center;
    margin-left: 20px;
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