<template>
    <div class="movie-detail-container">
      <h1>Détails du film</h1>
      <div v-if="movie" class="detail-movie">
        <div class="movie-img-container" v-if="movie.media">
          <img :src="movie.media" alt="Affiche du film" class="movie-media" />
        </div>
        <h2>{{ movie.title }}</h2>
        <p><strong>Description :<br></strong> {{ movie.description || 'Pas de description disponible' }}</p>
        <p><strong>Durée :<br></strong> {{ movie.duration }} minutes</p>
        <p><strong>Date de sortie :<br></strong> {{ formatDate(movie.releaseDate) }}</p>
        <p><strong>Réalisateur :<br></strong> {{ movie.director || 'Inconnu' }}</p>
        <p><strong>Nombre d'entrées :<br></strong> {{ movie.entries || 'Inconnu' }}</p>
        <p><strong>Note :<br></strong> {{ movie.rating ? movie.rating + '/10' : 'Non noté' }}</p>

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
        <!-- Liste des acteurs liés au film par ID -->
        <div v-if="movieActors.length > 0" class="movie-actors">
          <h2>Acteurs liés à ce film</h2>
          <div class="actors-list">
            <ActorCard
                v-for="actor in movieActors"
                :key="actor.id"
                :actor="actor"
            />
          </div>
        </div>
        <!-- Liste des catégories liés au film par ID -->
        <div v-if="movieCategory.length > 0">
          <h2>Catégories :</h2>
          <div class="category-list">
            <CategoryCard
                v-for="category in movieCategory"
                :key="category.id"
                :category="category"
            />
          </div>
        </div>
      </div>
      <p v-else>Chargement...</p>
    </div>
</template>

<script>
  import axios from 'axios';
  import ActorCard from '@/components/ActorCard.vue';
  import CategoryCard from '@/components/CategoryCard.vue';

  export default {
    name: 'MovieDetail',
    components: {
      ActorCard, // Mettre le components ActorCard ici pour afficher chaque acteurs
      CategoryCard, // Mettre le components CategoryCard ici pour afficher chaque categories
    },
    data() {
      return {
        movie: null,  // STOCKAGE DE movie sur un tableau
        error: null,   // gestion en cas d'erreur
        movieActors: [], // liste acteurs liée aux film sélectionner
        movieCategory: [] // liste categories liée aux film sélectionner
      };
    },
    created() {
      this.fetchMovieDetails(); // Appeler la méthode afin de récupérer tous les éléments du film
    },
    methods: {
      async fetchMovieDetails() {
        const movieId = this.$route.params.id; // Récupération de l'ID du film depuis l'URL lors du clic
        try {
          const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`);
          console.log(response.data);
          this.movie = response.data;
          // Appeler la méthode fetchActorsForMovie en passant les URLs des acteurs
          if (response.data.actors) {
            this.fetchActorsForMovie(response.data.actors);
          }

          // Appeler la méthode fetchActorsForMovie en passant les URLs des categories
          if (response.data.categories) {
            this.movieCategory = await Promise.all(
                response.data.categories.map(url => this.fetchCategoryForMovie(url))
            );
          }

        } catch (error) {
          this.error = 'Erreur lors de la récupération des détails du film.';
          console.error(error);
        }
      },

      async fetchActorsForMovie(actorUrls) {
        try {
          const actors = await Promise.all(
              actorUrls.map(url => axios.get(`http://symfony.mmi-troyes.fr:8319${url}`).then(res => res.data))
          );
          this.movieActors = actors;
        } catch (error) {
          this.error = 'Erreur lors de la récupération des acteurs du film.';
          console.error(error);
        }
      },

      async fetchCategoryForMovie(categoryUrl) {
        try {
          const response = await axios.get(`http://symfony.mmi-troyes.fr:8319${categoryUrl}`);
          return response.data;
        } catch (error) {
          this.error = 'Erreur lors de la récupération de la catégorie du film.';
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
      }
    }
  };
</script>

<style scoped>
  .movie-detail-container {
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .detail-movie {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    width: 50%;
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
    width: 60%;
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
