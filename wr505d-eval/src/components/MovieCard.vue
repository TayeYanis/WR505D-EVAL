<template>
  <div
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
      <div class="rating-container">
        <p><strong>Note :</strong> {{ movie.rating ? movie.rating + '/10' : 'Non noté' }}</p>
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
      </div>
  </div>
</template>

<script>
  export default {
    name: 'MovieCard',
    props: {
      movie: {
        type: Object,
        required: true,
      },
    },
    methods: {
      formatDate(date) {
        if (!date) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
      },
      // Fonction pour convertir une note sur 10 en une note sur 5 pour les étoiles
      convertRating(rating) {
        if (!rating) return 0;
        return Math.round(rating / 2); // Divise la note sur 10 pour l'adapter à une échelle de 5
      },
      goToMovieDetails(id) {
        this.$router.push({ name: 'MovieDetail', params: { id } }); // Rediriger vers la page MovieDetail avec l'ID
      }
    }
  };
</script>

<style scoped>
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
    text-align: center;
  }

  p {
    margin: 5px 0;
    text-align: center;
  }

  .rating-container {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stars {
    display: flex;
    margin-top: 5px;
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
