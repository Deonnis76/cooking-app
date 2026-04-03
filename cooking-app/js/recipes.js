// 📦 Загрузка рецептов из Google Таблицы (разделитель: ;)

let RECIPES = [];

async function loadRecipesFromCloud() {
    try {
        console.log('🔄 Загрузка...');
        
        const response = await fetch(CONFIG.googleSheetUrl);
        const text = await response.text();
        
        const recipes = [];
        const lines = text.split('\n').filter(l => l.trim());
        
        // Пропускаем заголовок (строка 0)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Разбиваем по ТОЧКЕ С ЗАПЯТОЙ
            const parts = line.split(';');
            
            console.log(`📝 Строка ${i}: ${parts.length} полей`);
            
            if (parts.length >= 9) {
                // Ингредиенты уже разделены точкой с запятой
                const ingredients = [];
                for (let j = 7; j < parts.length - 1; j++) {
                    if (parts[j].trim()) {
                        ingredients.push(parts[j].trim());
                    }
                }
                
                // Инструкции разделяем по точке
                const instructionsRaw = parts[parts.length - 1] || '';
                const instructions = instructionsRaw
                    .split(/\d+\.\s*/)
                    .filter(s => s.trim())
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
                console.log('   Ингредиенты:', ingredients);
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