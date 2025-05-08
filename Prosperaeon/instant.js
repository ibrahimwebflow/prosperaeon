import { supabase } from "./supabase.js"; // Import Supabase Client

document.getElementById("purchasePlan").addEventListener("click", async function () {
    const selectedPlan = parseInt(document.getElementById("planSelect").value);
    const user = await supabase.auth.getUser(); // Get logged-in user
    if (!user.data.user) {
        alert("Please log in first!");
        return;
    }

    const userId = user.data.user.id;

    // Fetch user's current balance
    const { data, error } = await supabase
        .from("users")
        .select("balance, plan")
        .eq("id", userId)
        .single();

    if (error || !data) {
        alert("Failed to fetch balance.");
        return;
    }

    const userBalance = data.balance;
    if (userBalance < selectedPlan) {
        alert("❌ Insufficient balance!");
        return;
    }

    // Deduct balance & update plan
    const { error: updateError } = await supabase
        .from("users")
        .update({ balance: userBalance - selectedPlan, plan: selectedPlan })
        .eq("id", userId);

    if (updateError) {
        alert("❌ Purchase failed. Try again.");
    } else {
        alert("✅ Plan purchased successfully!");
        location.reload(); // Refresh to update displayed balance
    }
});
