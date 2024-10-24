<template>
  <div class="movie-detail-container">
    <h1>
      Détails du film
      <button @click="showEditModal = true" class="edit-movie-button">Éditer</button>
    </h1>

    <!-- Modal d'édition -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Éditer le film</h2>
        <form @submit.prevent="editMovie" class="formulaire">
          <p class="input-info">Titre du film, doit contenir entre 3 et 250 caractères.</p>
          <input
              type="text"
              v-model="editMovieData.title"
              placeholder="Titre (3-250 caractères)"
              required
              class="movie-input"
          />

          <p class="input-info">Description du film</p>
          <textarea
              v-model="editMovieData.description"
              placeholder="Description"
              required
              class="movie-textarea"
          ></textarea>

          <p class="input-info">Date de sortie du film.</p>
          <input
              type="date"
              v-model="editMovieData.releaseDate"
              placeholder="Date de sortie"
              required
              class="movie-input"
          />

          <p class="input-info">Durée, La durée doit être comprise entre 50 et 200 minutes.</p>
          <input
              type="number"
              v-model="editMovieData.duration"
              placeholder="Durée (50-200 minutes)"
              min="50"
              max="200"
              required
              class="movie-input"
          />

          <p class="input-info">Nombre d'entrées, Le nombre d'entrées doit être compris entre 0 et 1000.</p>
          <input
              type="number"
              v-model="editMovieData.entries"
              placeholder="Entrées (0-1000)"
              min="0"
              max="1000"
              required
              class="movie-input"
          />

          <p class="input-info">Réalisateur du film, Il doit contenir entre 3 et 255 caractères.</p>
          <input
              type="text"
              v-model="editMovieData.director"
              placeholder="Réalisateur (3-255 caractères)"
              required
              class="movie-input"
          />

          <p class="input-info">Note du film, La note doit être comprise entre 0 et 10.</p>
          <input
              type="text"
              v-model="editMovieData.rating"
              placeholder="Note (0-10)"
              @input="validateRatingInput"
              required
              class="movie-input"
          />

          <p class="input-info">Image du film Doit être une URL valide (ex : http://image.com).</p>
          <input
              type="text"
              v-model="editMovieData.media"
              placeholder="URL de l'affiche"
              required
              class="movie-input"
          />

          <p class="input-info">Acteurs du film :</p>
          <div class="dropdown">
            <div class="dropdown-content">
              <div class="dropdown-scroll">
                <label v-for="acteur in acteurs" :key="acteur.id">
                  <input
                      type="checkbox"
                      :value="acteur['@id']"
                      v-model="editMovieData.acteurs"
                  />
                  {{ acteur.firstname }} {{ acteur.lastname }}
                </label>
              </div>
            </div>
          </div>

          <br>
          <br>
          <p class="input-info">Catégories du film :</p>
          <div class="dropdown">
            <div class="dropdown-content">
              <div class="dropdown-scroll">
                <label v-for="category in categories" :key="category.id">
                  <input
                      type="checkbox"
                      :value="category['@id']"
                      v-model="editMovieData.categories"
                  />
                  {{ category.title }} <!-- Correction ici -->
                </label>
              </div>
            </div>
          </div>

          <button type="submit" class="add-movie-button">Sauvegarder les modifications</button>
        </form>
      </div>
    </div>

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
    ActorCard,
    CategoryCard,
  },
  data() {
    return {
      movie: null,
      error: null,
      movieActors: [],
      acteurs: [], // Liste des acteurs
      categories: [], // Liste des catégories
      movieCategory: [],
      showEditModal: false,
      showDeleteModal: false,
      editMovieData: {
        title: '',
        description: '',
        releaseDate: '',
        duration: null,
        entries: null,
        director: '',
        rating: null,
        media: '',
        acteurs: [],
        categories: [],
      },
    };
  },
  created() {
    this.fetchActors(); // Récupérer la liste des acteurs au moment de la création
    this.fetchCategories(); // Récupérer la liste des catégories
    this.fetchMovieDetails();
  },
  methods: {
    updateSelectedActors() {
      if (this.acteurs.length && this.editMovieData.acteurs.length) {
        this.acteurs.forEach(acteur => {
          acteur.selected = this.editMovieData.acteurs.includes(acteur['@id']);
        });
      }
    },
    updateSelectedCategories() {
      if (this.categories.length && this.editMovieData.categories.length) {
        this.categories.forEach(category => {
          category.selected = this.editMovieData.categories.includes(category['@id']);
        });
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
        this.acteurs = response.data['hydra:member']; // Stocker tous les acteurs
      } catch (error) {
        this.error = 'Erreur lors de la récupération des acteurs.'; // Message d'erreur
        console.error(error); // Afficher l'erreur dans la console
      }
    },
    async deleteMovie() {
      const movieId = this.$route.params.id; // Récupérer l'ID du film depuis les paramètres de la route
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage

      // Utilisation de fetch pour supprimer le film
      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du film');
        }

        this.$router.push('/movies'); // Rediriger après suppression
      } catch (error) {
        this.errorMessage = 'Erreur lors de la suppression du film.'; // Message d'erreur
        console.error(error);
      }
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
    },

    async fetchCategories() {
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
      try {
        const response = await fetch("http://symfony.mmi-troyes.fr:8319/api/categories", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }

        const data = await response.json();
        console.log("Catégories récupérées:", data); // Debug: Afficher les catégories récupérées
        this.categories = data['hydra:member']; // Stocker toutes les catégories
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Erreur lors de la récupération des catégories.'; // Message d'erreur
      }
    },

    validateRatingInput() {
      this.editMovieData.rating = String(this.editMovieData.rating).replace(/[^0-9,]/g, '');
    },

    async fetchMovieDetails() {
      const movieId = this.$route.params.id; // Récupération de l'ID du film depuis les paramètres de la route
      const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage

      try {
        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du film.');
        }

        const data = await response.json(); // Conversion de la réponse en JSON
        this.movie = data; // Stockage des détails du film

        // Initialiser les données pour l'édition avec la bonne structure
        this.editMovieData = {
          title: data.title,
          description: data.description,
          releaseDate: this.formatDateForInput(data.releaseDate),
          duration: data.duration,
          entries: data.entries,
          director: data.director,
          rating: data.rating,
          media: data.media,
          acteurs: data.acteurs || data.actors || [], // Assurer que seul le champ 'acteurs' ou 'actors' est utilisé
          categories: data.categories, // Même chose pour les catégories
        };

        // Récupérer les acteurs du film (pour mise à jour affichage)
        if (data.actors) {
          await this.fetchActorsForMovie(data.actors);
        }

        // Récupérer les catégories du film (pour mise à jour affichage)
        if (data.categories) {
          this.movieCategory = await Promise.all(
              data.categories.map(url => this.fetchCategoryForMovie(url))
          );
        }

        this.updateSelectedActors(); // Nouvelle méthode pour mettre à jour les acteurs sélectionnés
        this.updateSelectedCategories(); // Nouvelle méthode pour mettre à jour les catégories sélectionnées

      } catch (error) {
        this.error = 'Erreur lors de la récupération des détails du film.';
        console.error(error);
      }
    },

    async fetchActorsForMovie(actorUrls) {
      try {
        const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage

        const actors = await Promise.all(
            actorUrls.map(async (url) => {
              const response = await fetch(`http://symfony.mmi-troyes.fr:8319${url}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) {
                throw new Error(`Erreur lors de la récupération de l'acteur à l'URL: ${url}`);
              }

              return response.json(); // Retourner les données JSON de l'acteur
            })
        );

        this.movieActors = actors; // Stocker les acteurs récupérés dans movieActors
      } catch (error) {
        this.error = 'Erreur lors de la récupération des acteurs du film.';
        console.error(error);
      }
    },

    async fetchCategoryForMovie(categoryUrl) {
      try {
        const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
        const response = await axios.get(`http://symfony.mmi-troyes.fr:8319${categoryUrl}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json',
          },
        });
        return response.data; // Retourner les données de la catégorie
      } catch (error) {
        this.error = 'Erreur lors de la récupération de la catégorie du film.';
        console.error(error);
      }
    },



    async editMovie() {
      const movieId = this.$route.params.id; // Récupérer l'ID du film depuis les paramètres de la route
      try {
        const rating = parseFloat(String(this.editMovieData.rating).replace(',', '.'));

        if (rating < 0 || rating > 10) {
          alert("La note doit être comprise entre 0 et 10.");
          return;
        }

        const updatedMovieData = {
          title: this.editMovieData.title,
          description: this.editMovieData.description,
          releaseDate: this.editMovieData.releaseDate,
          duration: parseInt(this.editMovieData.duration),
          entries: parseInt(this.editMovieData.entries),
          director: this.editMovieData.director,
          rating: rating,
          media: this.editMovieData.media,
          acteurs: this.editMovieData.acteurs.map(actorId => `${actorId}`), // Assurez-vous que ceci est correct
          categories: this.editMovieData.categories.map(categoryId => `${categoryId}`), // Assurez-vous que ceci est correct
        };

        const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage

        const response = await fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/merge-patch+json', // Remplacer par le bon Content-Type
          },
          body: JSON.stringify(updatedMovieData), // Convertir les données mises à jour en JSON
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du film');
        }

        // Rafraîchir les détails du film après la mise à jour
        await this.fetchMovieDetails();

        // Fermer la modale après la réussite de la mise à jour
        this.closeEditModal();

      } catch (error) {
        this.error = 'Erreur lors de la modification du film.';
        console.error(error);
      }
    },


    closeEditModal() {
      this.showEditModal = false;
      this.error = null;
    },

    formatDateForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },

    formatDate(date) {
      if (!date) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    },

    convertRating(rating) {
      if (!rating) return 0;
      return Math.round(rating / 2);
    },
  },
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
  resize: vertical;
}

.add-movie-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}
</style>