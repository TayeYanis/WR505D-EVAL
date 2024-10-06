<template>
    <div class="homepage-container">
      <h1>Homepage</h1>
      <p>Page d'accueil.</p>

      <!-- SECTION DES FILMS !-->
      <section class="movies-section">
        <h2>Derniers Films</h2>
        <div class="movies-list">
          <MovieCard
              v-for="movie in lastMovies"
              :key="movie.id"
              :movie="movie"
          />
        </div>
      </section>

      <!-- SECTION DES ACTEURS !-->
      <section class="actors-section">
        <h2>Derniers Acteurs</h2>
        <div class="actors-list">
          <ActorCard
              v-for="actor in lastActors"
              :key="actor.id"
              :actor="actor"
          />
        </div>
      </section>
    </div>
</template>

<script>
  import axios from 'axios';
  import MovieCard from '@/components/MovieCard.vue';
  import ActorCard from '@/components/ActorCard.vue';

  export default {
    name: 'Homepage',
    components: {
      MovieCard,
      ActorCard,
    },
    data() {
      return {
        lastMovies: [],   // STOCKAGE DES 4 DERNIERS FILMS
        lastActors: [],   // STOCKAGE DES 4 DERNIERS ACTEURS
        error: null,      // gestion en cas d'erreur
      };
    },
    created() {
      this.fetchLastMovies();   // utilisation d'un get pour recupérer les 4 derniers movies
      this.fetchLastActors();   // utilisation d'un get pour recupérer les 4 derniers acteurs
    },
    methods: {
      async fetchLastMovies() {
        try {
          const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/movies');
          // Utilisation d'une méthode de trie pour recupérer les derniers films par id de prendre les 4 derniers
          this.lastMovies = response.data['hydra:member']
              .sort((a, b) => b.id - a.id)
              .slice(0, 4);
        } catch (error) {
          this.error = 'Erreur lors de la récupération des films.';
          console.error(error);
        }
      },
      async fetchLastActors() {
        let allActors = [];
        try {
          const responsePage1 = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors?page=1&itemsPerPage=50');
          const actorsPage1 = responsePage1.data['hydra:member'];

          const responsePage2 = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors?page=2&itemsPerPage=50');
          const actorsPage2 = responsePage2.data['hydra:member'];

          allActors = actorsPage1.concat(actorsPage2);

          // Utilisation d'une méthode de trie pour recupérer les derniers acteurs par id de prendre les 4 derniers
          this.lastActors = allActors.sort((a, b) => b.id - a.id).slice(0, 4);

        } catch (error) {
          this.error = 'Erreur lors de la récupération des acteurs.';
          console.error(error);
        }
      }
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
</style>
