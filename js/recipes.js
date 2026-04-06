// 📦 Загрузка рецептов

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
        
        // Красивые картинки
        const foodImages = [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
            'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
            'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
            'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
        ];
        
        // Слова которые нужно убрать
        const excludeWords = [
            'universal', 'meat', 'vegetarian', 'vegan', 'fish', 'light',
            'family', 'kids', 'adults', 'quick', 'russian', 'italian',
            'asian', 'european', 'american', 'georgian', 'french',
            'thai', 'japanese', 'chinese', 'indian', 'mexican',
            'индийская', 'итальянская', 'русская', 'французская',
            'азиатская', 'европейская', 'американская', 'грузинская',
            'тайская', 'японская', 'китайская', 'мексиканская',
            'турецкая', 'узбекская', 'украинская', 'белорусская'
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
                
                // Картинка из столбца D
                let image = '';
                if (parts.length > 3) {
                    image = parts[3].trim();
                    if (!image.includes('http')) {
                        image = '';
                    }
                }
                
                if (!image) {
                    const randomIndex = (parseInt(id) || i) % foodImages.length;
                    image = foodImages[randomIndex];
                }
                
                const ingredients = [];
                const instructions = [];
                
                for (let j = 4; j < parts.length; j++) {
                    let part = parts[j].trim();
                    if (!part) continue;
                    
                    // Пропускаем ссылки
                    if (part.includes('http') || part.includes('www.')) {
                        continue;
                    }
                    
                    // Пропускаем служебные слова
                    if (excludeWords.includes(part.toLowerCase())) {
                        continue;
                    }
                    
                    // Пропускаем если содержит |
                    if (part.includes('|')) {
                        continue;
                    }
                    
                    // Пропускаем короткие слова (меньше 2 букв)
                    if (part.length < 2) {
                        continue;
                    }
                    
                    // Убираем кавычки
                    part = part.replace(/"/g, '').trim();
                    
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
                    cuisine: 'универсальная',
                    dietType: 'мясное',
                    forWhom: ['для всех'],
                    ingredients: ingredients,
                    instructions: instructions
                };
                
                window.RECIPES.push(recipe);
            }
        }
        
        console.log('✅ Загружено рецептов:', window.RECIPES.length);
        return window.RECIPES.length > 0;
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        return false;
    }
}

console.log('✅ recipes.js готов');
