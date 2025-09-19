<script setup lang="ts">
  import {ref} from "vue";

  const rIsLoading = ref(false);
  const toggle = () => {
    rIsLoading.value = !rIsLoading.value;
  }

  defineProps({
    isLoading: {
      type: Boolean,
      required: true
    }
  })
</script>

<template>
  <div class="magic-loader" :class="{'is-loading': isLoading}">
    <div class="magic-loader__container">
      <span class="magic-loader__progress" @click="toggle"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .magic-loader {
    display: flex;
    flex-direction: column;

    &__container {
      min-width: 80px;
      max-width: 80px;
      height: 8px;
      border-radius: 10px;
      box-shadow: 0px 2px 6px rgb(0 0 0 / 10%);
      backdrop-filter: blur(10px);
      overflow: hidden;
      opacity: 0;
      transition: opacity 250ms;
    }

    &__progress {
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }

    &.is-loading {
      .magic-loader__container {
        opacity: 1;
      }
      .magic-loader__progress {
        background: linear-gradient(
                120deg,
                #00ffe7,
                #00c6ff,
                #6a5eff,
                #bf65be,
                #3eb5ff,
                #00ffe7
        );
        background-size: 300% 100%;
        animation: waterFlow 3s linear infinite;
      }
    }
  }


  @keyframes waterFlow {
    from {
      background-position: 0 0;
    }
    to {
      background-position: -300% 0; /* плавный бесшовный сдвиг */
    }
  }
</style>