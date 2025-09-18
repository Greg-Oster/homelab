import { ref, computed } from 'vue';
import type { Ref } from 'vue'

export function useHandleSearch(rSearchText: Ref<string>) {
    const url = 'https://api.hh.ru/vacancies'
    const perPage = 100

    const params = computed(() => {
        return {
            text: rSearchText.value,
            area: 1,
            per_page: perPage,
        }
    })
    const getSearchParamsString = computed(() => {
        const searchParams = new URLSearchParams();

        Object.keys(params.value).forEach(key => {
            const value = params.value[key];
            searchParams.append(key, value);
        })

        return searchParams
    })

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

    const allData = ref<any[]>([])
    const handleSearch = async () => {
        const data = await fetchData(`${url}?page=0&${getSearchParamsString.value}`)
        const itemsFound = data.found
        const totalRequestsNeeded = Math.floor(itemsFound / perPage)
        allData.value = await fetchPages(`${url}?${getSearchParamsString.value}`, 0, totalRequestsNeeded);
    }

    return { handleSearch, allData };
}