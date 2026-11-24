# LittleSteps

LittleSteps is a Next.js life-skills app for learners, with separate parent, mentor, and admin accounts.

## Run locally

Use Node.js 24 LTS. Open PowerShell in the folder that contains package.json and run these commands in order.

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. Create an account with your email and a password of at least six characters. Use localhost or 127.0.0.1 for local HTTP. For deployment, serve the app over HTTPS with a persistent writable disk. The production command is `npm run build` followed by `npm start`.

## Deploy to Render

1. Push this project folder to a GitHub repository.
2. In Render, choose **New** → **Blueprint**, connect that repository, and deploy the `render.yaml` blueprint.
3. Keep the `littlesteps-data` persistent disk attached. The blueprint uses a paid Starter web service because Render's free web services do not support persistent disks. The disk keeps account passwords and sessions across deployments and restarts.
4. After the first deployment finishes, open its `onrender.com` URL and create your account. To make an administrator, use Render's Shell for the service and run `npm run auth:promote -- your-email@example.com`.

Render builds the app with `npm ci && npm run build`, then runs `npm start`. The SQLite file is stored on the mounted disk at `/opt/render/project/src/.littlesteps/accounts.sqlite`. Do not commit `.env` files, `.littlesteps`, or database files. Learning activity is currently stored in each user's browser, so it does not sync across devices or browsers.

To deploy future changes, push them to the connected GitHub branch; Render will rebuild and deploy automatically.

## Accounts and data

- Select **Remember this email on this browser** during registration or sign-in to see that email as a sign-in option next time. Use **Clear saved emails** to remove the list. The browser’s password manager handles any saved passwords.

- The server stores salted password hashes and expiring sessions in SQLite. By default it uses `.littlesteps/accounts.sqlite`. Set `LITTLESTEPS_AUTH_DB` to an absolute path to put the database on a persistent volume.
- To create an administrator, register the intended account first. With access to the server and its database, run `npm run auth:promote -- email@example.com` for that account. The public registration form only creates learner, parent, and mentor accounts.
- Learning records remain in browser storage, with a separate workspace per account. Existing unowned browser records are kept under their old storage key. This release does not assign them to a new account automatically.
- Learners and parents can use **Find a Mentor** to search by name or registered email and send a request with a purpose. To link a learner with a parent, use **Connections** and accept the request on the other account.
- Mentors can search for learners and parents by name in **Connections**. **My Mentees** lists accepted learners, the parents connected to those learners, and parents who connected directly with the mentor.
- Mentors assign work from **Learners & Assignments**. Learners respond from **Mentor Assignments**. Parents see summary progress from **Learner Progress**. Direct messages require an accepted connection with the recipient.
- When upgrading, stop the old development server before copying its whole .littlesteps folder into the new project folder. Use the same local URL and browser to keep access to browser-stored activity.
- LittleBot helps with supported LittleSteps topics and reads the current learner's saved activity in the browser.

## Family and mentor workflow

- Parents invite a child or another parent account using its registered email in **Family Hub**. The recipient accepts in their own Family Hub. An accepted child invitation also connects that learner to the parent for progress and mentorship lookup.
- Parents post shared goals in **Family Hub** and track completion. **My Children & Progress** shows each connected child and their accepted mentors. A parent can request a direct connection to speak with a child's mentor.
- Mentors choose their subject in **Mentor Profile**. Learners can filter **Find a Mentor** by subject, send a request with a purpose, and keep the conversation in **Connections**.
