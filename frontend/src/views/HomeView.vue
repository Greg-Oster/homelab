<script setup lang="ts">
import MagicButton from "../components/ui/MagicButton.vue";
import TheTable from "../components/data-display/TheTable.vue";
import TheSidebar from "../layouts/TheSidebar.vue";
import TagList from "../components/data-display/TagList.vue";

import { ref, computed, watch } from 'vue';
import { useHandleSearch } from "../composables/useHandleSearch.ts";
import {formatDateTime} from "../utils/formatDate.ts";

const rSearchText = ref('Фронтенд разработчик')
const { handleSearch, allData } = useHandleSearch(rSearchText)

const cTableAllData = computed(() => {
  return allData.value.flatMap((requestData) => requestData.items )
})
const cIsShowTable = computed(() => cTableAllData.value.length)

const userColumns = [
  // { key: 'id', label: 'ID' },
  { key: 'published_at', label: 'Дата', render: (val: string) => {return formatDateTime(val)} },
  { key: 'name', label: 'Name' },
  { key: 'has_test', label: 'has_test' },
  // { key: 'url', label: 'Url' },
  { key: 'id', label: 'Link to HH', render: (value: string) => { return `https://hh.ru/vacancy/${value}` } },
]

const rExcludeList = ref<string[]>([]);
const handleFilter = (value: string[]) => {
  rExcludeList.value = value
}

const filteredData = computed(() => {
  const excluded = rExcludeList.value.map(w => w.toLowerCase())
  return cTableAllData.value.filter(tableRow => {
    const vacancyName = tableRow.name.toLowerCase()
    return !excluded.some(word => {
      return vacancyName.includes(word)
    })
  })
})

const filterStats = computed(() => {
  const excluded = rExcludeList.value.map(w => w.toLowerCase())

  // инициализируем объект для подсчета
  const counts = excluded.reduce<Record<string, number>>((acc, word) => {
    acc[word] = 0
    return acc
  }, {})

  const filtered = cTableAllData.value.filter(tableRow => {
    const vacancyName = tableRow.name.toLowerCase()
    let excludeThisRow = false

    excluded.forEach(word => {
      if (vacancyName.includes(word)) {
        counts[word]++          // увеличиваем счетчик для этого слова
        excludeThisRow = true   // помечаем, что элемент нужно исключить
      }
    })

    return !excludeThisRow
  })

  return { filtered, counts } // counts: { word1: 3, word2: 0, ... }
})


const cCount = computed(() => {
  return filteredData.value.length
})


const rExcluded = ref<string[]>([]);
const rInput = ref("");
const handleInputSubmit = (key: KeyboardEvent) => {
  if (key.code === 'Enter') {
    rExcluded.value.push(rInput.value)
    rInput.value = ''
    handleFilter(rExcluded.value)
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

const handleDeleteItem = (name: string) => {
  rExcluded.value = rExcluded.value.filter(w => w !== name)
}

watch(rExcluded, (newValue) => {
  handleFilter(newValue)
})
</script>

<template>
  <div class="home-view glass-container">
    <TheSidebar @filter="handleFilter">
      <template #body>
        <input type="text" @keydown="handleInputSubmit" v-model="rInput">
        <button @click="handleDefaultExclude">Исп. исключения</button>
        <TagList :list="rExcluded" @delete="handleDeleteItem"/>
      </template>
      <template #footer>
        <h4>Count: {{ cCount }}</h4>
        <input v-model="rSearchText"/>
        <MagicButton @click="handleSearch" class="btn"/>
      </template>
    </TheSidebar>
    <div class="main-content">
      <TheTable v-if="cIsShowTable" :rows="filteredData.length > 0 ? filteredData : cTableAllData" :columns="userColumns"/>
    </div>
  </div>
</template>

<style scoped>

.home-view {
  margin: auto;
  height: 90vh;
  width: 100%;
  overflow:hidden;
}

.btn {
  flex: 1;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100%;
  flex:1;
  min-width: 0;
}

</style>