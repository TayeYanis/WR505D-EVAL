<template>
  <div class="movies-container">
    <h1>Movies</h1>
    <!-- CHAMP DE RECHERCHE VIA INPUT APPLICATION D'UN PLACEHOLDER POUR INDIQUER CE QUI EST MIT PAR DEFAULT -->
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher un film..."
        class="search-bar"
    />

    <div v-if="filteredMovies.length > 0">
      <p>Liste des films</p>
      <div class="list-movies">
        <div
            v-for="movie in filteredMovies"
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
      searchQuery: ''  // Analyse du texte entrée par l'utilisateur
    };
  },
  computed: {
    filteredMovies() {
      // FILTRAGE DES FILMS CELON LES CONTENUE DU CHAMP DE RECHERCE
      return this.movies.filter(movie =>
          movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  created() {
    this.fetchMovies();   // Appeler la méthode afin de récuperer les élement de l'entiter Movie
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/movies');
        this.movies = response.data['hydra:member'];
      } catch (error) {
        this.error = 'Erreur lors de la récupération des films.';
        console.error(error);
      }
    },
    formatDate(date) {
      if (!date) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    },
    // TRANSFORMER LA NOTE DE 10 EN NOTE DE 5
    convertRating(rating) {
      if (!rating) return 0;
      return Math.round(rating / 2);  // DIVISER PAR 2 POUR PASSER DE 10 A 5
    },
    goToMovieDetails(id) {
      this.$router.push({ name: 'MovieDetail', params: { id } }); // Rediriger vers la page MovieDetail avec l'ID
    }
  }
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
</style>