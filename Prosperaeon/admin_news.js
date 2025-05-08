import { supabase } from './supabase.js';

document.getElementById('news-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('news-title').value.trim();
    const message = document.getElementById('news-message').value.trim();
  
    const { data, error } = await supabase
      .from('latest_news')
      .insert([{ title, message }]);
  
    if (error) {
      console.error('Push failed:', error);
      document.getElementById('latest-news-status').textContent = 'Failed to push update.';
    } else {
      document.getElementById('latest-news-status').textContent = 'Update pushed successfully.';
      document.getElementById('news-form').reset();
    }
  });

  document.getElementById('delete-news-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete ALL news updates? This action is irreversible.')) {
      const { error } = await supabase.from('latest_news').delete().neq('id', ''); // This still fails with UUID
  
      // ✅ FIX: Fetch all rows first, then delete by IDs manually
      const { data: news, error: fetchError } = await supabase.from('latest_news').select('id');
  
      if (fetchError) {
        console.error('Fetch failed:', fetchError);
        document.getElementById('latest-news-status').textContent = 'Failed to fetch news.';
        return;
      }
  
      // Delete all rows by their UUIDs
      const ids = news.map(item => item.id);
  
      const { error: deleteError } = await supabase.from('latest_news').delete().in('id', ids);
  
      const status = document.getElementById('latest-news-status');
      if (deleteError) {
        console.error('Delete failed:', deleteError);
        status.textContent = 'Failed to delete news.';
        status.style.color = 'red';
      } else {
        status.textContent = 'All news deleted successfully.';
        status.style.color = 'green';
      }
    }
  });

async function loadNewsTable() {
  const { data, error } = await supabase
    .from('latest_news')
    .select('*')
    .order('created_at', { ascending: false });

  const tbody = document.getElementById('news-table-body');
  tbody.innerHTML = ''; // Clear before re-render

  if (error) {
    console.error('Load failed:', error);
    tbody.innerHTML = '<tr><td colspan="3">Failed to load news.</td></tr>';
    return;
  }

  data.forEach(news => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${news.title}</td>
      <td>${news.message}</td>
      <td>${new Date(news.created_at).toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

loadNewsTable();

  
