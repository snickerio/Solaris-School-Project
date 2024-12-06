// Bas-URL för API:et och API-nyckel för autentisering
const API_BASE_URL = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
const API_KEY = 'solaris-2ngXkR6S02ijFrTP'; // Använd den tillhandahållna nyckeln

// Hämtar data om alla planeter från API:et
async function fetchPlanets() {
    try {
        const response = await fetch(`${API_BASE_URL}/bodies`, {
            method: 'GET',
            headers: { 'x-zocom': API_KEY },
        });

        if (!response.ok) {
            throw new Error(`HTTP-fel! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.bodies || data.bodies.length === 0) {
            throw new Error('Inga planeter hittades.');
        }
        return data.bodies;
    } catch (error) {
        console.error('Fel vid hämtning av API:', error);
        alert("Något gick fel vid hämtningen av planetdata. Försök igen senare.");
    }
}

async function init() {
    const planets = await fetchPlanets(); // Hämta planetdata

    if (planets) {
        console.log('Hämtade planeter:', planets);
        renderPlanets(planets); // Rendera planeter på sidan
        handleSearch(planets); // Aktivera sökfunktionen här
    } else {
        console.error('Inga planeter kunde hämtas.');
    }
}

// Starta applikationen
init();

// Bestämmer planetens färg och storlek beroende på dess namn
function getPlanetStyles(planet) {
    let color = '#FFD700'; // Standard färg (guld)
    let size = 100; // Standardstorlek

    // Anpassa färg och storlek beroende på planetens namn (svenska)
    switch (planet.name.toLowerCase()) {
        case 'solen':
            color = '#FFCC00'; // Gul färg för solen
            size = 300; // Större storlek för solen
            break;
        case 'merkurius':
            color = '#B4B4B4'; // Grå färg för Merkurius
            size = 80; // Mindre än jorden
            break;
        case 'venus':
            color = '#D37F29'; // Gul-orange färg för Venus
            size = 120; // Lite mindre än jorden
            break;
        case 'jorden':
            color = '#0A74DA'; // Blå färg för jorden
            size = 200; // Större för jorden
            break;
        case 'mars':
            color = '#D84E5C'; // Röd färg för Mars
            size = 150; // Lite mindre än jorden
            break;
        case 'jupiter':
            color = '#F4A300'; // Färgen för Jupiter
            size = 250; // Mycket större än jorden
            break;
        case 'saturnus':
            color = '#E1C16B'; // Guldgul för Saturnus
            size = 230; // Större än jorden men mindre än Jupiter
            break;
        case 'uranus':
            color = '#70C7E6'; // Ljusblå för Uranus
            size = 220; // Större än jorden
            break;
        case 'neptunus':
            color = '#1F5F7B'; // Mörkblå för Neptunus
            size = 210; // Större än jorden
            break;
        case 'pluto':
            color = '#B0B0B0'; // Ljusgrå för Pluto (om du vill inkludera den)
            size = 50; // Mycket mindre än de andra planeterna
            break;
        default:
            break;
    }

    return { color, size };
}

// Renderar planetkort på sidan baserat på hämtad data
function renderPlanets(planets) {
    const solarSystem = document.getElementById('solar-system');
    solarSystem.innerHTML = ''; // Rensa tidigare renderade planeter

    planets.forEach((planet) => {
        // Få färg och storlek för planeten
        const { color, size } = getPlanetStyles(planet);

        // Skapa kort för varje planet
        const planetCard = document.createElement('div');
        planetCard.classList.add('planet-card');
        planetCard.style.backgroundColor = color; // Dynamisk bakgrundsfärg
        planetCard.style.width = `${size}px`; // Dynamisk storlek
        planetCard.style.height = `${size}px`; // Dynamisk storlek

        planetCard.innerHTML = `
            <h3>${planet.name}</h3>
            <p class="hidden">${planet.type}</p>
        `;
        planetCard.addEventListener('click', () => displayPlanetInfo(planet)); // Klicka på planeten för att visa info
        solarSystem.appendChild(planetCard);
    });
}

function displayPlanetInfo(planet) {
    console.log(planet);  // Skriv ut planetens information
    const planetInfo = document.getElementById('planet-info');
    document.getElementById('planet-name').textContent = planet.name;
    document.getElementById('planet-description').textContent = planet.desc || "Ingen beskrivning tillgänglig";
    document.getElementById('planet-rotation').textContent = planet.rotation || "Ej tillgänglig";
    document.getElementById('planet-distance').textContent = planet.distance ? planet.distance.toLocaleString() : "Ej tillgänglig";
    document.getElementById('planet-moons').textContent = planet.moons && planet.moons.length > 0 ? planet.moons.join(', ') : 'Inga månar';
    planetInfo.style.display = 'block'; // Visa planetinformationen
}

// Funktion för att filtrera planeter baserat på söktext
function filterPlanets(planets, searchText) {
    return planets.filter((planet) =>
        planet.name.toLowerCase().includes(searchText.toLowerCase())
    );
}

// Hanterar användarens input i sökrutan och filtrerar planeter baserat på text
function handleSearch(planets) {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const filteredPlanets = filterPlanets(planets, searchInput.value);
        renderPlanets(filteredPlanets); // Rendera de filtrerade planeterna

        if (filteredPlanets.length === 0) {
            alert("Inga planeter matchar din sökning."); // Meddelande om inga träffar
        }
    });
}
