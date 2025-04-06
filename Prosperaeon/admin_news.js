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
  