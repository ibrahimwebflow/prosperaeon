import { supabase } from "./supabase.js";  // Supabase Client

document.addEventListener("DOMContentLoaded", async () => {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Error fetching user:", authError?.message || "User not logged in");
        return;
    }

    console.log("✅ Authenticated User:", user);

    // Fetch user profile data
    const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("balance, plan, username, generated_referral_code")
        .eq("id", user.id)
        .single();

    if (fetchError) {
        console.error("Error fetching user details:", fetchError.message);
        return;
    }

    console.log("✅ User Details:", userData);

    // Update DOM
    if (document.getElementById("user-balance")) {
        document.getElementById("user-balance").textContent = userData.balance || "0.00";
    }
    if (document.getElementById("user-plan")) {
        document.getElementById("user-plan").textContent = userData.plan || "None";
    }
    if (document.getElementById("user-username")) {
        document.getElementById("user-username").textContent = userData.username || "None";
    }

    // Update referral code
    if (document.getElementById("referralCode")) {
        document.getElementById("referralCode").textContent = userData.generated_referral_code || "N/A";
    }

    // Load latest news
    await loadLatestNews();
});

// ✅ Load latest 5 news items
async function loadLatestNews() {
    const { data, error } = await supabase
        .from('latest_news')
        .select('title, message')
        .limit(5);

    if (error) {
        console.error("❌ Error fetching latest news:", error.message);
        return;
    }

    const list = document.getElementById('news-list');
    if (!list) return;

    list.innerHTML = '';
    data.forEach(news => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${news.title}</strong><br><br><hr>${news.message}<br><hr>`;
        list.appendChild(li);
    });
}




