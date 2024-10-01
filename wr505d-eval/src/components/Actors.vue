<template>
  <div class="actors-container">
    <h1>Actors</h1>
    <div v-if="actors.length > 0">
      <p>Liste des acteurs</p>
      <div class="list-actors">
        <div v-for="actor in actors" :key="actor.id" class="actor-card">
          <div class="actor-img-container" v-if="actor.media">
            <img :src="actor.media" alt="Image de l'acteur" class="actor-media" />
          </div>
          <h2>{{ actor.firstname }} {{ actor.lastname }}</h2>
          <p><strong>Date de naissance :</strong> {{ formatDate(actor.dob) }}</p>
          <p><strong>Nationalité :</strong> {{ actor.nationality }}</p>
          <p><strong>Récompenses :</strong> {{ actor.awards }} prix</p>
          <div class="awards-container">
            <span v-if="actor.awards > 0">
              <img v-for="n in actor.awards" :key="n" src="../assets/trophy.png" alt="Trophée" class="trophy-icon" />
            </span>
            <span v-else>Aucune récompense</span>
          </div>
          <p><strong>Biographie :</strong> {{ actor.bio }}</p>
          <p class="actors-genre"><strong>Genre :</strong> {{ actor.gender }}</p>
          <!-- Affiche la date de décès seulement si ELLE EST N'EST PAS NUL -->
          <p v-if="actor.deathDate"><strong>Date de décès :</strong> {{ formatDate(actor.deathDate) }}</p>
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
      error: null  // gestion en cas d'erreur
    };
  },
  created() {
    this.fetchActors();  // Appeler la méthode afin de récuperer les élement de l'entiter Actor
  },
  methods: {
    async fetchActors() {
      try {
        const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors');
        this.actors = response.data['hydra:member'];
      } catch (error) {
        this.error = 'Erreur lors de la récupération des acteurs.';
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
  .actors-container {
    padding: 20px;
  }

  h1 {
    margin-bottom: 20px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
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
    width: 75%;
    margin-left: 15%;
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
  }

  .actors-genre {
    text-transform: uppercase;
  }

  strong {
    font-weight: bold;
  }
</style>
