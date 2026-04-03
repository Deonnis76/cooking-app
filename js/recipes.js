// 📦 Загрузка рецептов из Google Таблицы

let RECIPES = [];

async function loadRecipesFromCloud() {
    try {
        console.log('🔄 Загрузка...');
        
        const response = await fetch(CONFIG.googleSheetUrl);
        const text = await response.text();
        
        const recipes = [];
        const lines = text.split('\n').filter(l => l.trim());
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const parts = line.split(';');
            
            if (parts.length >= 9) {
                // Ингредиенты
                const ingredients = [];
                for (let j = 7; j < parts.length - 1; j++) {
                    if (parts[j].trim()) {
                        ingredients.push(parts[j].trim());
                    }
                }
                
                // Инструкции - исправленный парсер
                const instructionsRaw = parts[parts.length - 1] || '';
                const instructions = instructionsRaw
                    .replace(/,+/g, '')  // Убираем запятые
                    .split(/\d+\.\s*/)   // Разделяем по "1." "2." и т.д.
                    .filter(s => s.trim() && s.length > 5)
                    .map(s => s.trim());
                
                recipes.push({
                    id: parseInt(parts[0]) || i,
                    name: parts[1] || 'Без названия',
                    time: parseInt(parts[2]) || 30,
                    image: parts[3] || '',
                    cuisine: parts[4] || 'universal',
                    dietType: parts[5] || 'meat',
                    forWhom: (parts[6] || 'family').split('|').map(s => s.trim()),
                    ingredients: ingredients,
                    instructions: instructions
                });
                
                console.log('✅ Рецепт:', recipes[recipes.length - 1].name);
                console.log('   Инструкции:', instructions);
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
