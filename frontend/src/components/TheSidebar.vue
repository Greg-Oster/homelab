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
    // [
    //   "php",
    //   "Fullstack",
    //   "Программист",
    //   "Java",
    //   "Backend",
    //   "Bitrix",
    //   "Python",
    //   "WordPress",
    //   "Project",
    //   "Менеджер",
    //   "AI",
    //   "Odoo",
    //   "Flutter",
    //   "Designer",
    //   "C#",
    //   ".NET",
    //   "Golang",
    //   "Ruby",
    //   "Oracle",
    //   "Delphi",
    //   "C++",
    //   "Blockchain",
    //   "1С-Битрикс",
    //   "SEO",
    //   "QA",
    //   "DevOps",
    //   "ML",
    //   "Data",
    //   "Аналитик",
    //   "Архитектор",
    //   "Рекрутер",
    //   "Маркетолог"
    // ]

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


    // rExcluded.value = [
    //   "angular",
    //   "php",
    //   "node.js",
    //   "java",
    //   "flutter",
    //   "backend",
    //   "python",
    //   "fullstack",
    //   "ruby",
    //   "дизайнер",
    //   "c#",
    //   ".net",
    //   "manager",
    //   "golang",
    //   "bitrix",
    //   "lead",
    //   "owner",
    //   "recruiter",
    //   "rust","C#","back-end","тренер","cocos","1C-<bnhbrc","1С-Битрикс","QA","Designer","IOS","WordPress","Битрикс","Net","SEO","AI","PostgreSQL","тестированию","Менеджер","директор","Go","аналитик","Тестировщик","DevOps","DION","маркетолог","Delphi","рекрутер","Руководитель","С++","ODOO","данных","Владелец","Наставник","НСМ","Преподаватель","Full-stack","С#","Копирайтер","Security","Machine","ML-инженер"
    // ]
  }
</script>

<template>
  <div class="sidebar">
    <input type="text" @keydown="handleInputSubmit" v-model="rInput">
    <button @click="handleDefaultExclude">Шелуха</button>
    <h3>Excluded:</h3>
    <p>
      <span v-for="item in rExcluded">{{ item }}</span>
    </p>
    <div class="sidebar__footer">
      <slot></slot>
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

    &__footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>