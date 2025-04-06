import { supabase } from './supabase.js';

document.getElementById('supportForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = document.getElementById('supportMessage').value;

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    alert("You're not logged in");
    return;
  }

  const { error } = await supabase.from('support').insert([
    {
      user_id: user.user.id,
      message: message,
      status: 'pending'
    }
  ]);

  if (error) {
    console.error(error);
    document.getElementById('supportResponse').textContent = 'Error submitting ticket.';
  } else {
    document.getElementById('supportResponse').textContent = 'Your message has been sent!';
    document.getElementById('supportForm').reset();
  }
});
    