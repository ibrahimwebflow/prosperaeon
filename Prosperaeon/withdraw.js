import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const withdrawForm = document.getElementById("withdraw-form");
  const withdrawMessage = document.getElementById("withdraw-message");

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    withdrawMessage.textContent = "User not logged in.";
    return;
  }
  const userId = user.id;

  // Fetch user's balance
  const { data: userData, error: balanceError } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();
  if (balanceError) {
    console.error("Error fetching user balance:", balanceError.message);
    withdrawMessage.textContent = "Error fetching balance.";
    return;
  }
  const currentBalance = parseFloat(userData.balance);

  withdrawForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = parseFloat(document.getElementById("withdraw-amount").value);
    const walletAddress = document.getElementById("wallet-address").value.trim();

    // Validate minimum withdrawal amount
    if (amount < 15) {
      withdrawMessage.textContent = "Minimum withdrawal amount is $15.";
      return;
    }
    // Validate if user has enough balance
    if (amount > currentBalance) {
      withdrawMessage.textContent = "Insufficient balance for withdrawal.";
      return;
    }

    // Construct withdrawal request payload
    const withdrawalData = {
      user_id: userId,
      amount: amount,
      wallet_address: walletAddress,
      status: "pending" // awaiting admin approval
    };

    const { data, error } = await supabase
      .from("withdrawals")
      .insert([ withdrawalData ]);

    if (error) {
      console.error("Error processing withdrawal:", error.message);
      withdrawMessage.textContent = "Error processing withdrawal. Please try again.";
      return;
    }

    withdrawMessage.textContent = "Withdrawal request submitted! Await admin approval.";
    withdrawForm.reset();
  });
});
