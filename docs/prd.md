Name: PlotShield
Project Summary
The client wants an application that helps users find book recommendations based
on AI generated reviews that will contain no spoilers or biases. Users can write
reviews, which will summarized by AI into one review that will be spoiler free. The AI
will also sort reviews into categories like characters, setting, atmosphere, and plot.
The app will have a simple design with very few/no social features. Users can
optionally see both original reviews and the AI-edited versions. Everyone can
browse as a guest, and there will be no paywalled features or subscriptions





Technical Architecture
Frontend (Client)
React + Vite + TypeScript (PWA, mobile-first design)
TailwindCSS + shadcn/ui components (Radix primitives: accessible + customizable)
React Router for navigation
Deployed via AWS Amplify
Backend (API Layer)
Express.js REST API (Node.js)
Serves as the single gateway for all data operations
Handles authentication, validation, and routing
Organizes CRUD endpoints by feature area (e.g., /vendors, /berries, /reviews)
Middleware for logging, error handling, and request validation
Rule: All CRUD operations go through the API — the frontend must not call Supabase DB directly.
Database & Authentication
Supabase (Postgres-based) for:
Data persistence
Authentication (OTP email code; role-based access)
Realtime subscriptions (optional for v1)
The API connects to Supabase via the Supabase client or pg driver.
Authentication approach:
Frontend may call Supabase Auth (OTP email code) directly to obtain a session/JWT.
API also exposes OTP wrappers (/auth/otp/start, /auth/otp/verify) for future clients and policy controls.
All protected API routes require Authorization: Bearer <JWT>.
Deployment Strategy
Frontend: AWS Amplify (continuous deployment from GitHub)
API Layer: Serverless functions
AWS Lambda (preferred) — Express wrapped with serverless-http
Database: Managed directly in the Supabase cloud instance
Development Tools
GitHub for version control and collaboration
Windsurf IDE for coding environment
Trello for task management
Slack for team communication
Key Considerations
Separation of Concerns: Clear distinction between frontend (UI), API (business logic), and DB (persistence).
Role-Based Access: API enforces role permissions (e.g., shopper vs. vendor).
Environment Variables: API keys stored in .env (never committed).
Scalability: Architecture is overkill for a class project, but reflects industry practices.