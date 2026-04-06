// 🎤 Голосовой ввод

const VoiceInput = {
    init() {
        const voiceBtn = document.getElementById('voiceBtn');
        const ingredientsInput = document.getElementById('ingredientsInput');
        
        if (!voiceBtn || !ingredientsInput) {
            console.log('⚠️ Элементы голосового ввода не найдены');
            return;
        }
        
        // Проверяем поддержку
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            voiceBtn.disabled = true;
            voiceBtn.textContent = '🎤 Голосовой ввод не поддерживается';
            console.log('⚠️ Голосовой ввод не поддерживается браузером');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'ru-RU';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        voiceBtn.addEventListener('click', () => {
            console.log('🎤 Запуск голосового ввода...');
            try {
                recognition.start();
                voiceBtn.textContent = '🎤 Слушаю...';
                voiceBtn.disabled = true;
            } catch (e) {
                console.error('❌ Ошибка запуска:', e);
                voiceBtn.textContent = '🎤 Голосовой ввод';
                voiceBtn.disabled = false;
            }
        });
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('🎤 Распознано:', transcript);
            
            if (ingredientsInput) {
                const currentValue = ingredientsInput.value;
                if (currentValue) {
                    ingredientsInput.value = currentValue + ', ' + transcript;
                } else {
                    ingredientsInput.value = transcript;
                }
            }
            
            voiceBtn.textContent = '🎤 Голосовой ввод';
            voiceBtn.disabled = false;
        };
        
        recognition.onerror = (event) => {
            console.error('❌ Ошибка голосового ввода:', event.error);
            voiceBtn.textContent = '🎤 Голосовой ввод';
            voiceBtn.disabled = false;
        };
        
        recognition.onend = () => {
            console.log('🎤 Запись завершена');
            voiceBtn.textContent = '🎤 Голосовой ввод';
            voiceBtn.disabled = false;
        };
        
        console.log('✅ Голосовой ввод готов');
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    VoiceInput.init();
});

console.log('✅ Модуль voice.js загружен');
