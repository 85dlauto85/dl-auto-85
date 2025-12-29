// ==================== ОБЩИЕ ФУНКЦИИ ДЛЯ ВСЕХ СТРАНИЦ ====================

// Предзагрузка изображений для галереи
function preloadImages() {
  cars.forEach(car => {
    car.photos.forEach(photo => {
      const img = new Image();
      img.src = photo;
    });
  });
}

// Форматирование цены с пробелами
function formatPrice(price) {
  return price.toLocaleString('fr-FR');
}

// Получение всех марок для фильтров
function getAllMakes() {
  return [...new Set(cars.map(car => car.make))].sort();
}

// ==================== INDEX.HTML ====================
function renderLastCars() {
  const container = document.getElementById('lastCars');
  if (!container) return;
  
  const lastCars = cars.slice(-3);
  container.innerHTML = lastCars.map(car => `
    <div class="bg-black rounded-lg shadow-lg hover:shadow-yellow-500/25 transition border border-jaune">
      <img src="${car.photos[0]}" 
           class="w-full h-48 object-cover rounded-t-lg border-b border-jaune"
           onerror="this.src='https://via.placeholder.com/400x300?text=Photo+indisponible'">
      <div class="p-4">
        <h3 class="font-bold text-xl text-argent mb-2">${car.make} ${car.model}</h3>
        <p class="text-gray-400">${car.year} • ${formatPrice(car.mileage)} km</p>
        <p class="text-2xl font-bold text-jaune mt-2">${formatPrice(car.price)} €</p>
        <p class="text-sm text-gray-500">📍 ${car.city}</p>
        <a href="car.html?id=${car.id}" class="block mt-4 bg-jaune text-black text-center py-2 rounded-lg font-bold hover:bg-yellow-500 transition">
          Détails →
        </a>
      </div>
    </div>
  `).join('');
}

function quickSearch() {
  const query = document.getElementById('mainSearch')?.value?.trim();
  if (query) {
    window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
  } else {
    window.location.href = 'catalog.html';
  }
}

function filterByBrand(brand) {
  window.location.href = `catalog.html?make=${encodeURIComponent(brand)}`;
}

// Обработка Enter в поиске
function setupSearchEnter() {
  const searchInput = document.getElementById('mainSearch');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        quickSearch();
      }
    });
  }
}

// ==================== CATALOG.HTML ====================
let filteredCars = [...cars];

function renderFilters() {
  const select = document.getElementById('filterMake');
  if (!select) return;
  
  const makes = getAllMakes();
  select.innerHTML = '<option value="">Toutes les marques</option>' + 
    makes.map(make => `<option value="${make}">${make}</option>`).join('');
}

function getCurrentFilters() {
  return {
    make: document.getElementById('filterMake')?.value || '',
    priceFrom: document.getElementById('priceFrom')?.value || '',
    priceTo: document.getElementById('priceTo')?.value || '',
    yearFrom: document.getElementById('yearFrom')?.value || '',
    yearTo: document.getElementById('yearTo')?.value || '',
    search: new URLSearchParams(window.location.search).get('search') || ''
  };
}

function applyFilters() {
  const filters = getCurrentFilters();
  
  filteredCars = cars.filter(car => {
    // Поисковый запрос (если есть)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = car.make.toLowerCase().includes(searchLower) ||
                          car.model.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Фильтр по марке
    if (filters.make && car.make !== filters.make) return false;
    
    // Фильтр по цене
    if (filters.priceFrom && car.price < +filters.priceFrom) return false;
    if (filters.priceTo && car.price > +filters.priceTo) return false;
    
    // Фильтр по году
    if (filters.yearFrom && car.year < +filters.yearFrom) return false;
    if (filters.yearTo && car.year > +filters.yearTo) return false;
    
    return true;
  });
  
  renderCars();
  updateURL(filters);
}

function updateURL(filters) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.make) params.set('make', filters.make);
  if (filters.priceFrom) params.set('priceFrom', filters.priceFrom);
  if (filters.priceTo) params.set('priceTo', filters.priceTo);
  if (filters.yearFrom) params.set('yearFrom', filters.yearFrom);
  if (filters.yearTo) params.set('yearTo', filters.yearTo);
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

