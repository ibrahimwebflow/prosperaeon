document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Payment JS Loaded");

    // Read URL Parameters
    const params = new URLSearchParams(window.location.search);
    const amount = params.get("amount");
    const profit = params.get("profit");

    if (!amount || !profit) {
        console.error("❌ Missing payment details.");
        alert("Invalid payment request!");
        window.location.href = "dashboard.html";  // Redirect back if invalid
        return;
    }

    // Display the payment details
    document.getElementById("plan-amount").textContent = `$${amount}`;
    document.getElementById("plan-profit").textContent = profit;

    console.log(`✅ Payment Details Loaded: Amount: $${amount}, Profit: ${profit}`);

    // Handle Confirm Payment Button
    document.getElementById("confirm-payment").addEventListener("click", () => {
        console.log("✅ Payment Confirmed! Redirecting to proof upload...");
        window.location.href = `proof-upload.html?amount=${amount}`;
    });
});
