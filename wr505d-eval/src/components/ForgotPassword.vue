<template>
  <div class="forgot-password-container">
    <h1>Mot de passe oublié</h1>
    <form @submit.prevent="submitEmail">
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" v-model="email" required />
      </div>
      <button type="submit">Envoyer le lien de réinitialisation</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'ForgotPassword',
    data() {
      return {
        email: ''
      };
    },
    //POUR UNE SIMULATION
    methods: {
      submitEmail() {
        // fonction pour envoyer un lien de réinitialisation du mot de passe (simulé ici)
        alert(`Un email de réinitialisation a été envoyé à ${this.email}`);
        this.$router.push('/login-form'); // Redirige vers la page de connexion après l'envoi
      }
    }
  };
</script>

<style>
  .forgot-password-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
  }
  .form-group {
    margin-bottom: 15px;
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
