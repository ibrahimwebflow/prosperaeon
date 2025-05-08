document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Plans JS Loaded");

    const payButtons = document.querySelectorAll(".pay-now");

    if (payButtons.length === 0) {
        console.warn("⚠️ No 'Pay Now' buttons found.");
        return;
    }

    console.log(`✅ Found ${payButtons.length} pay buttons`);

    payButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const planDiv = event.target.closest(".plan");
            if (!planDiv) {
                console.error("❌ Could not find plan div");
                return;
            }

            const amount = planDiv.getAttribute("data-amount");
            const profit = planDiv.getAttribute("data-profit");

            console.log(`✅ Plan Selected: $${amount} (Profit: ${profit})`);

            // Redirect to payment.html with query parameters
            window.location.href = `payment.html?amount=${amount}&profit=${profit}`;
        });
    });
});
