const BASE_URL = 'http://localhost:3000';

export async function useFetch(api: string, options?: any) {
    const res = await fetch(`${BASE_URL}${api}`, options);
    return await res.json();
}