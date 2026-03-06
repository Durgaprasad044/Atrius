In my Next.js frontend, create two pages that match the existing dark theme (bg-zinc-950, bg-zinc-900 cards).
Page 1: app/dashboard/settings/page.tsx
Create a full settings page with these sections:
Account Settings

Profile photo upload (just UI, no backend needed)
Full name input
Email input (readonly)
Job title input
Location input
Company input
Education input
Bio textarea
Save Changes button → calls PUT /api/profile/me with updated data

Password & Security

Current password input
New password input
Confirm new password input
Update Password button

Notifications

Toggle switches for:

Email notifications
Match notifications
Event reminders
Weekly digest



Danger Zone

Delete Account button (red, shows confirmation dialog before acting)


Page 2: app/dashboard/help/page.tsx
Create a help & support page with:
FAQ Section with these questions and answers:

"How does Smart Matching work?" → AI analyzes your skills and interests to find compatible professionals
"How do I improve my Profile Strength?" → Add skills, interests, bio, and complete all profile fields
"Can I delete my account?" → Yes, go to Settings → Danger Zone
"How do I report a user?" → Use the flag icon on their profile or contact support
"Is my data private?" → Yes, we never share your data with third parties

Contact Support Section

Subject input
Message textarea
Submit button

Resources Section

3 cards: "Getting Started Guide", "Privacy Policy", "Terms of Service"

Rules:

Both pages use 'use client'
Match existing dark theme exactly (bg-zinc-950 background, bg-zinc-900 cards, white text)
Use shadcn/ui components: Input, Textarea, Button, Switch, Card
Settings page fetches current profile data on load and pre-fills all fields
Do NOT change sidebar or navbar


