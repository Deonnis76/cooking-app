// 📦 Загрузка рецептов (с диагностикой)

let RECIPES = [];

async function loadRecipesFromCloud() {
    try {
        console.log('🔄 НАЧИНАЕМ ЗАГРУЗКУ...');
        console.log('📋 URL:', CONFIG.googleSheetUrl);
        
        const response = await fetch(CONFIG.googleSheetUrl);
        console.log('📊 Статус:', response.status);
        
        if (!response.ok) {
            throw new Error('HTTP error: ' + response.status);
        }
        
        const text = await response.text();
        console.log('📄 Получено символов:', text.length);
        console.log('📋 Первые 500 символов:', text.substring(0, 500));
        
        const lines = text.split('\n').filter(l => l.trim());
        console.log('📊 Всего строк:', lines.length);
        
        const recipes = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('id')) continue;
            
            const parts = line.split(',');
            console.log(`Строка ${i}: ${parts.length} полей`);
            
            if (parts.length >= 5) {
                const instructions = [];
                const ingredients = [];
                
                for (let j = 4; j < parts.length; j++) {
                    const part = parts[j].trim();
                    if (part.match(/^\d+\./)) {
                        instructions.push(part);
                    } else if (part && part.length > 2) {
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
                if (recipes.length <= 3) {
                    console.log('✅ Загружен:', recipe.name);
                }
            }
        }
        
        RECIPES = recipes;
        console.log('✅✅✅ ВСЕГО РЕЦЕПТОВ:', RECIPES.length);
        
        if (RECIPES.length === 0) {
            console.error('❌ ВНИМАНИЕ: Рецепты не загружены!');
            console.error('💡 Проверьте: 1) Доступ к таблице 2) Формат CSV');
        }
        
        return RECIPES.length > 0;
        
    } catch (e) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', e);
        return false;
    }
}

console.log('✅ Модуль recipes.js загружен');
