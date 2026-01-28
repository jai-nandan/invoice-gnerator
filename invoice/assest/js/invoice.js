function loadInvoice() {
    let bill = JSON.parse(localStorage.getItem("currentBill"));
    if (!bill) return;

    // Get the DOM elements
    let cname = document.getElementById("cname");
    let caddress = document.getElementById("caddress");
    let cgst = document.getElementById("cgst");
    let dateEl = document.getElementById("date");
    let table = document.getElementById("billTable");

    // Set customer info
    cname.innerText = bill.customerName;
    caddress.innerText = bill.address;
    cgst.innerText = bill.customerGST;
    dateEl.innerText = new Date().toLocaleDateString();

    let taxableTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    let gstPercentUsed = 0;
    let isPunjab = bill.state.trim().toLowerCase() === "punjab";

    bill.items.forEach((i, index) => {
        let taxable = i.taxable;
        let gstPercent = i.gst;
        gstPercentUsed = gstPercent;

        taxableTotal += taxable;

        // Round figures for display
        let rateRounded = i.rate.toFixed(2);
        let qtyRounded = i.qty.toFixed(2);
        let taxableRounded = taxable.toFixed(2);
        let amountRounded = (taxable + taxable * gstPercent / 100).toFixed(2);

        let row = table.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${i.product}</td>
            <td>${i.hsn}</td>
            <td>${rateRounded}</td>
            <td>${qtyRounded}</td>
            <td>${taxableRounded}</td>
            <td>${gstPercent}%</td>
            <td>${amountRounded}</td>
        `;

        if (isPunjab) {
            let halfGST = gstPercent / 2;
            cgstTotal += taxable * halfGST / 100;
            sgstTotal += taxable * halfGST / 100;
        } else {
            igstTotal += taxable * gstPercent / 100;
        }
    });

    // Round summary totals
    document.getElementById("taxable").innerText = taxableTotal.toFixed(2);

    if (isPunjab) {
        document.getElementById("cgstLabel").innerText = `CGST @ ${(gstPercentUsed/2).toFixed(2)}%`;
        document.getElementById("cgstAmt").innerText = cgstTotal.toFixed(2);
        document.getElementById("sgstLabel").innerText = `SGST @ ${(gstPercentUsed/2).toFixed(2)}%`;
        document.getElementById("sgstAmt").innerText = sgstTotal.toFixed(2);
        document.getElementById("igstLabel").innerText = "IGST @ 0%";
        document.getElementById("igstAmt").innerText = "0.00";
        document.getElementById("total").innerText = (taxableTotal + cgstTotal + sgstTotal).toFixed(2);
    } else {
        document.getElementById("cgstLabel").innerText = "CGST @ 0%";
        document.getElementById("cgstAmt").innerText = "0.00";
        document.getElementById("sgstLabel").innerText = "SGST @ 0%";
        document.getElementById("sgstAmt").innerText = "0.00";
        document.getElementById("igstLabel").innerText = `IGST @ ${gstPercentUsed.toFixed(2)}%`;
        document.getElementById("igstAmt").innerText = igstTotal.toFixed(2);
        document.getElementById("total").innerText = (taxableTotal + igstTotal).toFixed(2);
    }
}
