import { supabase } from "./supabase.js";

async function loadReferralInfo() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Not logged in.");
        return;
    }

    const userId = user.id;

    // ✅ Step 1: Get the user's referral code
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("generated_referral_code")
        .eq("id", userId)
        .single();

    if (userError || !userData) {
        console.error("Error fetching referral code:", userError);
        return;
    }

    const referralCode = userData.generated_referral_code;

    // ✅ Step 2: Count users who used this referral code
    const { data: referredUsers, error: countError } = await supabase
        .from("users")
        .select("id") // only fetch ids to count
        .eq("referral_code", referralCode);

    if (countError) {
        console.error("Error fetching referrals:", countError.message);
        return;
    }

    const referralCount = referredUsers?.length || 0;

    // ✅ Step 3: Build and show referral link
    const referralLink = `https://prosperaeon.pages.dev/signup?ref=${referralCode}`;

    // ✅ Step 4: Make sure elements exist before updating
    const codeElem = document.getElementById("referralCode");
    const countElem = document.getElementById("referralCount");
    const linkElem = document.getElementById("referralLink");

    if (codeElem) codeElem.innerText = referralCode;
    if (countElem) countElem.innerText = referralCount;
    if (linkElem) {
        linkElem.innerText = referralLink;
        linkElem.href = referralLink;
    }

    console.log("✅ Referral Count Updated:", referralCount);
}

loadReferralInfo();
