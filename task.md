In my Next.js frontend, remove ALL dummy/hardcoded data from every page and replace with real API calls to http://localhost:5000.
Pages that have dummy data to fix:

Smart Matches page — showing fake users (Sarah Chen, Michael Park, etc.)
Feed page — showing fake posts
Events page — showing fake events

For Smart Matches page:

Remove ALL hardcoded user cards (Sarah Chen, Michael Park, Emily Rodriguez, etc.)
Fetch real matches from GET /api/matches using token from localStorage
If no matches exist yet, show an empty state: "No matches found yet. Complete your profile to get matched!"
Map over real matches data to render cards
If API returns 401, redirect to /auth/login

For Feed page:

Remove ALL hardcoded posts
Fetch real posts from GET /api/posts
Show empty state if no posts: "No posts yet. Be the first to share!"
Create post form should call POST /api/posts
Delete post should call DELETE /api/posts/:id

For Events page:

Remove ALL hardcoded events
Fetch real events from GET /api/events
Show empty state if no events: "No events yet."
Create event should call POST /api/events
Attend/unattend should call POST /api/events/:id/attend

For ALL pages:

Add 'use client' at top
Use useEffect + useState for data fetching
Show loading spinner while fetching
Show empty state when no data
Use token from localStorage for all API calls
Redirect to /auth/login on 401

Rules:

Remove every single hardcoded name, number, skill, post, event
Do NOT change UI layout or design
Keep all existing components and styling intact
Only replace the data source from hardcoded to API


