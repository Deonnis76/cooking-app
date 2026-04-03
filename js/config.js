// ⚙️ Конфигурация приложения

const CONFIG = {
    appName: 'Кулинарный помощник',
    version: '1.0',
    minMatchPercent: 30,
    
    // Источник данных: 'local' или 'cloud'
    dataSource: 'cloud',
    
    // Ссылка на опубликованную Google Таблицу (CSV)
    // Формат таблицы: разделитель полей = точка с запятой (;)
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBlA_TkbEy68lne2d5FdinmQJJJl-wyXPaKQHVe7FhRVADC7qIwQHK_8hoCoRL83mu5kQxLT8Ml3iM/pub?gid=0&single=true&output=csv'
};

console.log('✅ Config загружен');