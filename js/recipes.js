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
        
        // Массив случайных картинок для еды
        const foodImages = [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
            'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
            'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
            'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
            'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
            'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400',
            'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400',
            'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'
        ];
        
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
                let image = parts[3].trim();
                
                // Если картинка пустая или невалидная - берем случайную
                if (!image || image === '' || !image.includes('http')) {
                    // Берем случайную картинку на основе ID рецепта
                    const randomIndex = (parseInt(id) || i) % foodImages.length;
                    image = foodImages[randomIndex];
                }
                
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
