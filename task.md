Fix these two issues in my Next.js frontend:
Fix 1 — Help & Support page dark theme:
In app/dashboard/help/page.tsx, the page is showing a white background instead of dark theme. Fix by ensuring:

Page wrapper: bg-zinc-950 min-h-screen text-white
All cards: bg-zinc-900 border-zinc-800
All inputs and textareas: bg-zinc-800 border-zinc-700 text-white
All text: text-white or text-zinc-400 for secondary text

Fix 2 — Profile Strength calculation:
In the sidebar component where Profile Strength is shown, replace the hardcoded 85% with a real dynamic calculation:
tsconst calculateProfileStrength = (profile) => {
  let strength = 0;
  if (profile?.user?.name) strength += 15;
  if (profile?.title) strength += 15;
  if (profile?.location) strength += 10;
  if (profile?.company) strength += 10;
  if (profile?.education) strength += 10;
  if (profile?.bio) strength += 10;
  if (profile?.skills?.length > 0) strength += 15;
  if (profile?.interests?.length > 0) strength += 15;
  return strength;
}

Fetch profile data in sidebar using getProfile() from @/lib/api
Pass result to calculateProfileStrength()
Display the real percentage
Update the progress bar width dynamically: style={{ width: \${strength}%` }}`
Update the hint text based on what's missing:

No skills → "Add skills to boost your matches"
No bio → "Add a bio to boost your profile"
No interests → "Add interests to boost your matches"
Profile complete → "Your profile is complete! 🎉"



Rules:

Do NOT change layout or structure
Only fix colors and profile strength calculation


