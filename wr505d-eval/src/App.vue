<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">Homepage</router-link></li>
        <li><router-link to="/movies">Movies</router-link></li>
        <li><router-link to="/actors">Actors</router-link></li>
        <li><router-link to="/categories">Categories</router-link></li>
      </ul>

      
      <div class="profile-menu">
        <router-link to="/login-form">Logout</router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      console.log('Déconnexion effectuée');
    }
  }
};
</script>

<style>
  nav {
    background-color: #2c3e50;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  nav ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
  }

  nav ul li {
    margin-right: 20px;
  }

  nav ul li:last-child {
    margin-right: 0;
  }

  nav a {
    color: white;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  nav a:hover {
    background-color: #34495e;
  }

  .profile-menu {
    position: relative;
  }

  .profile-menu a {
    color: #ecf0f1;
  }

  @media (max-width: 900px) {
    nav {
      flex-direction: column;
    }

    nav ul {
      flex-direction: column;
      margin-top: 10px;
    }

    nav ul li {
      margin: 5px 0;
    }
  }
</style>
