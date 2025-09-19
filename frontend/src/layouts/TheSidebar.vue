<script setup lang="ts">
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__body">
      <slot name="body"></slot>
    </div>
    <div class="sidebar__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .sidebar {
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 250px;
    height: 100%;
    border-right: 1px solid rgba(255, 255, 255, 0.25);

    &__body {
      display: flex;
      gap: 10px;
      flex-direction: column;
      min-height: 0;
    }

    &__footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>