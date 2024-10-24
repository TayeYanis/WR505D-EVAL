<template>
  <div class="homepage-container">
    <h1>Bienvenue sur la page d'accueil de notre site !</h1>
    <section class="movies-section">
      <h2>Retrouvez les 4 dernières sorties :</h2>
      <div class="movies-list">
        <MovieCard
            v-for="movie in latestMovies"
            :key="movie.id"
            :movie="movie"
        />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </section>
    <section class="actors-section">
      <h2>Découvrez nos 4 meilleurs acteurs :</h2>
      <div class="actors-list">
        <ActorCard v-for="actor in bestActors" :key="actor.id" :actor="actor" />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </section>
  </div>
</template>

<script>
import MovieCard from "../components/MovieCard.vue";
import ActorCard from "../components/ActorCard.vue";

export default {
  name: "Homepage",
  components: {
    MovieCard,
    ActorCard,
  },
  data() {
    return {
      latestMovies: [],
      bestActors: [],
      errorMessage: null, // Pour afficher les messages d'erreur
    };
  },
  created() {
    this.fetchLatestMovies();
    this.fetchBestActors();
  },
  methods: {
    // Récupérer les films les plus récents
    fetchLatestMovies() {
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
      fetch("http://symfony.mmi-troyes.fr:8319/api/movies", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
          'Content-Type': 'application/json',
        },
      })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des films');
            }
            return response.json();
          })
          .then((data) => {
            console.log("Films récupérés:", data); // Debug: Afficher les films récupérés
            if (data["hydra:member"]) {
              this.latestMovies = data["hydra:member"]
                  .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
                  .slice(0, 4);
            } else {
              console.warn("Aucun film trouvé dans la réponse"); // Debug: Avertissement si pas de films
            }
          })
          .catch((error) => {
            console.error(error);
            this.errorMessage = 'Erreur lors de la récupération des films. Vous devez être connecté pour voir cette section.';
          });
    },
    // Récupérer les meilleurs acteurs
    fetchBestActors() {
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
      fetch("http://symfony.mmi-troyes.fr:8319/api/actors", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
          'Content-Type': 'application/json',
        },
      })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des acteurs');
            }
            return response.json();
          })
          .then((data) => {
            console.log("Acteurs récupérés:", data); // Debug: Afficher les acteurs récupérés
            if (data["hydra:member"]) {
              this.bestActors = data["hydra:member"].slice(0, 4);
            } else {
              console.warn("Aucun acteur trouvé dans la réponse"); // Debug: Avertissement si pas d'acteurs
            }
          })
          .catch((error) => {
            console.error(error);
            this.errorMessage = 'Erreur lors de la récupération des acteurs. Vous devez être connecté pour voir cette section.';
          });
    },
  },
};
</script>

<style scoped>
.homepage-container {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

.movies-section,
.actors-section {
  margin-bottom: 40px;
}

.movies-list,
.actors-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

h2 {
  margin-bottom: 15px;
  font-size: 24px;
}

.error-message {
  color: red; /* Couleur pour le message d'erreur */
  margin-top: 20px;
}
</style>
