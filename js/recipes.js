// 📦 Модуль загрузки рецептов

window.RECIPES = window.RECIPES || [];

async function loadRecipesFromCloud() {
    try {
        console.log('🔄 Начинаем загрузку...');
        
        const response = await fetch(CONFIG.googleSheetUrl);
        console.log('📊 Статус:', response.status);
        
        if (!response.ok) {
            throw new Error('HTTP error: ' + response.status);
        }
        
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        console.log('📊 Строк в CSV:', lines.length);
        
        window.RECIPES = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line || line.startsWith('id,') || line.startsWith('"id')) {
                continue;
            }
            
            const parts = line.split(',');
            
            if (parts.length >= 5) {
                const id = parts[0].trim();
                const name = parts[1].trim();
                const time = parseInt(parts[2]) || 30;
                const image = parts[3].trim();
                
                const ingredients = [];
                const instructions = [];
                
                for (let j = 4; j < parts.length; j++) {
                    const part = parts[j].trim();
                    if (!part) continue;
                    
                    if (part.match(/^\d+\./)) {
                        instructions.push(part);
                    } else {
                        ingredients.push(part);
                    }
                }
                
                const recipe = {
                    id: parseInt(id) || window.RECIPES.length + 1,
                    name: name || 'Без названия',
                    time: time,
                    image: image,
                    cuisine: 'universal',
                    dietType: 'meat',
                    forWhom: ['family'],
                    ingredients: ingredients,
                    instructions: instructions
                };
                
                window.RECIPES.push(recipe);
            }
        }
        
        console.log('✅ Загружено рецептов:', window.RECIPES.length);
        return window.RECIPES.length > 0;
        
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        return false;
    }
}

console.log('✅ Модуль recipes.js готов');
