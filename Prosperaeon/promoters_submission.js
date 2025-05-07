// File: /scripts/admin_dashboard.js

// Import createClient directly from Supabase ESM CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const SUPABASE_URL = 'https://usopwzufmbuthknylquz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzb3B3enVmbWJ1dGhrbnlscXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODQ1NTQsImV4cCI6MjA1ODg2MDU1NH0.EJd2eGAK2c-I4qDGQmG-QGW0leWiLu5pme08qrSZHHU';  // replace with actual anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Fetch and render promoter applications
 */
export async function loadApplications() {
  try {
    const { data, error } = await supabase
      .from('promoter_applications')
      .select('*')
      .order('created_at', { ascending: false });

    const tbody = document.getElementById('applicationsTable');
    if (error) throw error;

    tbody.innerHTML = data.map(app => `
      <tr>
        <td>${app.full_name}</td>
        <td>${app.email}</td>
        <td>${app.phone}</td>
        <td>$${app.investment.toFixed(2)}</td>
        <td>${app.reason}</td>
        <td>${new Date(app.created_at).toLocaleString()}</td>
        <td>${app.status}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading applications:', err);
    const tbody = document.getElementById('applicationsTable');
    tbody.innerHTML = '<tr><td colspan="6">Error loading data.</td></tr>';
  }
}

// Automatically load on DOM ready
window.addEventListener('DOMContentLoaded', loadApplications);
