document.addEventListener("DOMContentLoaded", () => {
    const popupContainer = document.querySelector(".popup-container");
    const tableContainer = document.getElementById("tableContainer");
    const seatsDropdown = document.getElementById("seats");
    const tableTypeDropdown = document.getElementById("table_type");
  
    popupContainer.onclick = function (event) {
      if (event.target == popupContainer) {
        window.location.href = "#";
      }
    };
  
    // Function to create a new table card
    function createTableCard(table) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-id", table.id); 
      card.innerHTML = `
        <div class="card_title">
          <h1>${table.name}</h1>
        </div>
        <div class="card_body">
          <p>Type: ${table.type}</p>
          <p>Seats: ${table.seats}</p>
          <div class="flex">
            <button class="view-button" onclick="viewTable('${table.id}')">View</button>
            <button class="delete-button" onclick="confirmDelete('${table.id}')">Delete</button>
          </div>
        </div>
      `;
      tableContainer.appendChild(card);
    }
  
    // Function to load tables from localStorage
    function loadTables() {
      const tables = JSON.parse(localStorage.getItem("tables")) || [];
      tables.forEach(table => createTableCard(table));
    }
  
    // Load tables on page load
    loadTables();
  
    // Function to generate a unique ID
    function generateId() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  
    // Function to add a new table
    window.addTable = function () {
      const tableName = document.getElementById("table_name").value;
      const tableType = document.getElementById("table_type").value;
      const seats = document.getElementById("seats").value;
  
      if (!tableName || !tableType || !seats) {
        document.getElementById("errorMessage").textContent = "All fields are required.";
        return false;
      }
  
      const newTable = {
        id: generateId(),
        name: tableName,
        type: tableType,
        seats: seats
      };
  
      // Save to localStorage
      let tables = JSON.parse(localStorage.getItem("tables")) || [];
      tables.push(newTable);
      localStorage.setItem("tables", JSON.stringify(tables));
  
      // Create table card
      createTableCard(newTable);
  
      // Clear form and close popup
      document.getElementById("addTables").reset();
      window.location.href = "#";
  
      return false; 
    };
  
    // Function to confirm deletion
    window.confirmDelete = function (id) {
      const confirmed = confirm("Are you sure you want to delete this table?");
      if (confirmed) {
        deleteTable(id);
      }
    };
  
    // Function to delete a table
    window.deleteTable = function (id) {
      let tables = JSON.parse(localStorage.getItem("tables")) || [];
      tables = tables.filter(table => table.id !== id);
      localStorage.setItem("tables", JSON.stringify(tables));
  
      const card = document.querySelector(`.card[data-id='${id}']`);
      if (card) {
        card.remove();
      }
    };
  
    // Function to update table type options based on seats selected
    function updateTableTypeOptions() {
      const seats = seatsDropdown.value;
      tableTypeDropdown.innerHTML = '<option value="" selected disabled>Select any one option</option>';
  
      if (seats >= 1 && seats <= 4) {
        tableTypeDropdown.innerHTML += `
          <option value="Square">Square</option>
          <option value="Circle">Circle</option>
          <option value="Rectangle">Rectangle</option>
        `;
      } else if (seats == 5 || seats == 6) {
        tableTypeDropdown.innerHTML += `
          <option value="Circle">Circle</option>
          <option value="Rectangle">Rectangle</option>
        `;
      } else if (seats >= 7 && seats <= 12) {
        tableTypeDropdown.innerHTML += `<option value="Rectangle">Rectangle</option>`;
      }
    }
  
    // Attach event listener to seats dropdown
    seatsDropdown.addEventListener("change", updateTableTypeOptions);

    window.viewTable = function (id) {
        window.location.href = `table_view.html?tableId=${id}`;
    };
  });
  