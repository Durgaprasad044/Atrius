Prompt:
src/lib/prisma.ts

Prisma client singleton (prevent multiple instances in development)


src/middleware/authMiddleware.ts

Extract JWT from Authorization: Bearer <token> header
Verify using JWT_SECRET from env
Attach decoded user { id, email } to req.user
Return 401 if token missing or invalid

src/middleware/errorMiddleware.ts

Global error handler with err, req, res, next signature
Return JSON { message: err.message } with status code
Default to 500 if no status set


src/controllers/authController.ts

register — validate email/password, hash password with bcrypt (10 rounds), create User + empty Profile + empty Stats in a Prisma transaction, return JWT
login — find user by email, compare password with bcrypt, return JWT with user id and email
googleCallback — called after passport Google OAuth, generate JWT, redirect to CLIENT_URL/auth/callback?token=TOKEN

src/controllers/profileController.ts

getMyProfile — fetch Profile with Skills, Interests, Stats where userId = req.user.id
updateMyProfile — update Profile fields (name, title, location, company, education, bio, website, avatarInitials)
addSkill — create Skill linked to user's profileId
removeSkill — delete Skill by id (verify it belongs to user first)
addInterest — create Interest linked to user's profileId
removeInterest — delete Interest by id (verify it belongs to user first)

src/controllers/postController.ts

getAllPosts — fetch all Posts with author name and avatar, ordered by createdAt desc
createPost — create Post with userId = req.user.id
updatePost — update Post content (verify post belongs to user)
deletePost — delete Post (verify post belongs to user)
likePost — increment likes count by 1

src/controllers/eventController.ts

getAllEvents — fetch all Events with organizer name, attendee count
createEvent — create Event with organizerId = req.user.id
getEventById — fetch single Event with full details and attendees
updateEvent — update Event (verify organizerId = req.user.id)
deleteEvent — delete Event (verify organizerId = req.user.id)
attendEvent — create or delete EventAttendee record (toggle attend/unattend), update Stats.eventsAttended

src/controllers/matchController.ts

getMatches — fetch all Matches where userId = req.user.id, include matched user's Profile, order by score desc


src/routes/authRoutes.ts
POST   /register        → authController.register
POST   /login           → authController.login
GET    /google          → passport.authenticate('google', { scope: ['profile', 'email'] })
GET    /google/callback → passport.authenticate then authController.googleCallback
src/routes/profileRoutes.ts — all protected with authMiddleware
GET    /me              → getMyProfile
PUT    /me              → updateMyProfile
POST   /me/skills       → addSkill
DELETE /me/skills/:id   → removeSkill
POST   /me/interests    → addInterest
DELETE /me/interests/:id → removeInterest
src/routes/postRoutes.ts — all protected with authMiddleware
GET    /         → getAllPosts
POST   /         → createPost
PUT    /:id      → updatePost
DELETE /:id      → deletePost
POST   /:id/like → likePost
src/routes/eventRoutes.ts — all protected with authMiddleware
GET    /          → getAllEvents
POST   /          → createEvent
GET    /:id       → getEventById
PUT    /:id       → updateEvent
DELETE /:id       → deleteEvent
POST   /:id/attend → attendEvent
src/routes/matchRoutes.ts — all protected with authMiddleware
GET    /   → getMatches

src/index.ts

Load dotenv
Initialize Express app
Setup passport with Google OAuth strategy
Middleware: cors({ origin: CLIENT_URL, credentials: true }), express.json()
Mount routes:

/api/auth → authRoutes
/api/profile → profileRoutes
/api/posts → postRoutes
/api/events → eventRoutes
/api/matches → matchRoutes


Mount errorMiddleware last
Listen on PORT


backend/tsconfig.json
json{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
Rules:

Use TypeScript throughout, no any types where possible
Every controller wrapped in try/catch, errors passed to next(err)
All protected routes must verify ownership before update/delete
Do NOT modify package.json or schema.prisma



Once this is done, run:
bashcd backend
npm run dev
If it starts on port 5000 with no errors, come back and we'll do the frontend connection prompt! 🚀src/lib/prisma.ts

Prisma client singleton (prevent multiple instances in development)


src/middleware/authMiddleware.ts

Extract JWT from Authorization: Bearer <token> header
Verify using JWT_SECRET from env
Attach decoded user { id, email } to req.user
Return 401 if token missing or invalid

src/middleware/errorMiddleware.ts

Global error handler with err, req, res, next signature
Return JSON { message: err.message } with status code
Default to 500 if no status set


src/controllers/authController.ts

register — validate email/password, hash password with bcrypt (10 rounds), create User + empty Profile + empty Stats in a Prisma transaction, return JWT
login — find user by email, compare password with bcrypt, return JWT with user id and email
googleCallback — called after passport Google OAuth, generate JWT, redirect to CLIENT_URL/auth/callback?token=TOKEN

src/controllers/profileController.ts

getMyProfile — fetch Profile with Skills, Interests, Stats where userId = req.user.id
updateMyProfile — update Profile fields (name, title, location, company, education, bio, website, avatarInitials)
addSkill — create Skill linked to user's profileId
removeSkill — delete Skill by id (verify it belongs to user first)
addInterest — create Interest linked to user's profileId
removeInterest — delete Interest by id (verify it belongs to user first)

src/controllers/postController.ts

getAllPosts — fetch all Posts with author name and avatar, ordered by createdAt desc
createPost — create Post with userId = req.user.id
updatePost — update Post content (verify post belongs to user)
deletePost — delete Post (verify post belongs to user)
likePost — increment likes count by 1

src/controllers/eventController.ts

getAllEvents — fetch all Events with organizer name, attendee count
createEvent — create Event with organizerId = req.user.id
getEventById — fetch single Event with full details and attendees
updateEvent — update Event (verify organizerId = req.user.id)
deleteEvent — delete Event (verify organizerId = req.user.id)
attendEvent — create or delete EventAttendee record (toggle attend/unattend), update Stats.eventsAttended

src/controllers/matchController.ts

getMatches — fetch all Matches where userId = req.user.id, include matched user's Profile, order by score desc


src/routes/authRoutes.ts
POST   /register        → authController.register
POST   /login           → authController.login
GET    /google          → passport.authenticate('google', { scope: ['profile', 'email'] })
GET    /google/callback → passport.authenticate then authController.googleCallback
src/routes/profileRoutes.ts — all protected with authMiddleware
GET    /me              → getMyProfile
PUT    /me              → updateMyProfile
POST   /me/skills       → addSkill
DELETE /me/skills/:id   → removeSkill
POST   /me/interests    → addInterest
DELETE /me/interests/:id → removeInterest
src/routes/postRoutes.ts — all protected with authMiddleware
GET    /         → getAllPosts
POST   /         → createPost
PUT    /:id      → updatePost
DELETE /:id      → deletePost
POST   /:id/like → likePost
src/routes/eventRoutes.ts — all protected with authMiddleware
GET    /          → getAllEvents
POST   /          → createEvent
GET    /:id       → getEventById
PUT    /:id       → updateEvent
DELETE /:id       → deleteEvent
POST   /:id/attend → attendEvent
src/routes/matchRoutes.ts — all protected with authMiddleware
GET    /   → getMatches

src/index.ts

Load dotenv
Initialize Express app
Setup passport with Google OAuth strategy
Middleware: cors({ origin: CLIENT_URL, credentials: true }), express.json()
Mount routes:

/api/auth → authRoutes
/api/profile → profileRoutes
/api/posts → postRoutes
/api/events → eventRoutes
/api/matches → matchRoutes


Mount errorMiddleware last
Listen on PORT

