// 📦 Модуль загрузки рецептов из Google Таблицы

const RECIPES = [];

async function loadRecipesFromCloud() {
    try {
        console.log('🔄 Начинаем загрузку рецептов...');
        console.log('📋 URL:', CONFIG.googleSheetUrl);
        
        const response = await fetch(CONFIG.googleSheetUrl);
        console.log('📊 Статус ответа:', response.status);
        
        if (!response.ok) {
            throw new Error('HTTP error: ' + response.status);
        }
        
        const text = await response.text();
        console.log('📄 Получено символов:', text.length);
        
        const lines = text.split('\n').filter(line => line.trim());
        console.log('📊 Всего строк в CSV:', lines.length);
        
        // Показываем первые 3 строки для отладки
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            console.log(`Строка ${i}:`, lines[i].substring(0, 200));
        }
        
        let recipesCount = 0;
        
        // Пропускаем заголовки (строки 0 и 4)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Пропускаем пустые строки и заголовки
            if (!line || line.startsWith('id,') || line.startsWith('"id')) {
                continue;
            }
            
            const parts = line.split(',');
            
            // Должно быть минимум 5 полей: id, name, time, image, instructions...
            if (parts.length >= 5) {
                const id = parts[0].trim();
                const name = parts[1].trim();
                const time = parseInt(parts[2]) || 30;
                const image = parts[3].trim();
                
                // Собираем ингредиенты и инструкции
                const ingredients = [];
                const instructions = [];
                
                for (let j = 4; j < parts.length; j++) {
                    const part = parts[j].trim();
                    if (!part) continue;
                    
                    // Если начинается с цифры и точки - это инструкция
                    if (part.match(/^\d+\./)) {
                        instructions.push(part);
                    } else {
                        // Иначе это ингредиент
                        ingredients.push(part);
                    }
                }
                
                const recipe = {
                    id: parseInt(id) || recipesCount + 1,
                    name: name || 'Без названия',
                    time: time,
                    image: image,
                    cuisine: 'universal',
                    dietType: 'meat',
                    forWhom: ['family'],
                    ingredients: ingredients,
                    instructions: instructions
                };
                
                RECIPES.push(recipe);
                recipesCount++;
                
                // Показываем первые 3 рецепта
                if (recipesCount <= 3) {
                    console.log('✅ Загружен рецепт:', recipe.name);
                    console.log('   Ингредиенты:', ingredients.length);
                    console.log('   Инструкций:', instructions.length);
                }
            }
        }
        
        console.log('✅✅✅ ВСЕГО ЗАГРУЖЕНО РЕЦЕПТОВ:', recipesCount);
        
        if (recipesCount === 0) {
            console.error('❌ ВНИМАНИЕ: Рецепты не загружены!');
            console.error('💡 Возможные причины:');
            console.error('   1) Таблица не опубликована');
            console.error('   2) Неверный URL');
            console.error('   3) Неправильный формат данных');
        }
        
        return recipesCount > 0;
        
    } catch (error) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ЗАГРУЗКИ:', error);
        console.error('💡 Проверьте:');
        console.error('   1) Интернет-соединение');
        console.error('   2) Доступ к Google Таблице');
        console.error('   3) Корректность URL в config.js');
        return false;
    }
}

console.log('✅ Модуль recipes.js готов к работе');
