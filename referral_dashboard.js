import { supabase } from "./supabase.js";

async function loadReferralInfo() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Not logged in.");
        return;
    }

    const userId = user.id;

    // Step 1: Fetch user's generated referral code
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("generated_referral_code")
        .eq("id", userId)
        .single();

    if (userError || !userData) {
        console.error("Error fetching referral code.");
        return;
    }

    const referralCode = userData.generated_referral_code;

    // Step 2: Count how many referrals
    const { count, error: countError } = await supabase
        .from("referral_user")
        .select("*", { count: "exact", head: true })
        .eq("referrer_id", userId);

    if (countError) {
        console.error("Error counting referrals.");
        return;
    }

    // Step 3: Display in HTML
    document.getElementById("referralCode").innerText = referralCode;
    document.getElementById("referralCount").innerText = count;
}

loadReferralInfo();
