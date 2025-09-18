<script setup lang="ts">
import MagicButton from "./MagicButton.vue";
import TheTable from "./TheTable.vue";

import { ref, computed, reactive } from 'vue';
import TheSidebar from "./TheSidebar.vue";

const url = 'https://api.hh.ru/vacancies'
const rPerPage = ref(100)
const rSearchText = ref('Фронтенд разработчик vue')

const params = reactive({
  text: rSearchText,
  area: ref(1),
  per_page: rPerPage,
})

const getSearchParamsString = () => {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    const value = params[key];
    searchParams.append(key, value);
  })

  return searchParams
}

const fetchData = async (url: string) => {
  const res = await fetch(url)
  return await res.json()
}
async function fetchPages(url: string, from = 0, to = 20, batchSize = 5) {
  const results: any[] = [];

  // Всего страниц
  const pages = [];
  for (let page = from; page <= to; page++) {
    pages.push(page);
  }

  // Идём по батчам
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);

    const promises = batch.map(page =>
        fetch(`${url}&page=${page}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Ошибка на странице ${page}: ${response.status}`);
              }
              return response.json();
            })
    );

    try {
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }

  console.log('Все ответы получены:', results);
  return results;
}



const allData = ref([])
const handleClick = async () => {
  const searchParams = getSearchParamsString();
  const data = await fetchData(`${url}?page=0&${searchParams}`)
  const itemsFound = data.found
  const totalRequestsNeeded = Math.floor(itemsFound / rPerPage.value)
  allData.value = await fetchPages(`${url}?${searchParams}`, 0, totalRequestsNeeded);
}

const cTableData = computed(() => allData.value[0]?.items)
const cTableAllData = computed(() => {
  let res = []
  allData.value.forEach((requestData) => {
    res.push(...requestData.items)
  })
  return res
})

const userColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'url', label: 'Url' },
  { key: 'id', label: 'Link to HH', render: (value: string) => { return `https://hh.ru/vacancy/${value}` } },
]

const rExcludeList = ref<string[]>([]);
const handleFilter = (value: string[]) => {
  rExcludeList.value = value
}
// const filteredData = computed(() => {
//   const excluded = rExcludeList.value
//   return cTableAllData.value.filter((item) => {
//     const data = item.name.toLowerCase();
//
//     for (let i = 0; i < excluded.length; i++) {
//       const excludeWord = excluded[i].toLowerCase()
//       let flag = true
//
//       if (data.includes(excludeWord)) {
//         flag = false
//       }
//
//       if (flag) {
//         return true
//       } else {
//         return false
//       }
//     }
//   })
// })
const cTestOnlyNames = computed(() => {
  return cTableAllData.value.map(item => item.name);
})
// const filteredData = computed(() => {
//   const excluded = rExcludeList.value.map(w => w.toLowerCase())
//   return cTableAllData.value.filter((item) => {
//     const data = item.name.toLowerCase()
//     // true если не содержит ни одного слова из excluded
//     return !excluded.some(word => data.includes(word))
//   })
// })

// const filteredData = computed(() => {
//   const excluded = rExcludeList.value.map(w => w.toLowerCase())
//
//   return cTableAllData.value.filter((item) => {
//     const data = item.name.toLowerCase()
//     // разбиваем строку на слова по пробелам, дефисам, слешам и т.д.
//     const words = data.split(/[\s\-\/()]+/)
//
//     // true если ни одно слово не входит в список исключений
//     return !words.some(word => excluded.includes(word))
//   })
// })

const filteredData = computed(() => {
  const excluded = rExcludeList.value.map(w => w.toLowerCase())
  return cTableAllData.value.filter(item => {
    const data = item.name.toLowerCase()
    // true если ни одно слово из excluded не встречается в data
    return !excluded.some(word => {
      // точное совпадение слова с точкой учитываем
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      return regex.test(data)
    })
  })
})


const cCount = computed(() => {
  return filteredData.value.length
})
</script>

<template>
  <div class="form-container glass-container">
    <TheSidebar @filter="handleFilter">
      <h4>Count: {{ cCount }}</h4>
      <input v-model="rSearchText"/>
      <MagicButton @click="handleClick" class="btn"/>
    </TheSidebar>
    <div class="main-content">
      <TheTable v-if="cTableData" :rows="filteredData.length > 0 ? filteredData : cTableAllData" :columns="userColumns"/>
    </div>
  </div>
</template>

<style scoped>

.form-container {
  margin: auto;
  height: 85vh;
  width: 100%;
}

.btn {
  flex: 1;
}

.glass-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100%;
  flex:1;
}

</style>