function resetFilters() {
  // Сброс всех полей
  ['filterMake', 'priceFrom', 'priceTo', 'yearFrom', 'yearTo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  
  // Очистка URL
  window.history.replaceState({}, '', window.location.pathname);
  
  filteredCars = [...cars];
  renderCars();
}

function renderCars() {
  const grid = document.getElementById('carsGrid');
  const count = document.getElementById('resultsCount');
  const noResults = document.getElementById('noResults');
  
  if (!grid || !count || !noResults) return;
  
  if (filteredCars.length === 0) {
    grid.style.display = 'none';
    noResults.classList.remove('hidden');
  } else {
    grid.style.display = 'grid';
    noResults.classList.add('hidden');
    grid.innerHTML = filteredCars.map(car => `
      <div class="bg-black rounded-lg shadow-lg hover:shadow-yellow-500/25 transition border border-jaune">
        <img src="${car.photos[0]}" 
             class="w-full h-48 object-cover rounded-t-lg border-b border-jaune"
             onerror="this.src='https://via.placeholder.com/400x300?text=Photo+indisponible'">
        <div class="p-4">
          <h3 class="font-bold text-xl text-argent mb-2">${car.make} ${car.model}</h3>
          <p class="text-gray-400">${car.year} • ${formatPrice(car.mileage)} km</p>
          <p class="text-2xl font-bold text-jaune mt-2">${formatPrice(car.price)} €</p>
          <p class="text-sm text-gray-500">📍 ${car.city}</p>
          <a href="car.html?id=${car.id}" class="block mt-4 bg-jaune text-black text-center py-2 rounded-lg font-bold hover:bg-yellow-500 transition">
            Détails →
          </a>
        </div>
      </div>
    `).join('');
  }
  
  count.textContent = `Trouvé: ${filteredCars.length} véhicule(s)`;
}

function checkURLParams() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search');
  const make = params.get('make');
  const priceFrom = params.get('priceFrom');
  const priceTo = params.get('priceTo');
  const yearFrom = params.get('yearFrom');
  const yearTo = params.get('yearTo');
  
  // Автозаполнение полей из URL
  if (make) document.getElementById('filterMake').value = make;
  if (priceFrom) document.getElementById('priceFrom').value = priceFrom;
  if (priceTo) document.getElementById('priceTo').value = priceTo;
  if (yearFrom) document.getElementById('yearFrom').value = yearFrom;
  if (yearTo) document.getElementById('yearTo').value = yearTo;
  
  // Применение фильтров
  if (search || make || priceFrom || priceTo || yearFrom || yearTo) {
    applyFilters();
  } else {
    renderCars();
  }
}

// ==================== CAR.HTML ====================
let currentPhotoIndex = 0;
let currentPhotos = [];

