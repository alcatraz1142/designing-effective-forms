let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
const codeInput = document.getElementById('countryCode'); // Zdefiniowane globalnie

// Funkcja obsługi kliknięć
function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

// Funkcja do pobrania i uzupełnienia listy krajów
async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
        console.log("Lista krajów załadowana do formularza");
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
        console.log("Lista krajów załadowana do formularza");
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

// Funkcja wykrywania kraju na podstawie IP
function getCountryByIP() {
    console.log('Pobieranie danych o kraju z serwera GeoJS...');
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych o kraju');
        }
        return response.json();
      })
      .then(data => {
        const country = data.country;
        console.log('Wykryty kraj:', country);

        // Czekamy, aż lista krajów się załaduje (odczekaj chwilę przed ustawieniem kraju)
        setTimeout(() => {
            // Szukamy opcji w select, która ma wartość odpowiadającą nazwie kraju
            const option = Array.from(countryInput.options).find(option => option.text.toLowerCase() === country.toLowerCase());

            if (option) {
                console.log(`Znaleziono opcję dla kraju: ${country}`);
                // Ustawiamy wartość na wykryty kraj
                countryInput.value = option.value; // Ustawiamy odpowiednią wartość
            } else {
                console.log(`Kraj ${country} nie jest w liście, dodaję nową opcję...`);
                const newOption = document.createElement('option');
                newOption.value = country;
                newOption.textContent = country;
                countryInput.appendChild(newOption);
                countryInput.value = country;
            }
            // Wymuszamy aktualizację formularza po ustawieniu wartości
            countryInput.dispatchEvent(new Event('change')); // Wydarzenie zmiany
        }, 100); // Opóźnienie 100 ms, aby upewnić się, że DOM został zaktualizowany
        getCountryCode(country);
      })
      .catch(error => {
        console.error('Błąd pobierania danych z serwera GeoJS:', error);
      });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAndFillCountries().then(() => {
        getCountryByIP();  // Po załadowaniu krajów, wykryj kraj
    });
});
    
// Funkcja pobierania numeru kierunkowego dla wykrytego kraju
function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Błąd pobierania danych');
        }
        return response.json();
      })
      .then(data => {
        const countryCode = data[0].idd.root + data[0].idd.suffixes[0];
        console.log("Wykryty numer kierunkowy: ", countryCode);

        // Wstawiamy do inputa numer kierunkowy
        if (codeInput) {
          // Wstawiamy numer kierunkowy do formularza
          const option = Array.from(codeInput.options).find(option => option.value === countryCode);
          if (option) {
            codeInput.value = countryCode;
            console.log(`Ustawiono numer kierunkowy: ${countryCode}`);
          } else {
            // Jeżeli nie ma odpowiedniej opcji, dodajemy ją dynamicznie
            const newOption = document.createElement('option');
            newOption.value = countryCode;
            newOption.textContent = `${countryCode} (auto wykryty)`;
            codeInput.appendChild(newOption);
            codeInput.value = countryCode;
            console.log(`Dodano nową opcję numeru kierunkowego: ${countryCode}`);
          }
        }
      })
      .catch(error => {
        console.error('Wystąpił błąd:', error);
      });
}

// Dodanie zdarzenia dla VAT
document.addEventListener('DOMContentLoaded', () => {
    const vatCheckbox = document.getElementById('vatUE');
    const vatFields = document.getElementById('vatFields');

    vatCheckbox.addEventListener('change', () => {
        if (vatCheckbox.checked) {
            vatFields.style.display = 'block';
        } else {
            vatFields.style.display = 'none';
        }
    });
});

// Obsługa klawisza Enter w formularzu
document.getElementById('form').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        const form = event.target.form || document.getElementById('form');

        // Tworzymy sztuczne zdarzenie submit, które uruchomi walidację
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
    }
});

// Obsługa innych skrótów klawiaturowych
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault(); 
        alert("Formularz zapisany!");
    }

    if (event.altKey && event.key === 'f') {
        event.preventDefault(); 
        document.getElementById('firstName').focus(); 
    }

    if (event.ctrlKey && event.key === 'p') {
        event.preventDefault(); 
        document.getElementById('form').reset(); 
    }
});

// Obsługa walidacji formularza
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const form = event.target;
    if (!form.checkValidity()) {
      event.stopPropagation();
    } else {
      alert("Formularz poprawnie wypełniony!");

    }
  
    form.classList.add('was-validated');
});

document.getElementById('form').addEventListener('reset', function () {
    // Po zresetowaniu formularza, wykryj ponownie kraj i numer kierunkowy
    setTimeout(() => {
        getCountryByIP();
    }, 100); // Dajemy krótkie opóźnienie, żeby formularz zdążył się wyczyścić
});