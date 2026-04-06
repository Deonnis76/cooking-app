// 🚀 Основное приложение

const App = {
    init() {
        console.log('🚀 Приложение запущено');
        this.loadRecipes();
    },
    
    async loadRecipes() {
        console.log('🔄 Загрузка...');
        const success = await loadRecipesFromCloud();
        
        if (!success) {
            console.warn('⚠️ Рецепты не загружены');
        }
    }
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

console.log('✅ Приложение запущено');
