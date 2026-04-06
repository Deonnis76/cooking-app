// 🎤 Голосовой ввод

document.addEventListener('DOMContentLoaded', function() {
    const voiceBtn = document.getElementById('voiceBtn');
    const input = document.getElementById('ingredientsInput');
    
    if (!voiceBtn || !input) {
        console.log('⚠️ Элементы не найдены');
        return;
    }
    
    // Проверяем поддержку
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceBtn.disabled = true;
        voiceBtn.textContent = '🎤 Не поддерживается';
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceBtn.addEventListener('click', function() {
        console.log('🎤 Старт...');
        try {
            recognition.start();
            voiceBtn.textContent = '🎤 Слушаю...';
        } catch (e) {
            console.error('Ошибка:', e);
            voiceBtn.textContent = '🎤 Голосовой ввод';
        }
    });
    
    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        console.log('🎤 Распознано:', text);
        
        if (input.value) {
            input.value += ', ' + text;
        } else {
            input.value = text;
        }
        
        voiceBtn.textContent = '🎤 Голосовой ввод';
    };
    
    recognition.onerror = function(event) {
        console.error('❌ Ошибка:', event.error);
        voiceBtn.textContent = '🎤 Голосовой ввод';
    };
    
    recognition.onend = function() {
        voiceBtn.textContent = '🎤 Голосовой ввод';
    };
    
    console.log('✅ Голосовой ввод готов');
});

console.log('✅ Модуль voice.js загружен');
