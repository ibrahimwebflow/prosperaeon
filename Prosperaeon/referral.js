import { supabase } from './supabase.js';

let allUsers = []; // Global to store all loaded users

async function loadReferralUsers() {
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error loading users:', error);
    return;
  }

  allUsers = users;
  renderUsers(users);
}

function renderUsers(users) {
  const tableBody = document.getElementById('referralUsersTableBody');
  tableBody.innerHTML = '';

  users.forEach(user => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${user.first_name}</td>
      <td>${user.referral_code || '-'}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.id}</td>
      <td>${user.balance}</td>
      <td>
        <input type="number" value="${user.balance}" id="balance-${user.id}" />
      </td>
      <td>
        <button onclick="updateUserBalance('${user.id}')">Update</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

window.updateUserBalance = async function (userId) {
  const newBalance = document.getElementById(`balance-${userId}`).value;

  const { error } = await supabase
    .from('users')
    .update({ balance: parseFloat(newBalance) })
    .eq('id', userId);

  if (error) {
    alert('Failed to update balance');
    console.error(error);
  } else {
    alert('Balance updated successfully');
  }
};

// Live search
window.filterReferralUsers = function () {
  const query = document.getElementById('searchInput').value.toLowerCase();

  const filteredUsers = allUsers.filter(user =>
    (user.first_name || '').toLowerCase().includes(query) ||
    (user.username || '').toLowerCase().includes(query) ||
    (user.email || '').toLowerCase().includes(query) ||
    (user.referral_code || '').toLowerCase().includes(query) ||
    (user.id || '').toLowerCase().includes(query) ||
    (user.balance || '').toLowerCase().includes(query)
  );

  renderUsers(filteredUsers);
};

loadReferralUsers();
