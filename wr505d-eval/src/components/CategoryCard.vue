<template>
  <div
      :key="category.id"
      class="category-card"
  >
    <h2>{{ category.title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.category-card {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 10px;
  text-align: center;
}

p {
  margin: 5px 0;
  text-align: center;
}

strong {
  font-weight: bold;
}
</style>
