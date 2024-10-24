<template>
  <div class="login-form">
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
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      successMessage: false,
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
          // Supposons que le token est dans data.token
          const token = data.token;

          // Stocker le token dans le localStorage
          localStorage.setItem('jwt_token', token);

          // Afficher la pop-up de succès
          this.successMessage = true;

          // Rediriger après un petit délai (ex. 2 secondes)
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
        } else {
          // Gérer les erreurs de connexion
          alert(data.message || 'Échec de la connexion');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion', error);
        alert('Erreur de connexion');
      }
    },
  },
};
</script>

<style>
/* Styles identiques à ton code de base */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding-top: 50px;
}

h1 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 20px;
}

.login-form {
  width: 100%;
  max-width: 430px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
  margin-left: 15%;
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
</style>
/* EXEMPLE :
  form basique
  username et password classique
  faire les requete comme les autres donc axios

  faire sur data une vérification
  if (TOKEN RECUPERER) {
    redirect
  }
  else {
    try
    count response await axios post : URL/api/auth
  }
   */



  /*
  A CHAQUE FOIS QUE l'APPEL A L'API SUR UN FICHIER INSERER UN un asyn getActor(){
    if (!token) {
    rediriger ailleur
    }
    mettre une const response = await  axios URL/api/actor {
      headers: {
        Autorization: 'Bearer $'{token}',
        Accept: 'application/json',
      }
    });
    ET LA ON LUI DIT QUE C'EST BON DONC ON MET
    this.actors=response.data
  }
   */




