<template>
  <div class="actor-detail-container">
    <h1>Détails de l'acteur</h1>
    <div v-if="actor" class="detail-actor">
      <div class="actor-img-container" v-if="actor.media">
        <img :src="actor.media" alt="Image de l'acteur" class="actor-media" />
      </div>
      <h2>{{ actor.firstname }} {{ actor.lastname }}</h2>
      <p><strong>Date de naissance :<br></strong> {{ formatDate(actor.dob) }}</p>
      <p><strong>Nationalité :<br></strong> {{ actor.nationality }}</p>
      <p><strong>Récompenses :<br></strong> {{ actor.awards }} prix</p>

      <div class="awards-container">
        <span v-if="actor.awards > 0">
          <img v-for="n in actor.awards" :key="n" src="../assets/trophy.png" alt="Trophée" class="trophy-icon" />
        </span>
        <span v-else>Aucune récompense</span>
      </div>

      <p class="actors-genre"><strong>Genre :<br></strong> {{ actor.gender }}</p>
      <p><strong>Biographie :<br></strong> {{ actor.bio }}</p>
      <p v-if="actor.deathDate"><strong>Date de décès :<br></strong> {{ formatDate(actor.deathDate) }}</p>
      <!-- Liste des films liés à l'acteur par ID -->
      <div v-if="actorMovies.length > 0" class="actor-movies">
        <h2>Films liés à cet acteur</h2>
        <div class="movies-list">
          <MovieCard
              v-for="movie in actorMovies"
              :key="movie.id"
              :movie="movie"
          />
        </div>
      </div>
      <p v-else>Pas de films trouvés pour cet acteur.</p>
    </div>
    <p v-else>Chargement...</p>
  </div>
</template>

<script>
  import axios from 'axios';
  import MovieCard from '@/components/MovieCard.vue';

  export default {
    name: 'ActorDetail',
    components: {
      MovieCard,  // Mettre le components MovieCard ici pour afficher chaque film
    },
    data() {
      return {
        actor: null,  // STOCKAGE DE actor sur un tableau
        error: null,   // gestion en cas d'erreur
        actorMovies: []  // liste films liée l'acteur sélectionner
      };
    },
    created() {
      this.fetchActorDetails(); // Appeler la méthode afin de récupérer tous les éléments de l'acteur
    },
    methods: {
      async fetchActorDetails() {
        const actorId = this.$route.params.id; // Récupération de l'ID de l'acteur depuis l'URL lors du clic
        try {
          const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`);
          this.actor = response.data;
          // Appeler la méthode fetchMoviesForActor en passant les URLs des films
          if (response.data.movies) {
            this.fetchMoviesForActor(response.data.movies);
          }
        } catch (error) {
          this.error = 'Erreur lors de la récupération des détails de l\'acteur.';
          console.error(error);
        }
      },
      async fetchMoviesForActor(movieUrls) {
        try {
          const movies = await Promise.all(
              movieUrls.map(url => axios.get(`http://symfony.mmi-troyes.fr:8319${url}`).then(res => res.data))
          );
          this.actorMovies = movies;
        } catch (error) {
          this.error = 'Erreur lors de la récupération des films de l\'acteur.';
          console.error(error);
        }
      },


      formatDate(date) {
        if (!date) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
      }
    }
  };
</script>

<style scoped>
  .actor-detail-container {
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .detail-actor {
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

  .actor-img-container {
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  .actor-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .awards-container {
    display: flex;
    margin: 10px 0;
    align-items: center;
    margin-left: 5%;
    width: 40%;
  }

  .trophy-icon {
    width: 45px;
    height: 45px;
    margin: 5px;
  }

  .awards-container > img:nth-child(4n+1) {
    clear: both;
  }

  h2 {
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
    text-align: center;
    width: 60%;
  }

  .actors-genre {
    text-transform: uppercase;
  }

  strong {
    font-weight: bold;
  }

  .actor-movies {
    margin-top: 20px;
    width: 100%;
  }

  .movies-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>