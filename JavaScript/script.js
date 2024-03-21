function updateClock() {
  const now = new Date();
  
  const formattedTime = now.toLocaleTimeString([], { hour12: false });
  document.querySelector(".time").textContent = formattedTime;

  const formattedDate = now.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
  document.querySelector(".date").textContent = formattedDate;
}

setInterval(updateClock, 1000);// Uppdatera tiden varje sekund

//Ändra rubriken på headern
const header = document.getElementById("dbHeader");

header.addEventListener("click", () => {
  header.contentEditable = true;
  header.focus();
});

header.addEventListener("blur", () => {
  header.contentEditable = false;
  // Kontrollera om rubriken är tom innan du sparar ändringarna
  if (header.innerText.trim() !== "") {
    localStorage.setItem("headerText", header.innerText);
  } else {
    // Om rubriken är tom, ändras inget och återställs till det som stod innan
    const savedHeaderText = localStorage.getItem("headerText");
    if (savedHeaderText) {
      header.innerText = savedHeaderText;
    }
  }
});

header.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    header.blur();
  }
});

//Snabbnlänkar
const addLinkBtn = document.getElementById('add-link-btn');
const quickLinksList = document.querySelector('.quick-links');
let links = [];

// Ladda länkar från localStorage när sidan laddas
window.addEventListener('load', () => {
  const storedLinks = localStorage.getItem('quickLinks');
  if (storedLinks) {
    links = JSON.parse(storedLinks);
    renderLinks();
  }
});

const renderLinks = () => {
  quickLinksList.innerHTML = '';
  links.forEach(link => {
    const newLink = createLinkElement(link.title, link.url);
    quickLinksList.appendChild(newLink);
  });
};

const createLinkElement = (title, url) => {
const newLink = document.createElement('li');

  // Skapa en bild för favicon
  const faviconImg = document.createElement('img');
  faviconImg.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
  faviconImg.setAttribute('alt', 'Favicon');
  faviconImg.setAttribute('width', '20');
  faviconImg.setAttribute('height', '20');

  // Lägg till länk och favicon i listelementet
  newLink.innerHTML = `
    <a href="${url}" target="_blank">${title}</a>
    <i class="fas fa-minus-circle remove-link"></i>
  `;
  newLink.insertBefore(faviconImg, newLink.firstChild);

  const removeLinkBtn = newLink.querySelector('.remove-link');
  removeLinkBtn.addEventListener('click', () => {
    const index = links.findIndex(item => item.title === title && item.url === url);
    if (index !== -1) {
      links.splice(index, 1);
      localStorage.setItem('quickLinks', JSON.stringify(links));
      renderLinks();
    }
  });
  return newLink;
};

addLinkBtn.addEventListener('click', () => {
  if (links.length >= 5) {
    alert("Det går inte att spara fler än 5 länkar.");
    return; // Avbryt om 5 länkar redan är sparade
  }
  
  // Skapa inputfält för rubrik och URL
  const titleInput = document.createElement('input');
  titleInput.setAttribute('type', 'text');
  titleInput.setAttribute('placeholder', 'Ange rubrik för länken');
  
  const urlInput = document.createElement('input');
  urlInput.setAttribute('type', 'text');
  urlInput.setAttribute('placeholder', 'Ange URL för länken');

  // Skapa en knapp för att lägga till länken
  const addButton = document.createElement('button');
  addButton.textContent = 'Spara länk';

  quickLinksList.appendChild(titleInput);
  quickLinksList.appendChild(urlInput);
  quickLinksList.appendChild(addButton);

  // Lägg till eventlyssnare för att skapa länken när knappen klickas
  addButton.addEventListener('click', () => {
    const title = titleInput.value;
    const url = urlInput.value;

    if (title && url) {
      links.push({ title, url });
      localStorage.setItem('quickLinks', JSON.stringify(links));
      renderLinks();

      // Ta bort inputfälten och knappen efter att länken har lagts till
      quickLinksList.removeChild(titleInput);
      quickLinksList.removeChild(urlInput);
      quickLinksList.removeChild(addButton);
    } else {
      alert('Båda fälten måste fyllas i.');
    }
  });
});

