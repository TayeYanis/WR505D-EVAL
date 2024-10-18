<template>
  <div class="actors-container">
    <h1>Actors</h1>
    <!-- CHAMP DE RECHERCHE VIA INPUT APPLICATION D'UN PLACEHOLDER POUR INDIQUER CE QUI EST MIT PAR DEFAULT -->
    <div class="search-pagination">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un acteur par prénom ou nom..."
          class="search-bar"
      />
      <div class="pagination-controls">
        <!-- BOUTONS DE PAGINATION -->
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

    <!-- AFFICHAGE DE LA LISTE DES ACTEURS -->
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

    <!-- BOUTON POUR OUVRIR LE MODAL D'AJOUT D'UN ACTEUR -->
    <button @click="showModal = true" class="add-actor-button">Ajouter un acteur</button>

    <!-- MODAL POUR AJOUTER UN ACTEUR -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Ajouter un acteur</h2>
        <form @submit.prevent="addActor" class="formulaire">
          <input
              type="text"
              v-model="newActor.firstname"
              placeholder="Prénom (3-50 caractères)"
              required
              class="actor-input"
          />
          <p class="input-info">Doit contenir entre 3 et 50 caractères.</p>

          <input
              type="text"
              v-model="newActor.lastname"
              placeholder="Nom (3-50 caractères)"
              required
              class="actor-input"
          />
          <p class="input-info">Doit contenir entre 3 et 50 caractères.</p>

          <input
              type="text"
              v-model="newActor.nationality"
              placeholder="Nationalité (ex: FR pour France)"
              required
              class="actor-input"
          />
          <p class="input-info">Utilisez le code ISO 3166-1 alpha-2 (ex : FR, AU, CN).</p>

          <input
              type="date"
              v-model="newActor.dob"
              placeholder="Date de naissance"
              required
              class="actor-input"
          />

          <input
              type="number"
              v-model="newActor.awards"
              placeholder="Nombre de récompenses (0-10)"
              min="0"
              max="10"
              required
              class="actor-input"
          />
          <p class="input-info">Le nombre de récompenses doit être compris entre 4 et 12.</p>

          <textarea
              v-model="newActor.bio"
              placeholder="Biographie (30-300 caractères)"
              required
              class="actor-textarea"
          ></textarea>
          <p class="input-info">Doit contenir entre 30 et 300 caractères.</p>

          <input
              type="date"
              v-model="newActor.deathDate"
              placeholder="Date de décès (laisser vide si toujours vivant)"
              class="actor-input"
          />
          <p class="input-info">Remplir uniquement si l'acteur est décédé.</p>

          <input
              type="text"
              v-model="newActor.media"
              placeholder="URL de l'image"
              required
              class="actor-input"
          />
          <p class="input-info">Doit être une URL valide (ex : http://image.com).</p>

          <select v-model="newActor.gender" required class="actor-input">
            <option value="" disabled selected>Choisir un genre</option>
            <option value="male">Masculin</option>
            <option value="female">Féminin</option>
          </select>

          <div class="dropdown">
            <div class="dropdown-content">
              <div class="dropdown-scroll">
                <label v-for="movie in movies" :key="movie.id">
                  <input
                      type="checkbox"
                      :value="movie.id"
                      v-model="selectedMovies"
                  />
                  {{ movie.title }}
                </label>
              </div>
            </div>
          </div>

          <button type="submit" class="add-actor-button">Ajouter l'acteur</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Actors',
    data() {
      return {
        actors: [], // STOCKAGE DE actor sur un tableau
        movies: [], // Pour stocker les films disponibles
        searchQuery: '', // Analyse du texte entrée par l'utilisateur
        currentPage: 1, // par default de la pagination
        itemsPerPage: 8, // définissemnt du nombre d'acteurs limite par page
        pageInput: '', // pour mettre la saisi du numéra de navigation
        newActor: { // Nouveau modèle pour l'ajout d'un acteur
          firstname: '',
          lastname: '',
          dob: '',
          awards: null,
          nationality: '',
          bio: '',
          gender: '',
          media: '',
          deathDate: '',
        },
        selectedMovies: [], // Pour stocker les films sélectionnés
        showModal: false, // Nouvelle variable pour contrôler l'affichage de la modale
        error: null, // gestion en cas d'erreur
      };
    },
    created() {
      this.fetchActors(); // Appeler la méthode afin de récuperer les élement de l'entité Actor
      this.fetchMovies(); // Charger les films disponibles
    },
    computed: {
      // FILTRAGE DES ACTEURS CELON LES CONTENUE DU CHAMP DE RECHERCHE EN PRENANT EN COMPTE 2 CHAMP
      filteredActors() {
        return this.actors.filter(actor => {
          const fullName = `${actor.firstname} ${actor.lastname}`.toLowerCase(); // Corrigé pour utiliser des backticks
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

      async fetchMovies() {
        let allMovies = [];
        let page = 1;
        let totalMovies = 0;

        do {
          const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/movies?page=${page}`);
          allMovies.push(...response.data['hydra:member']);
          totalMovies = response.data['hydra:totalItems'];
          page++;
        } while (allMovies.length < totalMovies);

        this.movies = allMovies;
      },

      async addActor() {
        try {

          if (!this.newActor.firstname || !this.newActor.lastname || !this.newActor.dob || !this.newActor.bio || !this.newActor.nationality || !this.newActor.media || !this.newActor.gender) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
          }

          if (this.newActor.awards !== null && (this.newActor.awards < 0 || this.newActor.awards > 10)) {
            alert("Le nombre de récompenses doit être compris entre 0 et 10 ou nul.");
            return;
          }

          this.newActor.awards = this.newActor.awards === '' ? null : parseInt(this.newActor.awards, 12);

          const newActorData = {
            firstname: this.newActor.firstname,
            lastname: this.newActor.lastname,
            nationality: this.newActor.nationality,
            dob: this.newActor.dob,
            awards: this.newActor.awards,
            bio: this.newActor.bio,
            deathDate: this.newActor.deathDate || null,
            media: this.newActor.media,
            gender: this.newActor.gender,
            movies: this.selectedMovies.map(movieId => `/api/movies/${movieId}`),
          };

          const response = await axios.post('http://symfony.mmi-troyes.fr:8319/api/actors', newActorData);
          this.actors.push(response.data);
          this.resetNewActor();
          this.closeModal();
        } catch (error) {
          this.error = 'Erreur lors de l\'ajout de l\'acteur.';
          console.error(error.response.data);
        }
      },

      resetNewActor() {
        this.newActor = {
          firstname: '',
          lastname: '',
          dob: '',
          awards: null,
          nationality: '',
          bio: '',
          gender: '',
          media: '',
          deathDate: '',
        };
        this.selectedMovies = [];
      },

      goToActorDetails(id) {
        this.$router.push({ name: 'ActorDetail', params: { id } });
      },

      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },

      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++; // Passer à la page suivante
        }
      },

      goToPage() {
        // Vérification de la validité du numéro de page
        if (this.pageInput > 0 && this.pageInput <= this.totalPages) {
          this.currentPage = this.pageInput; // Passer à la page spécifiée
          this.pageInput = '';  // Réinitialisation de la valeur à nulle après l'entrée d'une page
        } else {
          alert(`Veuillez entrer un numéro de page valide entre 1 et ${this.totalPages}`); // Corrigé pour utiliser des backticks
        }
      },

      closeModal() {
        this.showModal = false; // Fermer la modale
      },
    },
    watch: {
      searchQuery() {
        this.currentPage = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
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

  .add-actor-button {
    background-color: #4caf50;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    width: 50%;
    height: 5%;
  }

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    font-size: 15px;
  }
  .actor-textarea {
    max-height: 44px;
  }

  .formulaire {
    font-size: 10px!important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  .actor-input,
  .actor-textarea {
    width: calc(100% - 20px);
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .actor-textarea {
    height: 100px;
  }

  .add-actor-button:hover {
    background-color: #45a049;
  }
  .input-info {
    font-size: 1.4em;
    font-weight: bold;
    color: gray;
    margin-bottom: 10px;
  }
</style>