function renderCar() {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get('id');
  const car = cars.find(c => c.id === carId);
  
  const container = document.getElementById('carDetail');
  if (!container) return;
  
  if (!car) {
    container.innerHTML = `
      <div class="text-center py-20">
        <div class="text-6xl mb-4">😔</div>
        <h2 class="text-3xl font-bold mb-4">Véhicule non trouvé</h2>
        <a href="catalog.html" class="bg-jaune text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition">Retour au catalogue</a>
      </div>
    `;
    return;
  }
  
  currentPhotos = car.photos;
  
  container.innerHTML = `

    <!-- Галерея -->
    <div class="bg-black rounded-lg shadow-lg mb-8 border border-jaune">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4" id="gallery">
        ${car.photos.map((photo, index) => `
          <img src="${photo}" 
               class="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition border border-jaune" 
               onclick="openGallery(${index})"
               onerror="this.src='https://via.placeholder.com/400x300?text=Photo+indisponible'">
        `).join('')}
      </div>
    </div>

    <!-- Информация -->
    <div class="bg-black rounded-lg shadow-lg p-6 mb-8 border border-jaune">
      <div class="flex justify-between items-start mb-6">
        <h1 class="text-4xl font-bold text-argent">${car.make} ${car.model}</h1>
        <span class="bg-jaune text-black px-3 py-1 rounded-full font-bold">${car.year}</span>
      </div>
      
      <div class="text-4xl font-bold text-jaune mb-6">${formatPrice(car.price)} €</div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 class="text-xl font-bold mb-4 text-argent">📝 Caractéristiques</h3>
          <table class="w-full text-gray-300">
            <tr class="border-b border-gray-700">
              <td class="py-2 font-medium">Moteur:</td>
              <td class="py-2">${car.engine}</td>
            </tr>
            <tr class="border-b border-gray-700">
              <td class="py-2 font-medium">Transmission:</td>
              <td class="py-2">${car.transmission}</td>
            </tr>
            <tr class="border-b border-gray-700">
              <td class="py-2 font-medium">Carrosserie:</td>
              <td class="py-2">${car.body}</td>
            </tr>
            <tr class="border-b border-gray-700">
              <td class="py-2 font-medium">Couleur:</td>
              <td class="py-2">${car.color}</td>
            </tr>
            <tr class="border-b border-gray-700">
              <td class="py-2 font-medium">Kilométrage:</td>
              <td class="py-2">${formatPrice(car.mileage)} km</td>
            </tr>
            <tr>
              <td class="py-2 font-medium">Localisation:</td>
              <td class="py-2">📍 ${car.city}</td>
            </tr>
          </table>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4 text-argent">ℹ️ Description</h3>
          <p class="text-gray-300 leading-relaxed">${car.description}</p>
        </div>
      </div>
    </div>

    <!-- Контакты -->
    <div class="bg-black rounded-lg shadow-lg p-6 border border-jaune">
      <h3 class="text-2xl font-bold mb-4 text-jaune">📞 Contactez-nous</h3>
      <div class="flex flex-col sm:flex-row gap-4">
        <a href="tel:${car.contactPhone}" class="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold text-center hover:bg-green-700 transition">
          📱 Appeler
        </a>
        <a href="https://wa.me/${car.contactWhatsApp}?text=Bonjour,%20je%20suis%20intéressé%20par%20${encodeURIComponent(car.make + ' ' + car.model)}" 
           target="_blank" 
           class="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold text-center hover:bg-green-600 transition">
           💬 WhatsApp
        </a>
      </div>
      <p class="text-center text-gray-400 mt-4 text-sm">${car.contactPhone}</p>
    </div>
  `;

  // ========== Schema.org для машины ==========
  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${car.make} ${car.model} ${car.year}`,
    "brand": {
      "@type": "Brand",
      "name": car.make
    },
    "model": car.model,
    "vehicleModelDate": car.year,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": car.mileage,
      "unitCode": "KMT"
    },
    "offers": {
      "@type": "Offer",
      "price": car.price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "AutoDealer",
        "name": "D.L AUTO 85",
        "telephone": car.contactPhone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "168 Rte de Niort",
          "addressLocality": "Saint-Martin-de-Fraigneau",
          "postalCode": "85200",
          "addressCountry": "FR"
        }
      }
    },
    "description": car.description,
    "image": car.photos
  });
  document.head.appendChild(schemaScript);
}

// Лайтбокс галереи
function openGallery(index) {
  currentPhotoIndex = index;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  
  if (!lightbox || !img) return;
  
  img.src = currentPhotos[currentPhotoIndex];
  lightbox.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Блокировка прокрутки
}

function closeGallery() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto'; // Возвращаем прокрутку
}

function changePhoto(direction) {
  event.stopPropagation(); // Останавливаем всплытие, чтобы не закрыть лайтбокс
  
  currentPhotoIndex += direction;
  
  if (currentPhotoIndex < 0) {
    currentPhotoIndex = currentPhotos.length - 1;
  } else if (currentPhotoIndex >= currentPhotos.length) {
    currentPhotoIndex = 0;
  }
  
  const img = document.getElementById('lightbox-img');
  if (img) {
    img.src = currentPhotos[currentPhotoIndex];
  }
}

// Закрытие лайтбокса по Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeGallery();
  }
});

// ==================== ИНИЦИАЛИЗАЦИЯ СТРАНИЦ ====================
// Эта функция вызывается автоматически при загрузке каждой страницы
function initializePage() {
  // Предзагрузка изображений
  preloadImages();
  
  // Определяем текущую страницу по URL
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  
  switch(page) {
    case 'index.html':
    case '':
      renderLastCars();
      setupSearchEnter();
      break;
      
    case 'catalog.html':
      renderFilters();
      checkURLParams();
      break;
      
    case 'car.html':
      renderCar();
      break;
  }
}

// Запускаем инициализацию при загрузке страницы
window.addEventListener('DOMContentLoaded', initializePage);