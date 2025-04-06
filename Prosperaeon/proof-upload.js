import { supabase } from "./supabase.js"; // Import Supabase Client

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Proof Upload JS Loaded");

    // Read URL Parameters
    const params = new URLSearchParams(window.location.search);
    const amount = params.get("amount");

    if (!amount) {
        console.error("❌ Missing payment details.");
        alert("Invalid payment proof request!");
        window.location.href = "dashboard.html";  // Redirect back if invalid
        return;
    }

    // Display the plan amount
    document.getElementById("plan-amount").textContent = `$${amount}`;

    // Handle Form Submission
    document.getElementById("proof-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const trc20Address = document.getElementById("trc20-address").value;
        const proofImage = document.getElementById("proof-image").files[0];

        if (!trc20Address || !proofImage) {
            alert("Please fill in all fields.");
            return;
        }

        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            alert("User authentication failed.");
            return;
        }

        console.log(`✅ Uploading payment proof for ${user.email}`);

        // Upload file to Supabase Storage
        const filePath = `proofs/${user.id}_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
    .from("payment-proofs")  // Corrected bucket name
    .upload(filePath, proofImage, {
        cacheControl: "3600",
        upsert: false,
    });

        if (uploadError) {
            console.error("❌ Upload Error:", uploadError.message);
            alert("Failed to upload proof. Try again.");
            return;
        }

        const proofUrl = `https://xyz.supabase.co/storage/v1/object/public/payment_proofs/${filePath}`;

        // Insert payment proof into Supabase
        const { data, error } = await supabase
            .from("payment_proofs")
            .insert([
                { user_id: user.id, amount, trc20_address: trc20Address, proof_url: proofUrl, status: "pending" }
            ]);

        if (error) {
            console.error("❌ Database Insert Error:", error.message);
            alert("Failed to submit proof.");
            return;
        }

        console.log("✅ Proof submitted successfully:", data);
        alert("Payment proof submitted! Admin will review it.");
        window.location.href = "dashboard.html"; // Redirect after submission
    });
});
