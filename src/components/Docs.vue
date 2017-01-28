<template>
  <div>
    <h2>Docs of {{username}}</h2>
  </div>
</template>

<script>
export default {
  name: 'docs',
  data() {
    const {
      username,
    } = this.$route.params;
    return {
      username,
    };
  },
};
</script>

<style>
</style>
