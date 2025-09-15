# KHANDAQ '25

## Project info

**URL**: https://lovable.dev/projects/e80dc676-400c-420e-9380-2b478222665c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e80dc676-400c-420e-9380-2b478222665c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & Yarn installed.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
yarn install

# Step 4: Start the development server with auto-reloading and an instant preview.
yarn dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## How can I deploy this project?

### Using Lovable (Recommended)

Simply open [Lovable](https://lovable.dev/projects/e80dc676-400c-420e-9380-2b478222665c) and click on Share -> Publish.

### Manual Deployment to Netlify

If you prefer to deploy the project manually to Netlify, the required build and redirect settings are already configured in the `netlify.toml` file. This ensures that client-side routes like `/admin` work correctly in production.

You only need to configure the environment variables for your Supabase project.

#### Environment Variables
You will need to configure the following environment variables in your Netlify site settings (under "Site configuration" > "Build & deploy" > "Environment"):

- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase project anon key.

You can find these values in your Supabase project dashboard.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
