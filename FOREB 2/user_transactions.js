// user_transaction.js

import { supabase } from './supabase.js';

document.addEventListener("DOMContentLoaded", () => {
  loadTransactionTabs();
});

async function loadTransactionTabs() {
  await loadDeposits();
  await loadWithdrawals();
  await loadSupport();
}

async function loadDeposits() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('payment_proofs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error loading deposits:", error.message);
    return;
  }

  const depositTable = document.getElementById('deposit-table-body');
  depositTable.innerHTML = '';

  data.forEach((row, index) => {
    depositTable.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${row.status}</td>
        <td>${row.trc20_address}</td>
        <td>$${row.amount}</td>
        <td>${row.id}</td>
      </tr>
    `;
  });
}

async function loadWithdrawals() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error loading withdrawals:", error.message);
    return;
  }

  const withdrawalTable = document.getElementById('withdrawal-table-body');
  withdrawalTable.innerHTML = '';

  data.forEach((row, index) => {
    withdrawalTable.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>$${row.amount}</td>
        <td>${row.status}</td>
        <td>${row.wallet_address}</td>
        <td>${row.id}</td>
      </tr>
    `;
  });
}

async function loadSupport() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('support')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error loading support tickets:", error.message);
    return;
  }

  const supportTable = document.getElementById('support-table-body');
  supportTable.innerHTML = '';

  data.forEach((row, index) => {
    supportTable.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${row.status}</td>
        <td>${new Date(row.created_at).toLocaleString()}</td>
        <td>${row.id}</td>
      </tr>
    `;
  });
}
