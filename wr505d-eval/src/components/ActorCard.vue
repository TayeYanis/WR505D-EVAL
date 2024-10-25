<template>
  <div
      :key="actor.id"
      class="actor-card"
      @click="goToActorDetails(actor.id)"
  >
    <div class="actor-img-container" v-if="actor.media">
      <img :src="actor.media" alt="Image de l'acteur" class="actor-media" />
    </div>
    <h2>{{ actor.firstname }} {{ actor.lastname }}</h2>
    <p><strong>Biographie :</strong> {{ actor.bio }}</p>
    <p class="actors-genre"><strong>Genre :</strong> {{ actor.gender }}</p>
  </div>
</template>

<script>
  export default {
    name: 'ActorCard',
    props: {
      actor: {
        type: Object,
        required: true,
      },
    },
    methods: {
      formatDate(date) {
        if (!date) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
      },
      goToActorDetails(id) {
        this.$router.push({ name: 'ActorDetail', params: { id } }); // Rediriger vers la page ActorDetail avec l'ID
      }
    },
  };
</script>

<style scoped>
  .actor-card {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
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
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;
    width: 80%;
  }

  .trophy-icon {
    width: 45px;
    height: 45px;
    margin: 5px;
  }

  .trophy-icon:nth-child(4n) {
    margin-right: 0;
  }

  h2 {
    margin-bottom: 10px;
    text-align: center;
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
