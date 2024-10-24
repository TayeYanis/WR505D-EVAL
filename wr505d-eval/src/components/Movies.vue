<template>
  <div class="movies-container">
    <h1>Movies</h1>
    <!-- CHAMP DE RECHERCHE VIA INPUT APPLICATION D'UN PLACEHOLDER POUR INDIQUER CE QUI EST MIT PAR DEFAULT -->
    <div class="search-pagination">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un film..."
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

    <div v-if="paginatedMovies.length > 0">
      <p>Liste des films</p>
      <div class="list-movies">
        <div
            v-for="movie in paginatedMovies"
            :key="movie.id"
            class="movie-card"
            @click="goToMovieDetails(movie.id)"
        >
          <div class="movie-img-container" v-if="movie.media">
            <img :src="movie.media" alt="Affiche du film" class="movie-media" />
          </div>
          <h2>{{ movie.title }}</h2>
          <p><strong>Description :</strong> {{ movie.description || 'Pas de description disponible' }}</p>
          <p><strong>Date de sortie :</strong> {{ formatDate(movie.releaseDate) }}</p>
          <p><strong>Note :</strong> {{ movie.rating ? movie.rating + '/10' : 'Non noté' }}</p>
          <div class="rating-container">
            <div class="stars">
              <span v-for="starIndex in 5" :key="starIndex" class="star">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    :class="{ 'filled': starIndex <= convertRating(movie.rating) }"
                    class="star-icon"
                >
                  <path
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              </span>
            </div>
            <span v-if="!movie.rating">Non noté</span>
          </div>
        </div>
      </div>
    </div>
    <p v-else>Aucun film trouvé.</p>

    <button @click="showModal = true" class="add-movie-button">Ajouter un film</button>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Ajouter un film</h2>
        <form @submit.prevent="addMovie" class="formulaire">
          <input
              type="text"
              v-model="newMovie.title"
              placeholder="Titre (3-250 caractères)"
              required
              class="movie-input"
          />
          <p class="input-info">Doit contenir entre 3 et 250 caractères.</p>

          <textarea
              v-model="newMovie.description"
              placeholder="Description"
              required
              class="movie-textarea"
          ></textarea>

          <input
              type="date"
              v-model="newMovie.releaseDate"
              placeholder="Date de sortie"
              required
              class="movie-input"
          />

          <input
              type="number"
              v-model="newMovie.duration"
              placeholder="Durée (50-200 minutes)"
              min="50"
              max="200"
              required
              class="movie-input"
          />
          <p class="input-info">La durée doit être comprise entre 50 et 200 minutes.</p>

          <input
              type="number"
              v-model="newMovie.entries"
              placeholder="Entrées (0-1000)"
              min="0"
              max="1000"
              required
              class="movie-input"
          />
          <p class="input-info">Le nombre d'entrées doit être compris entre 0 et 1000.</p>

          <input
              type="text"
              v-model="newMovie.director"
              placeholder="Réalisateur (3-255 caractères)"
              required
              class="movie-input"
          />
          <p class="input-info">Doit contenir entre 3 et 255 caractères.</p>

          <input
              type="text"
              v-model="newMovie.rating"
              placeholder="Note (0-10)"
              @input="validateRatingInput"
              required
              class="movie-input"
          />
          <p class="input-info">La note doit être comprise entre 0 et 10.</p>

          <input
              type="text"
              v-model="newMovie.media"
              placeholder="URL de l'affiche"
              required
              class="movie-input"
          />
          <p class="input-info">Doit être une URL valide (ex : http://image.com).</p>

          <div class="dropdown">
            <h3>Acteurs</h3>
            <div class="dropdown-content">
              <div class="dropdown-scroll">
                <label v-for="actor in actors" :key="actor.id" :for="'actor-' + actor.id">
                  <input
                      type="checkbox"
                      :id="'actor-' + actor.id"
                      :value="actor.id"
                      v-model="selectedActors"
                  />
                  {{ actor.firstname }} {{ actor.lastname }}
                </label>
              </div>
            </div>
          </div>

          <!-- DROPDOWN POUR SELECTIONNER LES CATEGORIES -->
          <div class="dropdown">
            <h3>Catégories</h3>
            <div class="dropdown-content">
              <div class="dropdown-scroll">
                <label v-for="category in categories" :key="category.id" :for="'category-' + category.id">
                  <input
                      type="checkbox"
                      :id="'category-' + category.id"
                      :value="category.id"
                      v-model="selectedCategories"
                  />
                  {{ category.title }}
                </label>
              </div>
            </div>
          </div>

          <button type="submit" class="add-movie-button">Ajouter le film</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Movies',
    data() {
      return {
        movies: [],  // STOCKAGE DE movie sur un tableau
        error: null,  // gestion en cas d'erreur
        searchQuery: '',  // Analyse du texte entrée par l'utilisateur
        currentPage: 1,  // par default de la pagination
        itemsPerPage: 8,  // définissemnt du nombre de films limite par page
        pageInput: '',  // pour mettre la saisie du numéro de navigation
        showModal: false,
        newMovie: {
          title: '',
          description: '',
          releaseDate: '',
          duration: null,
          entries: null,
          director: '',
          rating: null,
          media: '',
        },
        selectedActors: [],
        selectedCategories: [],
        actors: [],
        categories: [],
      };
    },
    created() {
      this.fetchMovies();   // Appeler la méthode afin de récupérer les éléments de l'entité Movie
    },
    computed: {
      filteredMovies() {
        // FILTRAGE DES FILMS SELON LES CONTENUS DU CHAMP DE RECHERCHE
        return this.movies.filter(movie =>
            movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      paginatedMovies() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredMovies.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.filteredMovies.length / this.itemsPerPage);
      }
    },
    mounted() {
      this.fetchActors();
      this.fetchCategories();
    },

    methods: {
      async fetchMovies() {
        const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
        try {
          const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/movies', {
            headers: {
              'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
              'Content-Type': 'application/json',
            },
          });
          console.log("Films récupérés:", response.data); // Debug: Afficher les films récupérés
          this.movies = response.data['hydra:member']; // Assigner les films récupérés
        } catch (error) {
          this.errorMessage = 'Erreur lors de la récupération des films.'; // Message d'erreur en cas d'échec
          console.error(error);
        }
      },

      validateRatingInput() {
        this.newMovie.rating = this.newMovie.rating.replace(/[^0-9,]/g, '');
      },
      formatDate(date) {
        if (!date) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
      },
      convertRating(rating) {
        if (!rating) return 0;
        return Math.round(rating / 2);  // DIVISER PAR 2 POUR PASSER DE 10 À 5
      },
      goToMovieDetails(id) {
        this.$router.push({ name: 'MovieDetail', params: { id } }); // Rediriger vers la page MovieDetail avec l'ID
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
          this.pageInput = '';  // réinitialisation de la valeur à nul après l'entrée d'une page
        } else {
          alert(`Veuillez entrer un numéro de page valide entre 1 et ${this.totalPages}`);
        }
      },
      async fetchActors() {
        try {
          const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
          const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors', {
            headers: {
              'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
              'Content-Type': 'application/json',
            },
          });
          this.actors = response.data['hydra:member']; // Stocker les acteurs récupérés
        } catch (error) {
          console.error('Erreur lors de la récupération des acteurs:', error);
          this.errorMessage = 'Erreur lors de la récupération des acteurs. Vous devez être connecté pour voir cette section.';
        }
      },
      async fetchCategories() {
        try {
          const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
          const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/categories', {
            headers: {
              'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
              'Content-Type': 'application/json',
            },
          });
          this.categories = response.data['hydra:member']; // Stocker les catégories
        } catch (error) {
          console.error('Erreur lors de la récupération des catégories:', error);
          this.errorMessage = 'Erreur lors de la récupération des catégories. Vous devez être connecté pour voir cette section.';
        }
      },
      async addMovie() {
        try {
          // Vérifications des champs obligatoires
          if (!this.newMovie.title || !this.newMovie.description || !this.newMovie.releaseDate || !this.newMovie.duration || !this.newMovie.entries || !this.newMovie.director || !this.newMovie.rating || !this.newMovie.media) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
          }

          // Vérifications spécifiques
          if (this.newMovie.duration < 50 || this.newMovie.duration > 200) {
            alert("La durée doit être comprise entre 50 et 200 minutes.");
            return;
          }

          if (this.newMovie.entries < 0 || this.newMovie.entries > 1000) {
            alert("Le nombre d'entrées doit être compris entre 0 et 1000.");
            return;
          }

          const rating = parseFloat(this.newMovie.rating.replace(',', '.'));
          if (rating < 0 || rating > 10) {
            alert("La note doit être comprise entre 0 et 10.");
            return;
          }

          // Préparation des données pour l'envoi
          const actorIRIs = this.selectedActors.map(actorId => `/api/actors/${actorId}`);
          const categoryIRIs = this.selectedCategories.map(categoryId => `/api/categories/${categoryId}`);

          const newMovieData = {
            title: this.newMovie.title,
            description: this.newMovie.description,
            releaseDate: this.newMovie.releaseDate,
            duration: parseInt(this.newMovie.duration),
            entries: parseInt(this.newMovie.entries),
            director: this.newMovie.director,
            rating: rating,
            media: this.newMovie.media,
            actors: actorIRIs,
            categories: categoryIRIs,
          };

          // Récupérer le token du localStorage
          const token = localStorage.getItem('jwt_token');

          // Envoi des données avec axios
          const response = await axios.post('http://symfony.mmi-troyes.fr:8319/api/movies', newMovieData, {
            headers: {
              'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
              'Content-Type': 'application/json',
            },
          });

          // Ajouter le film à la liste des films et réinitialiser le formulaire
          this.movies.push(response.data);
          this.resetNewMovie();
          this.closeModal(); // Si vous avez une méthode pour fermer un modal
        } catch (error) {
          this.error = 'Erreur lors de l\'ajout du film.';
          console.error(error.response.data); // Afficher les détails de l'erreur dans la console
        }
      },
      resetNewMovie() {
        this.newMovie = {
          title: '',
          description: '',
          releaseDate: '',
          duration: null,
          entries: null,
          director: '',
          rating: null,
          media: '',
        };
        this.selectedActors = [];
        this.selectedCategories = [];
      },
      closeModal() {
        this.showModal = false;
      },
    },
    watch: {

      searchQuery() {
        this.currentPage = 1;
      }
    },
  };
</script>

<style scoped>
  .movies-container {
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

  .search-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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

  .list-movies {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
  }

  .movie-card {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }

  .movie-img-container {
    width: 150px;
    height: 225px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .movie-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h2 {
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
    text-align: center;
  }

  strong {
    font-weight: bold;
  }

  .rating-container {
    margin: 10px 0;
    display: flex;
    align-items: center;
  }

  .stars {
    display: flex;
    margin-left: 8px;
  }

  .star {
    margin-right: 5px;
  }

  .star-icon {
    width: 24px;
    height: 24px;
    color: #ccc;
  }

  .star-icon.filled {
    color: #ffc107;
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
  }

  .add-movie-button {
    background-color: #4caf50;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
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

  .movie-input,
  .movie-textarea {
    width: calc(100% - 20px);
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .movie-textarea {
    height: 100px;
  }

  .input-info {
    font-size: 0.9em;
    font-weight: bold;
    color: gray;
    margin-bottom: 10px;
  }


  /*     display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    width: 70%;

    movie-card {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

   */
</style>
