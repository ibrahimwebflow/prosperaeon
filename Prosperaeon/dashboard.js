import { supabase } from "./supabase.js";  // Import Supabase Client

async function fetchUserData() {
    // Get authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.error("Error fetching user:", error?.message || "No user logged in");
        return;
    }

    console.log("Authenticated User:", user);

    // Fetch user details using UUID from auth.users
    const { data, error: fetchError } = await supabase
        .from("users")
        .select("balance, plan, username")
        .eq("id", user.id)  // Match with the correct UUID
        .single();

    if (fetchError) {
        console.error("Error fetching user details:", fetchError.message);
        return;
    }

    console.log("User Details:", data);

    // Ensure the elements exist before updating
    document.getElementById("user-balance").textContent = data.balance || "0.00";
    document.getElementById("user-plan").textContent = data.plan || "None";
    document.getElementById("user-username").textContent = data.username || "None";
}

document.addEventListener("DOMContentLoaded", fetchUserData);
if (!supabase || !supabase.auth) {
    console.error("Supabase auth is not initialized correctly.");
} else {
    const { data: { user }, error } = await supabase.auth.getUser();
if (error) {
    console.error("Error fetching user:", error);
} else {
    console.log("Authenticated User:", user);
}
    console.log("Authenticated User:", user);
}


async function loadLatestNews() {
    const { data, error } = await supabase
      .from('latest_news')
      .select('title, message')
     // .order('created_at', { ascending: false })
      .limit(5);
  
    const list = document.getElementById('news-list');
    list.innerHTML = '';
    data?.forEach(news => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${news.title}</strong><br>${news.message}<br><small>${new Date(news.created_at).toLocaleString()}</small><hr>`;
      list.appendChild(li);
    });
  }
  loadLatestNews();
