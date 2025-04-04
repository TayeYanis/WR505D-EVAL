<template>
  <div class="actor-detail-container">
    <h1>
      Détails de l'acteur
      <button @click="showEditModal = true" class="edit-actor-button">Éditer</button>
      <button @click="showDeleteModal = true" class="delete-actor-button">Supprimer</button>
    </h1>

    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDeleteModal">&times;</span>
        <h2>Voulez-vous vraiment supprimer l'acteur ID {{ actor.id }} ?</h2>
        <button @click="deleteActor" class="confirm-delete-button">Oui</button>
        <button @click="closeDeleteModal" class="cancel-delete-button">Non</button>
      </div>
    </div>


    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Éditer l'acteur</h2>
        <form @submit.prevent="editActor" class="formulaire">
          <p class="donnee">Prénom :</p>
          <input
              type="text"
              v-model="editActorData.firstname"
              placeholder="Prénom"
              required
              class="actor-input"
          />
          <p class="donnee">Nom :</p>
          <input
              type="text"
              v-model="editActorData.lastname"
              placeholder="Nom"
              required
              class="actor-input"
          />
          <p class="donnee">Nationalité :</p>
          <input
              type="text"
              v-model="editActorData.nationality"
              placeholder="Nationalité"
              required
              class="actor-input"
          />
          <p class="donnee">Date de naissance :</p>
          <input
              type="date"
              v-model="editActorData.dob"
              placeholder="Date de naissance"
              required
              class="actor-input"
          />
          <p class="donnee">Récompenses :</p>
          <input
              type="number"
              v-model="editActorData.awards"
              placeholder="Nombre de récompenses"
              required
              class="actor-input"
          />
          <p class="donnee">Biographie :</p>
          <textarea
              v-model="editActorData.bio"
              placeholder="Biographie"
              required
              class="actor-textarea"
          ></textarea>
          <p class="donnee">Date de décès :</p>
          <input
              type="date"
              v-model="editActorData.deathDate"
              placeholder="Date de décès"
              class="actor-input"
          />
          <p class="donnee">Image de profil :</p>
          <input
              type="text"
              v-model="editActorData.media"
              placeholder="URL de l'image"
              required
              class="actor-input"
          />
          <p class="donnee">Genre :</p>
          <select v-model="editActorData.gender" required class="actor-input">
            <option value="" disabled>Choisir un genre</option>
            <option value="male">Masculin</option>
            <option value="female">Féminin</option>
          </select>
          <p class="donnee">Films de L'Acteur :</p>
          <div class="dropdown">
            <div class="dropdown-content">
              <div class="dropdown-scroll">
                <label v-for="movie in movies" :key="movie.id">
                  <input
                      type="checkbox"
                      :value="movie['@id']"
                      v-model="editActorData.movies"
                  />
                  {{ movie.title }}
                </label>
              </div>
            </div>
          </div>
          <button type="submit" class="add-actor-button">Sauvegarder</button>
        </form>
      </div>
    </div>

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
      <p v-else>Date de décès :<br> Non décèdée,</p>
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

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import MovieCard from '@/components/MovieCard.vue';

