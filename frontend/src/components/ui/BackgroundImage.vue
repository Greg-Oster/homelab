<script setup lang="ts">
</script>

<template>
  <div class="bg-image"></div>
</template>

<style scoped lang="scss">
  .bg-image {
    height: 100vh;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    filter: contrast(160%) brightness(80%);
    background: linear-gradient(37deg, rgb(55, 71, 76), rgba(74, 63, 122, 0.45)), url("../../assets/svg/gradient.svg") center;
    //background-size: cover;
    z-index: -1;
  }
</style>
