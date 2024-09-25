<template>
    <div>
      <h1>Edit Profile</h1>
      <p>Modifier le profil</p>
      <button @click="logout">Se déconnecter</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EditProfile',
    methods: {
      logout() {
        console.log('Déconnexion');
      }
    }
  };
  </script>
  