<script setup lang="ts">
import MagicButton from "../components/ui/MagicButton.vue";
import TheTable from "../components/data-display/TheTable.vue";
import TheSidebar from "../layouts/TheSidebar.vue";
import TagList from "../components/data-display/TagList.vue";

import {computed, ref, watch} from 'vue';
import {useHandleSearch} from "../composables/useHandleSearch.ts";
import {formatDateTime} from "../utils/formatDate.ts";
import TheLoader from "../components/ui/TheLoader.vue";

const rSearchText = ref('Фронтенд разработчик')
const { handleSearch, allData, isLoadingData } = useHandleSearch(rSearchText)

const cTableAllData = computed(() => {
  return allData.value.flatMap((requestData) => requestData.items )
})
const cIsShowTable = computed(() => cTableAllData.value.length)

// Константное значение столбцов таблицы
const userColumns = [
  // { key: 'id', label: 'ID' },
  { key: 'published_at', label: 'Дата', render: (val: string) => {return formatDateTime(val)} },
  { key: 'name', label: 'Name' },
  { key: 'work_format', label: 'work_format', render: (val: any) => {return val} },
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

  const stopList = Object.entries(counts).map(([name, count]) => ({ name, count }))


  return { filtered, stopList } // counts: { word1: 3, word2: 0, ... }
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
  if (rExcluded.value.length) {
    rExcluded.value = []
  } else {
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
}

const handleDeleteItem = (name: string) => {
  rExcluded.value = rExcluded.value.filter(w => w !== name)
}

watch(rExcluded, (newValue) => {
  handleFilter(newValue)
})

const cTagListBtnText = computed(() => {
  if (rExcluded.value.length) {
    return 'Очистить все'
  } else {
    return 'Отфильтровать'
  }
})

const handleApiTest = () => {
  const test = fetch('https://api.grishaostrouhov.online/api/vacancies').then(res => res.json())
  console.log(test)
}

const handleAskGpt = async (data: any) => {
  const rowData = data;
  const url = rowData.url;
  const vacancyData = await fetch(url).then(res => res.json())
  const vacancyDescriptionRaw = vacancyData.description
  const vacancyDescriptionClean = cleanHtmlFromTag(vacancyDescriptionRaw)
  console.log(vacancyDescriptionClean)
  const gptResponse = await sendToGpt(vacancyDescriptionClean, 'Какой опыт нужно указать в резюме чтобы меня позвали на собеседование?')
  console.log(gptResponse)
}

const cleanHtmlFromTag = (html: string) => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

const sendToGpt = async (data: any, prompt: any) => {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ты аналитик. Обрабатывай данные по инструкции." },
        { role: "user", content: `Данные: ${data}. Инструкция: ${prompt}` }
      ],
      temperature: 0.7
    })
  });

  return await r.json();
}
</script>

<template>
  <div class="home-view glass-container">
    <TheSidebar @filter="handleFilter">
      <template #body>
        <input type="text" @keydown="handleInputSubmit" v-model="rInput">
        <TagList :list="filterStats.stopList" @delete="handleDeleteItem">
          <span @click="handleDefaultExclude" class="taglist-btn">{{ cTagListBtnText }}</span>
        </TagList>
      </template>
      <template #footer>
        <h4>Count: {{ cCount }}</h4>
        <input v-model="rSearchText"/>
        <MagicButton @click="handleSearch" class="btn"/>
        <MagicButton @click="handleApiTest" class="btn"/>
      </template>
    </TheSidebar>
    <div class="main-content">
      <TheLoader :is-loading="isLoadingData"/>
      <TheTable
          v-if="cIsShowTable"
          :rows="filteredData.length > 0 ? filteredData : cTableAllData"
          :columns="userColumns"
          @click="handleAskGpt"
      />
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
  padding-top: 15px;
  padding-left: 15px;
  gap: 10px;
}

</style>