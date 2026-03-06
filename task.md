In my Next.js frontend, replace ALL hardcoded/dummy data with real API calls to my Express backend at http://localhost:5000.
The current app shows fake data like:

Name: "John Doe"
Email: "john@example.com"
Title: "Full Stack Developer"
Location: "San Francisco, CA"
Company: "TechCorp Inc."
Education: "MIT - Computer Science"
Skills: React, TypeScript, Node.js, etc.
Stats: 248 Connections, 45 Smart Matches, etc.

Replace ALL of this with real data from the backend:
In every page/component that shows profile data:

Add 'use client' at top
Import getProfile from @/lib/api
Use useEffect to fetch profile on mount
Use useState to store profile data
Replace every hardcoded value with the real data from API
Show a loading spinner while fetching
If token is missing or API returns 401, redirect to /auth/login

Specifically replace:

"John Doe" → profile?.user?.name
"john@example.com" → profile?.user?.email
"Full Stack Developer" → profile?.title
"San Francisco, CA" → profile?.location
"TechCorp Inc." → profile?.company
"MIT - Computer Science" → profile?.education
bio → profile?.bio
skills array → profile?.skills
interests array → profile?.interests
stats → profile?.stats
Avatar initials → profile?.avatarInitials

Also fix the logout button:

On "Log out" click → call removeToken() from @/lib/auth → redirect to /auth/login

Also fix Edit Profile:

On save → call updateProfile(data) from @/lib/api → refresh profile data
On add skill → call addSkill(name) from @/lib/api
On remove skill → call removeSkill(id) from @/lib/api
On add interest → call addInterest(name) from @/lib/api
On remove interest → call removeInterest(id) from @/lib/api

Rules:

Remove ALL hardcoded dummy data completely
Show empty strings or "Not set" if API returns null for a field
Do NOT change the UI design or layout at all
Use NEXT_PUBLIC_API_URL from env for all API calls


