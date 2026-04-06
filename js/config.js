// 📦 Загрузка рецептов (исправленный парсер)

let RECIPES = [];

async function loadRecipesFromCloud() {
    try {
        console.log('🔄 Загрузка...');
        
        const response = await fetch(CONFIG.googleSheetUrl);
        const text = await response.text();
        const lines = text.split('\n').filter(l => l.trim());
        
        const recipes = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('id')) continue;
            
            const parts = line.split(',');
            
            // Новый формат: id,name,time,url,instruction1,instruction2...
            if (parts.length >= 5) {
                // Собираем все инструкции (начинаются с цифр и точки)
                const instructions = [];
                const ingredients = [];
                
                for (let j = 4; j < parts.length; j++) {
                    const part = parts[j].trim();
                    if (part.match(/^\d+\./)) {
                        // Это инструкция (начинается с "1." "2." и т.д.)
                        instructions.push(part);
                    } else if (part && part.length > 2) {
                        // Это ингредиент
                        ingredients.push(part);
                    }
                }
                
                const recipe = {
                    id: parseInt(parts[0]) || i,
                    name: parts[1] || 'Без названия',
                    time: parseInt(parts[2]) || 30,
                    image: parts[3] || '',
                    cuisine: 'universal',
                    dietType: 'meat',
                    forWhom: ['family'],
                    ingredients: ingredients,
                    instructions: instructions
                };
                
                recipes.push(recipe);
                console.log('✅ Рецепт:', recipe.name, '| Ингредиентов:', ingredients.length);
            }
        }
        
        RECIPES = recipes;
        console.log('✅✅✅ ВСЕГО РЕЦЕПТОВ:', RECIPES.length);
        return RECIPES.length > 0;
        
    } catch (e) {
        console.error('❌ Ошибка:', e);
        return false;
    }
}

console.log('✅ Модуль готов');
