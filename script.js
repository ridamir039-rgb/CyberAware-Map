window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  setTimeout(() => loader.style.display = "none", 800);
});

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2.2,
    center: { lat: 20, lng: 0 },
  });

  fetch("enhanced_data.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(attack => {
        // Existing Marker and InfoWindow logic
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(attack.latitude),
            lng: parseFloat(attack.longitude)
          },
          map,
          title: attack.attack_type
        });

        const content = `
          <div class="card">
            <h3>${attack.attack_type}</h3>
            <p><strong>Date:</strong> ${attack.date}</p>
            <p><strong>Time:</strong> ${attack.time}</p>
            <p><strong>Definition:</strong><br>${attack.definition}</p>
            <p><strong>Prevention:</strong><br>${attack.security}</p>
          </div>
        `;

        const infoWindow = new google.maps.InfoWindow({ content });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        //Create and display dynamic playcard 
        createPlaycard(attack);
      });
    })
    .catch(err => {
      console.error("Error loading data.json", err);
      alert("Failed to load cyberattack data.");
    });
}
function createPlaycard(attack) {
  const container = document.getElementById("card-container");

  if (!container) return; // Prevent error if #card-container not in HTML

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="card-header">
      <img src="${attack.attack_icon}" alt="${attack.attack_type} Icon" class="icon">
      <img src="https://flagcdn.com/${attack.country_code}.svg" alt="${attack.country_code} flag" class="flag">
    </div>
    <h2>${attack.attack_type}</h2>
    <p class="description">${attack.definition}</p>
    <button class="btn">Prevention Tips</button>
  `;
  container.appendChild(card);
}

