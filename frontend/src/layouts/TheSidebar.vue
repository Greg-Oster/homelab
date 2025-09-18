<script setup lang="ts">
  import { ref } from 'vue'

  const emit = defineEmits(['filter']);

  const rExcluded = ref<string[]>([]);
  const rInput = ref("");
  const handleInputSubmit = (key: KeyboardEvent) => {
    if (key.code === 'Enter') {
      rExcluded.value.push(rInput.value)
      rInput.value = ''
      emit('filter', rExcluded.value)
    }
  }

  const handleDefaultExclude = () => {
    rExcluded.value =
    [
      "php",
      "java",
      "python",
      "backend",
      "fullstack",
      "devops",
      "qa",
      "ux/ui",
      "designer",
      "manager",
      "recruiter",
      "analyst",
      "seo",
      "flutter",
      "golang",
      "blockchain",
      "c#",
      "c++",
      "ruby",
      ".net",
      "odoo",
      "delphi",
      "ml",
      "ai",
      "testing",
      "security",
      "bi",
      "project",
      "mobile",
      "ios",
      "android",
      "database",
      "teamlead",
      "lead",
      "product",
      "creative",
      "application",
      "wordpress",
      "manual",
      "etl",
      "system",
      "architect",
      "qa-fullstack",
      "pre-sale",
      "cloud",
      "sales",
      "devops-инженер",
      "fpga",
      "analytics"
    ]
  }
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