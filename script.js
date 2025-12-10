const SERVERLESS_ENDPOINT = 'YOUR_SERVERLESS_FUNCTION_URL_HERE'; // Lütfen bu URL'yi kendi sunucusuz fonksiyonunuzun URL'siyle değiştirin!

// API Anahtarını saklamak için (Basitlik için tarayıcı belleğini kullanıyoruz)
let currentApiKey = localStorage.getItem('downsubApiKey') || '';

// --- FONKSİYONLAR ---

// API Durumunu Kontrol Etme (Serverless fonksiyonu üzerinden)
async function fetchUsageStatus() {
    const remainingSpan = document.getElementById('remainingCredits');
    const totalSpan = document.getElementById('totalCredits');
    
    if (!currentApiKey) {
        remainingSpan.textContent = 'API Anahtarı Yok';
        totalSpan.textContent = '-';
        return;
    }

    try {
        // Serverless fonksiyona status isteği gönderme
        const response = await fetch(`${SERVERLESS_ENDPOINT}/status`, {
            headers: {
                'Authorization': `Bearer ${currentApiKey}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Downsub API'sinin yanıt yapısına göre bu alanları ayarlayın
            remainingSpan.textContent = data.remaining_credits || 'Bilinmiyor';
            totalSpan.textContent = data.total_credits || 'Bilinmiyor';
        } else {
            throw new Error(`Durum kontrolü başarısız: ${response.status}`);
        }
    } catch (error) {
        console.error('Kullanım durumu çekilemedi:', error);
        remainingSpan.textContent = 'Hata';
        totalSpan.textContent = 'Hata';
    }
}


// --- OLAY DİNLEYİCİLERİ ---

// 1. Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // API Anahtarını arayüze yerleştirme
    const apiKeyInput = document.getElementById('apiKeyInput');
    apiKeyInput.value = currentApiKey;
    
    // Kalan kullanımı hemen yükle
    fetchUsageStatus();

    // 2. Anahtar Kaydetme Butonu
    document.getElementById('saveApiButton').addEventListener('click', () => {
        const newKey = apiKeyInput.value.trim();
        if (newKey) {
            currentApiKey = newKey;
            localStorage.setItem('downsubApiKey', newKey);
            alert('API Anahtarı Kaydedildi!');
            fetchUsageStatus(); // Yeni anahtar ile durumu kontrol et
        } else {
            alert('Lütfen geçerli bir API Anahtarı girin.');
        }
    });

    // 3. İndirme Butonu
    document.getElementById('downloadButton').addEventListener('click', async () => {
        // ... (URL'leri temizleme ve kontrol etme mantığı önceki örnekteki gibi kalır) ...
        // ...
        
        if (!currentApiKey) {
            alert('Lütfen işleme başlamadan önce API Anahtarınızı girin ve kaydedin.');
            statusMessage.classList.add('hidden');
            return;
        }

        // Seçilen formatı al
        const selectedFormat = document.querySelector('input[name="format"]:checked').value;

        // İndirme isteğine format ve API Key'i ekle
        const response = await fetch(SERVERLESS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentApiKey}` // API Anahtarını Serverless'e gönder
            },
            body: JSON.stringify({ 
                urls: urls,
                format: selectedFormat // Yeni eklenen format bilgisi
            })
        });

        // ... (Geri kalan indirme ve hata işleme mantığı önceki örnekteki gibi devam eder) ...
    });
});