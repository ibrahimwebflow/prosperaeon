import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
    await fetchPendingSupport();
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("approve-support-btn")) {
        handleSettling(event);
    }
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("reject-support-btn")) {
        handleRejection(event);
    }
});


async function fetchPendingSupport() {
    const { data: support, error } = await supabase
        .from("support")
        .select("*")
        .in("status", ["pending", "attended"]); //Fetch Pending and attended

    if (error) {
        console.error("❌ Error fetching support inbox:", error.message);
        return;
    }

    // ✅ Clear existing table
    document.querySelector("#support-table").innerHTML = "";

    // ✅ Add new rows for pending support inbox
    support.forEach(support => {
        document.querySelector("#support-table").innerHTML += `
            <tr>
                <td>${support.id}</td>
                <td>${support.user_id}</td>
                <td>${support.message}</td>
                <td>${support.status}</td>
                <td>
                    <button class="approve-support-btn" data-id="${support.id}" data-user="${support.user_id}">Settle</button>
                    <button class="reject-support-btn" data-id="${support.id}">Attend</button>
                </td>
            </tr>
        `;
    });

    console.log(`✅ Table updated with ${support.length} pending support inbox.`);
}


async function handleSettling(event) {
    const button = event.target;
    const supportId = button.getAttribute("data-id");
    const userId = button.getAttribute("data-user");

    console.log(`🔄 Settled Support ${supportId} for user ${userId}...`);

    // // ✅ Fetch the payment details to get the purchased plan
    // const { data: support, error: fetchError } = await supabase
    //     .from("support")
    //     .select("status") // Assuming amount corresponds to plan
    //     .eq("id", supportId)
    //     .single();

    // if (fetchError || !support) {
    //     console.error("❌ Error fetching support details:", fetchError?.message);
    //     return;
    // }

    // const purchasedPlan = support.status; // Extract plan from payment amount

    // ✅ Step 1: Mark support as approved in Supabase
    let { error: updateError } = await supabase
        .from("support")
        .update({ status: "Settled" })  // ✅ Update status
        .eq("id", supportId);

    if (updateError) {
        console.error("❌ Error updating support status:", updateError.message);
        return;
    }

    console.log(`✅ Support ${supportId} marked as Settled.`);

    // // ✅ Step 2: Update user's plan based on the approved amount
    // let { error: planError } = await supabase
    //     .from("users")
    //     .update({ plan: purchasedPlan })  // ✅ Set new plan
    //     .eq("id", userId);

    // if (planError) {
    //     console.error("❌ Error updating user's plan:", planError.message);
    //     return;
    // }

    // console.log(`✅ User ${userId} updated to plan $${purchasedPlan}.`);

    // ✅ Step 3: Remove the transaction row from the table
    button.closest("tr").remove();
    console.log(`🗑️ Removed transaction ${supportId} from table.`);
}

  
async function handleRejection(event) {
    const supportId = event.target.getAttribute("data-id");

    const { error } = await supabase
        .from("support")
        .update({ status: "attended" })
        .eq("id", supportId);

    if (error) {
        console.error("❌ Error Attending To Support Issue:", error.message);
        return;
    }

    // Remove row from table
    event.target.closest("tr").remove();
    console.log(`❌ Support ${supportId} Attended.`);
}
