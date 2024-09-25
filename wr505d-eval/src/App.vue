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
        <router-link to="/edit-profile">Edit Profile</router-link> / 
        <a href="#" @click.prevent="logout">Logout</a>
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
nav ul {
  list-style-type: none;
  padding: 0;
}
nav ul li {
  display: inline;
  margin-right: 10px;
}
.profile-menu {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
