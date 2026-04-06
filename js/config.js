// 📦 Загрузка рецептов (для таблицы с множеством столбцов)

let RECIPES = [];

async function loadRecipesFromCloud() {
    try {
        console.log('🔄 Загрузка рецептов...');
        
        const response = await fetch(CONFIG.googleSheetUrl);
        if (!response.ok) throw new Error('HTTP error: ' + response.status);
        
        const text = await response.text();
        const lines = text.split('\n').filter(l => l.trim());
        
        const recipes = [];
        
        // Пропускаем заголовки (строки 1 и 5)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('id,')) continue;
            
            const parts = line.split(',');
            
            if (parts.length >= 10) {
                // Собираем ингредиенты из столбцов H до второго с конца
                const ingredients = [];
                for (let j = 7; j < parts.length - 1; j++) {
                    if (parts[j] && parts[j].trim()) {
                        ingredients.push(parts[j].trim());
                    }
                }
                
                // Последний столбец - инструкции
                const instructions = parts[parts.length - 1] || '';
                
                const recipe = {
                    id: parseInt(parts[0]) || i,
                    name: parts[1] || 'Без названия',
                    time: parseInt(parts[2]) || 30,
                    image: parts[3] || '',
                    cuisine: parts[4] || 'universal',
                    dietType: parts[5] || 'meat',
                    forWhom: (parts[6] || 'family').split('|'),
                    ingredients: ingredients,
                    instructions: instructions
                };
                
                recipes.push(recipe);
            }
        }
        
        RECIPES = recipes;
        console.log('✅ Загружено рецептов:', RECIPES.length);
        return RECIPES.length > 0;
        
    } catch (e) {
        console.error('❌ Ошибка:', e);
        return false;
    }
}

console.log('✅ Модуль готов');
