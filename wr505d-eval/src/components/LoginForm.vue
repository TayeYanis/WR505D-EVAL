<template>
    <div class="login-form-container">
      <div class="login-form">
        <!-- Si l'utilisateur est connecté, affiche le message de bienvenue et le bouton de déconnexion -->
        <div v-if="isLoggedIn">
          <h2>Bonjour, {{ email }} !</h2>
          <p>Bienvenue sur votre profil.</p>
          <div class="logout-section">
            <button @click="logout" class="logout-button">Se déconnecter</button>
          </div>
        </div>

        <!-- Si l'utilisateur n'est pas connecté, affiche le formulaire de connexion -->
        <div v-else>
          <h2>Connexion</h2>
          <form @submit.prevent="login">
            <div>
              <label>Email</label>
              <input v-model="email" type="email" required placeholder="Entrez votre email" />
            </div>
            <div>
              <label>Mot de passe</label>
              <input v-model="password" type="password" required placeholder="Entrez votre mot de passe" />
            </div>
            <button type="submit">Se connecter</button>
          </form>

          <!-- Pop-up pour succès de la connexion -->
          <div v-if="successMessage" class="popup-success">
            Connexion réussie !
          </div>
        </div>

        <!-- Message de déconnexion -->
        <div v-if="logoutMessage" class="popup-logout">
          Vous vous êtes déconnecté.
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        email: localStorage.getItem('email') || '', // Utiliser l'email du localStorage si déjà connecté
        password: '',
        successMessage: false,
        logoutMessage: false,
        isLoggedIn: !!localStorage.getItem('jwt_token'), // Vérifie si l'utilisateur est connecté
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch('http://symfony.mmi-troyes.fr:8319/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            const token = data.token;
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('email', this.email); // Sauvegarder l'email dans le localStorage
            this.successMessage = true;
            this.isLoggedIn = true;

            setTimeout(() => {
              this.$router.push('/'); // Redirection après 2 secondes
            }, 2000);
          } else {
            alert(data.message || 'Échec de la connexion');
          }
        } catch (error) {
          console.error('Erreur lors de la connexion', error);
          alert('Erreur de connexion');
        }
      },
      logout() {
        // Supprimer le token et l'email du localStorage et réinitialiser l'état de l'application
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('email');
        this.isLoggedIn = false;
        this.email = '';
        this.password = '';
        this.logoutMessage = true; // Afficher le message de déconnexion

        // Cacher le message après 2 secondes
        setTimeout(() => {
          this.logoutMessage = false;
        }, 2000);
      },
    },
  };
</script>

<style>
  .login-form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f9f9f9;
  }

  .login-form {
    width: 100%;
    max-width: 430px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 20px;
  }

  h2 {
    text-align: center;
  }

  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .popup-success, .popup-logout {
    text-align: center;
    margin-top: 10px;
    color: green;
  }

  .popup-logout {
    color: red;
  }
</style>
