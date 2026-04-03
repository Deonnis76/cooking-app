// 🔍 Поиск рецептов (улучшенный)

const Search = {
    find(ingredients, filters) {
        // Разделяем по запятым, пробелам, точкам с запятой
        const userIngredients = ingredients
            .toLowerCase()
            .split(/[,\s;]+/)  // Запятая, пробел, точка с запятой
            .filter(i => i.length >= 2);  // Минимум 2 буквы
        
        const excludeIngredients = (filters.exclude || '')
            .toLowerCase()
            .split(/[,\s;]+/)
            .filter(i => i.length >= 2);
        
        console.log('🔍 Поиск по ингредиентам:', userIngredients);
        console.log('❌ Исключить:', excludeIngredients);
        
        const results = RECIPES.filter(recipe => {
            // Фильтр по времени
            if (recipe.time > filters.maxTime) return false;
            
            // Фильтр по кухне
            if (filters.cuisine !== 'all' && recipe.cuisine !== filters.cuisine) return false;
            
            // Фильтр по типу питания
            if (filters.dietType !== 'all' && recipe.dietType !== filters.dietType) return false;
            
            // Фильтр по категории
            if (filters.forWhom !== 'all' && !recipe.forWhom.includes(filters.forWhom)) return false;
            
            // Проверка на исключаемые ингредиенты
            if (excludeIngredients.length > 0) {
                const hasExcluded = recipe.ingredients.some(ing => 
                    excludeIngredients.some(exc => ing.toLowerCase().includes(exc))
                );
                if (hasExcluded) return false;
            }
            
            // Подсчёт совпадений по ингредиентам
            const matchCount = recipe.ingredients.filter(ing => 
                userIngredients.some(user => 
                    ing.toLowerCase().includes(user) || user.includes(ing.toLowerCase())
                )
            ).length;
            
            const matchPercent = (matchCount / recipe.ingredients.length) * 100;
            return matchPercent >= CONFIG.minMatchPercent;
        }).map(recipe => {
            const has = recipe.ingredients.filter(ing => 
                userIngredients.some(user => 
                    ing.toLowerCase().includes(user) || user.includes(ing.toLowerCase())
                )
            );
            const missing = recipe.ingredients.filter(ing => 
                !userIngredients.some(user => 
                    ing.toLowerCase().includes(user) || user.includes(ing.toLowerCase())
                )
            );
            return { 
                ...recipe, 
                has, 
                missing, 
                matchPercent: (has.length / recipe.ingredients.length) * 100 
            };
        });
        
        results.sort((a, b) => b.matchPercent - a.matchPercent);
        console.log('✅ Найдено рецептов:', results.length);
        return results;
    }
};

console.log('✅ Поиск готов');