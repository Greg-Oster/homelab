<script setup lang="ts">
import MagicButton from "./MagicButton.vue";
</script>

<template>
<div class="form-container glass-container">
  <MagicButton/>
</div>
</template>

<style scoped>
.form-container {
  margin: auto;
  height: 50vh;
  max-width: 250px;
  width: 100%;
}

.glass-container {
  background: rgba(255, 255, 255, 0.1); /* лёгкая прозрачность */
  border-radius: 20px;                  /* скруглённые углы */
  padding: 2rem;                        /* внутренние отступы */
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  border: 1px solid rgba(255, 255, 255, 0.25); /* деликатная рамка */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);   /* мягкая тень */

  display: flex;                        /* универсальная сетка */
  flex-direction: column;               /* элементы сверху вниз */
  align-items: center;                  /* по центру */
  gap: 1rem;                            /* расстояние между детьми */
}

</style>