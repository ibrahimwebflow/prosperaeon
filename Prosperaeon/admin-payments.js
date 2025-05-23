import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
    await fetchPendingPayments();
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("approve-btn")) {
        handleApproval(event);
    }
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("reject-btn")) {
        handleRejection(event);
    }
});


async function fetchPendingPayments() {
    const { data: payments, error } = await supabase
        .from("payment_proofs")
        .select("*")
        .eq("status", "pending");  // ✅ Only fetch pending payments

    if (error) {
        console.error("❌ Error fetching payments:", error.message);
        return;
    }

    // ✅ Clear existing table
    document.querySelector("#payments-table").innerHTML = "";

    // ✅ Add new rows for pending payments
    payments.forEach(payment => {
        document.querySelector("#payments-table").innerHTML += `
            <tr>
                <td>${payment.id}</td>
                <td>${payment.user_id}</td>
                <td>${payment.amount}</td>
                <td>${payment.trc20_address}</td>
                <td>
                    <button class="approve-btn" data-id="${payment.id}" data-user="${payment.user_id}">Approve</button>
                    <button class="reject-btn" data-id="${payment.id}">Reject</button>
                </td>
            </tr>
        `;
    });

    console.log(`✅ Table updated with ${payments.length} pending payments.`);
}


async function handleApproval(event) {
    const button = event.target;
    const paymentId = button.getAttribute("data-id");
    const userId = button.getAttribute("data-user");

    console.log(`🔄 Approving payment ${paymentId} for user ${userId}...`);

    // Step 1: Fetch payment details
    const { data: payment, error: fetchError } = await supabase
        .from("payment_proofs")
        .select("amount")
        .eq("id", paymentId)
        .single();

    if (fetchError || !payment) {
        console.error("❌ Error fetching payment details:", fetchError?.message);
        return;
    }

    const purchasedPlan = payment.amount;

    // Step 2: Get current user details
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("plan, plan_bought_at, referral_code")
        .eq("id", userId)
        .single();

    if (userError || !userData) {
        console.error("❌ Error fetching user data:", userError.message);
        return;
    }

    const alreadyHasPlan = !!userData.plan_bought_at;

    // Step 3: Update payment status
    const { error: updateError } = await supabase
        .from("payment_proofs")
        .update({ status: "approved" })
        .eq("id", paymentId);

    if (updateError) {
        console.error("❌ Error updating payment status:", updateError.message);
        return;
    }

    console.log(`✅ Payment ${paymentId} marked as approved.`);

    // Step 4: Update user plan (and plan_bought_at if first plan)
    const updates = {
        plan: purchasedPlan,
        ...(alreadyHasPlan ? {} : { plan_bought_at: new Date().toISOString() })
    };

    const { error: planError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

    if (planError) {
        console.error("❌ Error updating user plan:", planError.message);
        return;
    }

    console.log(`✅ User ${userId} updated to plan $${purchasedPlan}.`);

    // Step 5: Give 15% referral reward (only if first time)
    if (!alreadyHasPlan && userData.referral_code) {
        // Find the referrer
        const { data: referrerData, error: referrerError } = await supabase
            .from("users")
            .select("id, balance")
            .eq("generated_referral_code", userData.referral_code)
            .single();

        if (referrerError || !referrerData) {
            console.warn("⚠️ No referrer found for this user.");
        } else {
            const reward = purchasedPlan * 0.15;

            const newBalance = (referrerData.balance || 0) + reward;

            const { error: rewardError } = await supabase
                .from("users")
                .update({ balance: newBalance })
                .eq("id", referrerData.id);

            if (rewardError) {
                console.error("❌ Error updating referrer balance:", rewardError.message);
            } else {
                console.log(`🎉 Referrer ${referrerData.id} earned $${reward.toFixed(2)} (15%).`);
            }
        }
    }

    // Step 6: Remove approved row
    button.closest("tr").remove();
    console.log(`🗑️ Removed transaction ${paymentId} from table.`);
}
  
async function handleRejection(event) {
    const paymentId = event.target.getAttribute("data-id");

    const { error } = await supabase
        .from("payment_proofs")
        .update({ status: "rejected" })
        .eq("id", paymentId);

    if (error) {
        console.error("❌ Error rejecting payment:", error.message);
        return;
    }

    // Remove row from table
    event.target.closest("tr").remove();
    console.log(`❌ Payment ${paymentId} rejected.`);
}

