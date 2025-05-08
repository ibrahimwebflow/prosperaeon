import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  await fetchPendingWithdrawals();
  attachWithdrawButtons();
});

async function fetchPendingWithdrawals() {
  const { data, error } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("status", "pending");

  const tableBody = document.getElementById("withdrawals-table-body");
  tableBody.innerHTML = "";

  if (error) {
    console.error("Error fetching withdrawals:", error.message);
    return;
  }

  if (!data || data.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6'>No pending withdrawal requests.</td></tr>";
    return;
  }

  data.forEach(withdrawal => {
    tableBody.innerHTML += `
      <tr>
        <td>${withdrawal.id}</td>
        <td>${withdrawal.user_id}</td>
        <td>${withdrawal.amount}</td>
        <td>${withdrawal.wallet_address}</td>
        <td>${withdrawal.status}</td>
        <td>
          <button class="approve-withdrawal-btn" data-id="${withdrawal.id}" data-user="${withdrawal.user_id}" data-amount="${withdrawal.amount}">Approve</button>
          <button class="reject-withdrawal-btn" data-id="${withdrawal.id}">Reject</button>
        </td>
      </tr>
    `;
  });
}

function attachWithdrawButtons() {
  document.querySelectorAll(".approve-withdrawal-btn").forEach(button => {
    button.addEventListener("click", handleWithdrawalApproval);
  });
  document.querySelectorAll(".reject-withdrawal-btn").forEach(button => {
    button.addEventListener("click", handleWithdrawalRejection);
  });
}

async function handleWithdrawalApproval(event) {
  const button = event.target;
  const withdrawalId = button.getAttribute("data-id");
  const userId = button.getAttribute("data-user");
  const amount = parseFloat(button.getAttribute("data-amount"));

  // Update withdrawal status to approved
  const { error: updateError } = await supabase
    .from("withdrawals")
    .update({ status: "approved" })
    .eq("id", withdrawalId);

  if (updateError) {
    console.error("Error approving withdrawal:", updateError.message);
    return;
  }

  // Fetch user balance
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("balance")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user balance:", userError.message);
    return;
  }

  const newBalance = (parseFloat(userData.balance) - amount).toFixed(2);

  // Update user's balance
  const { error: balanceError } = await supabase
    .from("users")
    .update({ balance: newBalance })
    .eq("id", userId);

  if (balanceError) {
    console.error("Error updating user balance:", balanceError.message);
    return;
  }

  // Remove row from table
  button.closest("tr").remove();
  console.log(`Withdrawal ${withdrawalId} approved. New balance for user ${userId}: ${newBalance}`);
  fetchPendingWithdrawals();
}

async function handleWithdrawalRejection(event) {
  const button = event.target;
  const withdrawalId = button.getAttribute("data-id");

  const { error } = await supabase
    .from("withdrawals")
    .update({ status: "rejected" })
    .eq("id", withdrawalId);

  if (error) {
    console.error("Error rejecting withdrawal:", error.message);
    return;
  }

  button.closest("tr").remove();
  console.log(`Withdrawal ${withdrawalId} rejected.`);
  fetchPendingWithdrawals();
}
