<template>
  <div class="login-container">
    <h1>Connexion</h1>
    <p>Remplissez ce formulaire pour vous connecter.</p>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" v-model="email" style="margin-left: 15%;" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input type="password" v-model="password" style="margin-left: 2%;" required />
      </div>
      <p class="forgot-password">
        <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
      </p>
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>


<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      // Définisement de la variable email et password pour un mail test@example.com et un mot de passe password
      if (this.email === 'test@example.com' && this.password === 'password') { // Si connexion réussit
        alert('Connexion réussie !');
        this.$router.push('/'); // Redirection vers la page d'accueil en cas de réussite
      } else { //Sinon
        alert('Email ou mot de passe incorrect'); //Mise en place d'un message error
      }
    }
  }
};
</script>

<style>
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
    margin-left:15%;
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

  .forgot-password {
    margin-top: 10px;
    margin-left: 15%;

  }
</style>
