document.addEventListener("DOMContentLoaded", () => {
  const tableDetails = document.getElementById("tableDetails");
  const tableShapeContainer = document.getElementById("tableShapeContainer");

  function getTableById(id) {
      const tables = JSON.parse(localStorage.getItem("tables")) || [];
      return tables.find(table => table.id === id);
  }

  function getParameterByName(name) {
      const url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  const tableId = getParameterByName("tableId");
  const table = getTableById(tableId);

  if (table) {
      tableDetails.innerHTML = `
          <h2>${table.name}</h2>
          <p>Type: ${table.type}</p>
          <p>Seats: ${table.seats}</p>
      `;

      let tableShapeHTML = '';

      const seatElements = Array.from({ length: table.seats }, (_, i) => `<div class="seat">${i + 1}</div>`).join('');

      if (table.type === "Rectangle") {
          tableShapeHTML = `
              <div class="table-rectangle">
                  ${seatElements}
              </div>
          `;
      } else if (table.type === "Circle") {
          tableShapeHTML = `
              <div class="table-circle">
                  ${seatElements}
              </div>
          `;
      } else if (table.type === "Square") {
          tableShapeHTML = `
              <div class="table-square">
                  ${seatElements}
              </div>
          `;
      }

      tableShapeContainer.innerHTML = tableShapeHTML;
      arrangeSeats(table.type, table.seats);
  } else {
      tableDetails.innerHTML = `<p>Table not found</p>`;
  }

  function arrangeSeats(type, seats) {
      const seatElements = document.querySelectorAll('.seat');

      if (type === 'Circle' || type === 'Square') {
          const angleStep = 360 / seats;
          const radius = 120; // Adjust

          seatElements.forEach((seat, index) => {
              const angle = angleStep * index;
              const x = radius * Math.cos(angle * (Math.PI / 180));
              const y = radius * Math.sin(angle * (Math.PI / 180));
              seat.style.transform = `translate(${x}px, ${y}px)`;
          });
      } else if (type === 'Rectangle') {
          const width = 500; // Adjust 
          const height = 150; // Adjust 
          const perSide = Math.ceil(seats / 2);

          for (let i = 0; i < seats; i++) {
              let x = 0, y = 0;

              if (i < perSide) {
                  x = (i + 1) * (width / (perSide + 1));
                  y = 0;
              } else {
                  x = (i - perSide + 1) * (width / (perSide + 1));
                  y = height;
              }

              seatElements[i].style.transform = `translate(${x - width / 2}px, ${y - height / 2}px)`;
          }
      }
  }
});
