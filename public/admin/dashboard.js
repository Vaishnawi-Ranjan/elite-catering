// ======================
// Load All Bookings
// ======================
async function loadBookings() {

    const res = await fetch("/bookings");
    const bookings = await res.json();

    document.getElementById("totalBookings").innerHTML = bookings.length;

    const table = document.getElementById("bookingTable");

    table.innerHTML = "";

    bookings.forEach((b) => {

        table.innerHTML += `

        <tr>

            <td>${b.id}</td>

            <td>${b.full_name}</td>

            <td>${b.phone}</td>

            <td>${b.event_type}</td>

            <td>${b.booking_date}</td>

            <td>${b.people}</td>

            <td>
                <select onchange="changeStatus(${b.id},this.value)">
                    <option ${b.status=="Pending" ? "selected" : ""}>Pending</option>
                    <option ${b.status=="Confirmed" ? "selected" : ""}>Confirmed</option>
                    <option ${b.status=="Completed" ? "selected" : ""}>Completed</option>
                </select>
            </td>

            <td>
                <button class="action-btn delete"
                        onclick="deleteBooking(${b.id})">
                    Delete
                </button>
            </td>

        </tr>

        `;

    });

}

// ======================
// Delete Booking
// ======================
async function deleteBooking(id) {

    if (confirm("Delete Booking?")) {

        await fetch("/booking/" + id, {
            method: "DELETE"
        });

        loadBookings();

    }

}

// ======================
// Change Booking Status
// ======================
async function changeStatus(id, status) {

    await fetch("/booking/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            status
        })

    });

    loadBookings();

}

// ======================
// Search Booking
// ======================
function searchBooking() {

    let input = document.getElementById("searchBox").value.toLowerCase();

    let rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach((row) => {

        row.style.display = row.innerText.toLowerCase().includes(input)
            ? ""
            : "none";

    });

}

// ======================
// Load Page
// ======================
loadBookings();