export default {
  name: 'ActorDetail',
  components: {
    MovieCard,
  },
  data() {
    return {
      actor: null,
      error: null,
      actorMovies: [],
      movies: [],
      showEditModal: false,
      showDeleteModal: false,
      editActorData: {
        firstname: '',
        lastname: '',
        nationality: '',
        dob: '',
        awards: 0,
        bio: '',
        deathDate: null,
        media: '',
        gender: '',
        movies: [],
      },
    };
  },
  created() {
    this.fetchMovies();
    this.fetchActorDetails();
  },
  methods: {
    async fetchMovies() {
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
      try {
        // Requête GET avec Axios pour récupérer les films
        const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/movies', {
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });

        // Stocker la réponse des films dans l'état `movies`
        this.movies = response.data['hydra:member'];

        // Log pour le débogage
        console.log('Films récupérés :', this.movies);
      } catch (error) {
        // Gérer les erreurs et afficher un message d'erreur
        console.error('Erreur lors de la récupération des films', error);
        this.errorMessage = 'Erreur lors de la récupération des films. Veuillez vérifier votre connexion ou connexion utilisateur.';
      }
    },
    async deleteActor() {
      const actorId = this.$route.params.id; // Récupérer l'ID de l'acteur à partir de l'URL
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
      try {
        await axios.delete(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });
        this.$router.push('/actors'); // Redirection vers la liste d'acteurs après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'acteur', error);
        this.error = 'Erreur lors de la suppression de l\'acteur.';
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
    },
    updateSelectedMovies() {
      if (this.movies.length && this.editActorData.movies.length) {
        this.movies.forEach(movie => {
          movie.selected = this.editActorData.movies.includes(movie.id);
        });
      }
    },
    formatDateForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },
    async fetchActorDetails() {
      const actorId = this.$route.params.id; // Récupérer l'ID de l'acteur à partir des paramètres de l'URL
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage

      try {
        const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });
        this.actor = response.data;

        //const actorMovieIds = response.data.movies.map(movie => movie.id);

        this.editActorData = {
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          nationality: response.data.nationality,
          dob: this.formatDateForInput(response.data.dob),
          awards: Number(response.data.awards),
          bio: response.data.bio,
          deathDate: this.formatDateForInput(response.data.deathDate),
          media: response.data.media,
          gender: response.data.gender,
          movies: response.data.movies,
        };


        if (response.data.movies) {
          await this.fetchMoviesForActor(response.data.movies);
        }
        this.updateSelectedMovies();
      } catch (error) {
        this.error = 'Erreur lors de la récupération des détails de l\'acteur.';
        console.error(error);
      }
    },
    async fetchMoviesForActor(movieUrls) {
      try {
        this.actorMovies = await Promise.all(
            movieUrls.map(url =>
                axios.get(`http://symfony.mmi-troyes.fr:8319${url}`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`, // Ajouter le token dans l'en-tête Authorization
                    'Content-Type': 'application/json',
                  },
                }).then(res => res.data)
            )
        );
      } catch (error) {
        this.error = 'Erreur lors de la récupération des films de l\'acteur.';
        console.error(error);
      }
    },
    formatDate(date) {
      if (!date) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    },
    async editActor() {
      const actorId = this.$route.params.id; // Récupérer l'ID de l'acteur à partir des paramètres de la route
      const editActorData = {
        ...this.editActorData,
        awards: Number(this.editActorData.awards), // Convertir les récompenses en nombre
        deathDate: this.editActorData.deathDate || null, // Si la date est vide, assigner null
      };

      // Vérification des champs obligatoires
      if (!this.editActorData.firstname || !this.editActorData.lastname || !this.editActorData.nationality || !this.editActorData.dob) {
        this.error = 'Veuillez remplir tous les champs obligatoires.';
        return;
      }

      const token = localStorage.getItem('jwt_token'); // Récupérer le token JWT du localStorage

      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/merge-patch+json', // Utiliser le bon MIME type pour PATCH
          },
          body: JSON.stringify(editActorData), // Convertir les données à envoyer en JSON
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour de l\'acteur.'); // Si la réponse n'est pas "ok", lever une erreur
        }

        this.showEditModal = false; // Fermer la modal après la mise à jour
        this.fetchActorDetails(); // Rafraîchir les informations de l'acteur après la mise à jour
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'acteur', error);
        this.error = 'Erreur lors de la mise à jour de l\'acteur. Vérifiez les données saisies.'; // Afficher un message d'erreur
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.error = null;
    },
  },

  watch: {
    movies() {
      this.updateSelectedMovies();
    }
  },
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

.edit-actor-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
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
  resize: vertical;
}

.add-actor-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

.add-actor-button:hover {
  background-color: #45a049;
}

.donnee {
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
}

.delete-actor-button {
  background-color: #f44336;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.confirm-delete-button {
  background-color: #f44336;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.cancel-delete-button {
  background-color: #ccc;
  color: black;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

 @media (max-width: 900px) {
   .detail-actor {
     width: 85%;
     font-size: 15px;
   }

   .modal-content {
     width: 70%;
   }
 }
</style>
