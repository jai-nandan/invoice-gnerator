let items = [];

function addItem() {
    let product = document.getElementById("product").value;
    let hsn = document.getElementById("hsn").value;
    let rate = Number(document.getElementById("rate").value);
    let qty = Number(document.getElementById("qty").value);
    let gst = Number(document.getElementById("gst").value);

    if (!product || !hsn || isNaN(rate) || isNaN(qty) || isNaN(gst)) {
        alert("Please fill all item fields correctly");
        return;
    }

    let taxable = rate * qty;

    items.push({ product, hsn, rate, qty, gst, taxable });

    renderTable();

    // Clear input fields
    document.getElementById("product").value = "";
    document.getElementById("hsn").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("gst").value = "";
}

function renderTable() {
    let table = document.getElementById("itemTable");
    // Keep only header row
    table.innerHTML = `
        <tr>
            <th>Product</th>
            <th>HSN</th>
            <th>Rate</th>
            <th>Qty</th>
            <th>GST%</th>
            <th>Taxable</th>
            <th>Delete</th>
        </tr>
    `;
    items.forEach((item, index) => {
        let row = table.insertRow();
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.hsn}</td>
            <td>${item.rate}</td>
            <td>${item.qty}</td>
            <td>${item.gst}%</td>
            <td>${item.taxable.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="deleteItem(${index})">Delete</button></td>
        `;
    });
}

function deleteItem(index) {
    items.splice(index, 1);
    renderTable();
}

function generateInvoice() {
    // Create the bill object
    let bill = {
        customerName: document.getElementById("customerName").value,
        customerGST: document.getElementById("customerGST").value,
        address: document.getElementById("address").value,
        state: document.getElementById("state").value,
        items: items,
        date: new Date().toLocaleDateString() // Save bill date
    };

    if (!bill.customerName || !bill.customerGST || !bill.address || !bill.state || items.length === 0) {
        alert("Please fill all customer and item details before generating invoice");
        return;
    }

    // 1️⃣ Get existing bills or create empty array
    let allBills = JSON.parse(localStorage.getItem("allBills")) || [];

    // 2️⃣ Add new bill to array
    allBills.push(bill);

    // 3️⃣ Save updated bills back to localStorage
    localStorage.setItem("allBills", JSON.stringify(allBills));

    // 4️⃣ Save current bill for invoice page
    localStorage.setItem("currentBill", JSON.stringify(bill));

    // 5️⃣ Redirect to invoice page
    window.location.href = "bill.html";
}
