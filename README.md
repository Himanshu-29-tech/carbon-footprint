🌱 EcoTrack — Carbon Footprint Tracker

A simple, personalized web app that helps individuals understand, track, and reduce their carbon footprint through small everyday actions and AI-personalized insights.

Built for Challenge 3 of PromptWars: Virtual — a bi-weekly hackathon focused on intent-driven, AI-native development using Google Antigravity.

🔗 Live Demo: carbon-footprint-sandy-eta.vercel.app
📂 Repository: github.com/Himanshu-29-tech/carbon-footprint


📌 Problem Statement


"Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights."



Most people want to live more sustainably but don't know where to start, how big their actual impact is, or what specific changes would matter most for their lifestyle. EcoTrack solves this by turning a few simple questions into a clear, personalized picture of someone's environmental impact — and a realistic path to improve it.


✨ Features


🧭 Quick Onboarding Quiz — A short, friendly set of questions covering commute habits, diet, home energy use, and shopping patterns.
📊 Personal Carbon Dashboard — Instantly calculates an estimated monthly carbon footprint (in kg CO₂) and displays it with a clear, easy-to-read visual.
💡 Personalized Insights — Generates actionable, non-judgmental tips tailored to the user's specific habits (e.g., suggesting carpooling for daily drivers, or a meatless day for high meat consumption).
✅ Daily Action Log — Lets users check off small sustainable actions they completed each day and see their estimated impact update.
🔥 Streak Tracking — Encourages consistency through a simple streak counter, keeping the experience motivating rather than guilt-driven.
📱 Fully Responsive — Works smoothly across desktop and mobile devices.



🎯 Design Philosophy

EcoTrack is built to feel like a supportive coach, not a guilt trip. The tone throughout is encouraging and judgment-free — the goal is to make sustainability feel achievable, not overwhelming. The visual design uses an earthy, natural color palette (deep greens, warm neutrals) with clean, spacious typography inspired by premium digital product design.


🛠️ Tech Stack

LayerTechnologyFrontendHTML5, CSS3, JavaScript (Vanilla)Hosting / DeploymentVercelVersion ControlGit & GitHubBuild ToolGoogle Antigravity (AI-native / intent-driven development)

No backend or database is used — the app runs fully client-side, with realistic mock data and calculations powering the dashboard end to end.


🧮 How It Works


User completes the onboarding quiz — answering a handful of lifestyle questions.
EcoTrack calculates an estimated footprint — using simplified emission-factor logic based on commute type, diet, energy use, and shopping habits.
Dashboard renders the results — showing the estimate alongside a comparison to an average footprint.
Personalized tips are generated — matched directly to the user's quiz answers.
Daily actions are logged — small completed actions slightly adjust the user's footprint estimate and build their streak.



📂 Project Structure

carbon-footprint/
├── index.html          # Main entry point
├── style.css            # Styling (green/natural theme)
├── script.js             # App logic (quiz, calculations, dashboard, actions)
├── assets/               # Images, icons, illustrations
└── README.md             # Project documentation

(Update this section if your actual file/folder names differ.)


🚀 Getting Started Locally

No build step or dependencies required — it's plain HTML/CSS/JS.

bash# Clone the repository
git clone https://github.com/Himanshu-29-tech/carbon-footprint.git

# Move into the project folder
cd carbon-footprint

# Open index.html directly in your browser
open index.html


📦 Deployment

This project is deployed on Vercel as a static site — no build configuration needed.

To redeploy after changes:

bashgit add .
git commit -m "Update"
git push

Vercel automatically redeploys on every push to the main/master branch.


🔮 Future Scope


Integrate real-world emission factor APIs for more accurate calculations
Add user accounts to persist data across sessions
Weekly/monthly footprint trend charts
Social sharing of milestones and streaks
Localization for region-specific carbon estimates (e.g., different electricity grid emission factors by country)



🏆 About PromptWars: Virtual

This project was built as part of PromptWars: Virtual — a bi-weekly virtual hackathon where participants use Google Antigravity to build functional, real-world applications through intent-driven, AI-native development rather than manual coding.

Challenge 3 focused on sustainability and personal carbon footprint tracking.


👤 Author

Himanshu Yadav


GitHub: @Himanshu-29-tech
Building in public — documenting the journey through blog posts and social media.



📄 License

This project is open source and available for learning purposes.
