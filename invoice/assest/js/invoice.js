function loadInvoice() {
    const bill = JSON.parse(localStorage.getItem("currentBill"));
    if (!bill) return;

    // Customer details
    document.getElementById("cname").innerText = bill.customerName;
    document.getElementById("caddress").innerText = bill.address;
    document.getElementById("cgst").innerText = bill.customerGST || "-";
    document.getElementById("date").innerText = new Date().toLocaleDateString();

    const table = document.getElementById("billTable");

    let taxableTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    const isPunjab = bill.state.toLowerCase().trim() === "punjab";

    bill.items.forEach((item, index) => {
        const rate = Number(item.rate);
        const qty = Number(item.qty);
        const gst = Number(item.gst);

        // ✅ Correct taxable calculation
        const taxable = rate * qty;
        taxableTotal += taxable;

        // ✅ TOP TABLE → Amount = Taxable ONLY
        const row = table.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.product}</td>
            <td>${item.hsn}</td>
            <td>${rate.toFixed(2)}</td>
            <td>${qty}</td>
            <td>${taxable.toFixed(2)}</td>
            <td>${gst}%</td>
            <td>${taxable.toFixed(2)}</td>
        `;

        // ✅ GST calculation ONLY for bottom table
        if (isPunjab) {
            cgstTotal += taxable * (gst / 2) / 100;
            sgstTotal += taxable * (gst / 2) / 100;
        } else {
            igstTotal += taxable * gst / 100;
        }
    });

    // 🔽 Bottom summary
    document.getElementById("taxable").innerText = taxableTotal.toFixed(2);

    if (isPunjab) {
        document.getElementById("cgstLabel").innerText = "CGST @ " + (bill.items[0].gst / 2) + "%";
        document.getElementById("sgstLabel").innerText = "SGST @ " + (bill.items[0].gst / 2) + "%";
        document.getElementById("igstLabel").innerText = "IGST @ 0%";

        document.getElementById("cgstAmt").innerText = cgstTotal.toFixed(2);
        document.getElementById("sgstAmt").innerText = sgstTotal.toFixed(2);
        document.getElementById("igstAmt").innerText = "0.00";

        document.getElementById("total").innerText =
            (taxableTotal + cgstTotal + sgstTotal).toFixed(2);
    } else {
        document.getElementById("cgstLabel").innerText = "CGST @ 0%";
        document.getElementById("sgstLabel").innerText = "SGST @ 0%";
        document.getElementById("igstLabel").innerText = "IGST @ " + bill.items[0].gst + "%";

        document.getElementById("cgstAmt").innerText = "0.00";
        document.getElementById("sgstAmt").innerText = "0.00";
        document.getElementById("igstAmt").innerText = igstTotal.toFixed(2);

        document.getElementById("total").innerText =
            (taxableTotal + igstTotal).toFixed(2);
    }
}