//Vädret
window.addEventListener("load", () => {
  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
          async (position) => {
              try {
                  const { latitude, longitude } = position.coords;
                  const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude.toFixed(6)}/lat/${latitude.toFixed(6)}/data.json`;
                  const response = await fetch(url);
                  const data = await response.json();

                  const weatherIcons = {
                      1: "fa-sun", 2: "fa-sun", 3: "fa-cloud-sun", 4: "fa-cloud-sun", 5: "fa-cloud",
                      6: "fa-cloud", 7: "fa-smog", 8: "fa-cloud-rain", 9: "fa-cloud-rain", 10: "fa-cloud-showers-heavy",
                      11: "fa-cloud-bolt", 12: "fa-cloud-rain", 13: "fa-cloud-rain", 14: "fa-cloud-showers-water",
                      15: "fa-snowflake", 16: "fa-snowflake", 17: "fa-snowflake", 18: "fa-cloud-rain",
                      19: "fa-cloud-showers-water", 20: "fa-cloud-showers-heavy", 21: "fa-cloud-bolt",
                      22: "fa-cloud-rain", 23: "fa-cloud-rain", 24: "fa-cloud-showers-heavy",
                      25: "fa-snowflake", 26: "fa-snowflake", 27: "fa-snowflake"
                  };

                  const weatherVariables = {
                      1: "Klart", 2: "Nästan klart", 3: "Molnigt", 4: "Halvklart", 5: "Molnigt",
                      6: "Mulet", 7: "Dimmigt", 8: "Lätt regn", 9: "Måttligt regn", 10: "Kraftigt regn",
                      11: "Åskväder", 12: "Snöslask", 13: "Snöslask", 14: "Snöslask", 15: "Lätt snöfall",
                      16: "Måttlig snöfall", 17: "Kraftig snöfall", 18: "Lätt regn", 19: "Måttligt regn",
                      20: "Kraftigt regn", 21: "Åska", 22: "Snöslask", 23: "Snöslask", 24: "Snöslask",
                      25: "Lätt snöfall", 26: "Måttligt snöfall", 27: "Kraftigt snöfall"
                  };

                  const getWeatherInfo = (index) => {
                      const weather = data.timeSeries[index].parameters.find(param => param.name === "Wsymb2").values[0];
                      const temperature = data.timeSeries[index].parameters.find(param => param.name === "t").values[0] + "°C";
                      const weatherIcon = weatherIcons[weather];
                      const weatherText = weatherVariables[weather];
                      return { temperature, weatherIcon, weatherText };
                  };

                  const displayWeather = (index, containerId, iconId, textId) => {
                      const { temperature, weatherIcon, weatherText } = getWeatherInfo(index);
                      document.getElementById(containerId).innerHTML = `${temperature}`;
                      document.getElementById(iconId).classList.add("fas", weatherIcon);
                      document.getElementById(textId).innerHTML = `${weatherText}`;
                  };

                  displayWeather(0, "temperature-current", "weather-icon-current", "weather-current");
                  displayWeather(23, "temperature-tomorrow", "weather-icon-tomorrow", "weather-tomorrow");
                  displayWeather(47, "temperature-dayafter", "weather-icon-dayafter", "weather-dayafter");
                  displayWeather(59, "temperature-3days", "weather-icon-3days", "weather-3days");

                  const day = new Date();
                  const dayAfterTomorrow = new Date(day);
                  dayAfterTomorrow.setDate(day.getDate() + 2);

                  const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
                  const weekday = weekdays[dayAfterTomorrow.getDay()];
                  const nextDayIndex = (dayAfterTomorrow.getDay() + 1) % 7;
                  const weekday2 = weekdays[nextDayIndex];

                  document.getElementById("day-after-tomorrow").textContent = weekday;
                  document.getElementById("day-3days").textContent = weekday2;
                  
              } catch (error) {
                  console.error("Error fetching weather data:", error);
              }
          },
          (error) => {
              console.error("Geolocation error:", error);
          }
      );
  } else {
      console.error("Geolocation is not supported by your browser.");
  }
});

//SPORT API
fetch('https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2023-2024')
            .then(response => response.json())
            .then(data => {
                // Skapa HTML för tabellen
                let tableHTML = '<table border="1"><tr><th>Position</th><th>Lag</th><th>Spelade matcher</th><th>Poäng</th></tr>';
                
                // Loopa igenom datan och lägg till varje rad i tabellen
                data.table.forEach(team => {
                    tableHTML += `<tr>
                        <td>${team.intRank}</td>
                        <td>${team.strTeam}</td>
                        <td>${team.intPlayed}</td>
                        <td>${team.intPoints}</td>
                    </tr>`;
                });
                
                tableHTML += '</table>';

                // Lägg till tabellen i HTML-dokumentet
                document.getElementById('myAPI').innerHTML = tableHTML;
            })
            .catch(error => console.log('Det uppstod ett fel:', error));


//Genererar random bakgrundsbild.
function setRandomBackground() {
  fetch("https://api.unsplash.com/photos/random?client_id=cpKOFdn1hyrqMDJK0dg8hlB_rOlyUcIRiUyjc9DCgLE")
    .then((response) => response.json())
    .then((data) => {
      const imageUrl = data.urls.regular;
      document.body.style.backgroundImage = `url(${imageUrl})`;
    })
    .catch((error) => console.error("Error fetching random image:", error));
}

const button = document.getElementById("randomBackground");
button.addEventListener("click", setRandomBackground);


//Spara texten i localStorage
let textArea = document.getElementById('textArea')
let savedText = localStorage.getItem('savedText')

if(savedText){
  textArea.value = savedText;
}
textArea.addEventListener('input', function(){
  localStorage.setItem('savedText', textArea.value)
});