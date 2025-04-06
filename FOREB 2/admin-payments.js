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

    // ✅ Fetch the payment details to get the purchased plan
    const { data: payment, error: fetchError } = await supabase
        .from("payment_proofs")
        .select("amount") // Assuming amount corresponds to plan
        .eq("id", paymentId)
        .single();

    if (fetchError || !payment) {
        console.error("❌ Error fetching payment details:", fetchError?.message);
        return;
    }

    const purchasedPlan = payment.amount; // Extract plan from payment amount

    // ✅ Step 1: Mark payment as approved in Supabase
    let { error: updateError } = await supabase
        .from("payment_proofs")
        .update({ status: "approved" })  // ✅ Update status
        .eq("id", paymentId);

    if (updateError) {
        console.error("❌ Error updating payment status:", updateError.message);
        return;
    }

    console.log(`✅ Payment ${paymentId} marked as approved.`);

    // ✅ Step 2: Update user's plan based on the approved amount
    let { error: planError } = await supabase
        .from("users")
        .update({ plan: purchasedPlan })  // ✅ Set new plan
        .eq("id", userId);

    if (planError) {
        console.error("❌ Error updating user's plan:", planError.message);
        return;
    }

    console.log(`✅ User ${userId} updated to plan $${purchasedPlan}.`);

    // ✅ Step 3: Remove the transaction row from the table
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

