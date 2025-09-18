export function formatDateTime(isoString: string): string {
    // создаём объект Date
    const date = new Date(isoString)

    // опции для форматирования
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',  // "сентябрь"
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,  // 24-часовой формат
    }

    // форматируем по локали (русский)
    return date.toLocaleString('ru-RU', options)
}