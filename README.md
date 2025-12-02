## Running the app

1. Install Node.js version 22 from [here](https://nodejs.org/en/download).
2. Clone the project
3. In the project directory run `npm i`, which installs the dependencies for the project.
4. To test correct cloning, run `npm run dev`, which should start the development server on `localhost:3000`
5. Setup up the environment (see below).
6. Build the project with `npm run build`.
7. Start the server locally `npm run start`.
8. Visit `localhost:3000` to view the landing page for customers.
9. Visit `localhost:3000/dashboard` to view the administrator dashboard.

#### Setting up the environment
Create a `.env.local` file in the project root dir. The following fields are required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS

The format of the file should be `KEY=VALUE` (one per line).

The Supabase url (which is public and thus safe to place in source control) is `https://eophsfoggdyfhmcwtnhf.supabase.co`. The Supabase publishable key (which is public and thus safe to place in source control) is `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcGhzZm9nZ2R5ZmhtY3d0bmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDMyNTYsImV4cCI6MjA3NTUxOTI1Nn0.SsGg8zRqAfcvlcFzlc_1cODK2XD9wrXla3ZPyRtdArk`. The SMTP credentials you can get by creating a free, ethereal account (no registration) [here](https://ethereal.email). To view emails sent by the system, open the email preview links logged to the server console.
