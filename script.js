const projects = [
  {
    title: "AI Workflow Design Assessment",
    image: "assets/flat50-ad-1080x1080.png",
    outcome: "PSD, AI, SVG, and final PNG included",
    summary:
      "A Flat 50% OFF social media creative built for an AI workflow hiring assessment, with attention to typography, contrast, spacing, visual hierarchy, and editable handoff files.",
    tags: ["Photoshop", "Illustrator", "Visual QA", "Hierarchy", "Dataset assets"],
    linkLabel: "View final creative",
    linkHref: "assets/flat50-ad-1080x1080.png",
    repoHref: "assets/flat50-ad.ai",
    repoLabel: "Open AI source",
    background:
      "linear-gradient(135deg, rgba(255, 63, 105, 0.78), rgba(12, 18, 34, 0.58)), radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.34), transparent 34%)",
  },
  {
    title: "Carbon Invoice Analyzer",
    image: "assets/project-llm-invoice.svg",
    outcome: "~90% field extraction accuracy",
    summary:
      "A Python document automation pipeline that analyzes invoices, extracts structured fields from PDFs, and turns them into carbon-emission insights for sustainability reporting.",
    tags: ["Python", "NLP", "Streamlit", "Pandas", "APIs"],
    linkLabel: "GitHub repo",
    linkHref: "https://github.com/Dev123dahiya/Invoice_Parser",
    background:
      "linear-gradient(135deg, rgba(255, 142, 60, 0.9), rgba(67, 33, 12, 0.35)), radial-gradient(circle at top left, rgba(255, 235, 190, 0.55), transparent 40%)",
  },
  {
    title: "Emotion-Based Music Recommendation",
    image: "assets/project-emotion-music.svg",
    outcome: "Real-time inference at 28 FPS",
    summary:
      "A CNN-based real-time facial emotion recognition system that maps detected emotions to personalized music recommendations through an interactive Streamlit app.",
    tags: ["Python", "PyTorch", "OpenCV", "CNN", "Streamlit"],
    linkLabel: "Live demo",
    linkHref: "https://emotion-based-song-recommendation-4tvs.onrender.com/",
    repoHref: "https://github.com/Dev123dahiya/Emotic-Based-Music-Recomendation-.git",
    background:
      "linear-gradient(135deg, rgba(123, 224, 214, 0.88), rgba(8, 53, 58, 0.35)), radial-gradient(circle at 20% 20%, rgba(231, 255, 251, 0.45), transparent 32%)",
  },
  {
    title: "Leave Request Management System",
    image: "assets/project-leave-system.svg",
    outcome: "Sub-2s cloud-deployed app",
    summary:
      "A full-stack leave management platform with employee and manager dashboards, JWT-based role access, REST APIs, MongoDB Atlas, and cloud deployment.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    linkLabel: "Live app",
    linkHref: "https://leave-request-management-system.vercel.app/",
    repoHref: "https://github.com/Dev123dahiya/Leave-Managment-System.git",
    background:
      "linear-gradient(135deg, rgba(222, 192, 152, 0.88), rgba(53, 38, 24, 0.38)), radial-gradient(circle at 75% 25%, rgba(255, 242, 223, 0.38), transparent 33%)",
  },
];

const roleProfiles = {
  llm: {
    title: "LLM Post-Training Intern",
    label: "Ethara AI fit",
    summary:
      "Best fit for visual dataset creation, design quality checks, reviewer collaboration, and AI post-training workflows.",
    intro:
      "This view highlights the design, dataset, and AI workflow evidence most relevant to Ethara AI's LLM Post-Training Intern role.",
    required: [
      "Image curation and visual dataset organization",
      "Photoshop and Illustrator editable file handling",
      "Typography, hierarchy, contrast, and readability review",
      "SFT, RLHF, evaluation, and quality review awareness",
      "Clear English communication with AI Ops reviewers",
    ],
    proof: [
      "Flat 50% OFF social creative with PNG, SVG, AI, and PSD files",
      "Visual QA readiness note for assessment review",
      "Invoice extraction and AI evaluation project with measurable accuracy",
      "Computer vision and deepfake research experience",
    ],
    links: [
      ["Ethara fit section", "#ethara-fit"],
      ["Open AI source", "assets/flat50-ad.ai"],
      ["Open QA note", "assets/ethara-ai-workflow-readiness.md"],
    ],
  },
  ai: {
    title: "AI Engineer",
    label: "Applied AI",
    summary:
      "Best fit for model-backed products, computer vision, NLP, evaluation, and deployed AI demos.",
    intro:
      "This view points recruiters toward projects where models, metrics, and usable applications come together.",
    required: [
      "Python, PyTorch, OpenCV, NLP, and model evaluation",
      "Feature extraction, inference, and experiment tracking habits",
      "API or app deployment around AI outputs",
      "Ability to explain accuracy, edge cases, and limitations",
      "Data preparation and validation workflows",
    ],
    proof: [
      "99.33% deepfake audio detection research",
      "Real-time emotion recognition at 28 FPS",
      "Carbon Invoice Analyzer with structured extraction",
      "Streamlit demos and production-facing AI workflows",
    ],
    links: [
      ["See AI projects", "#work"],
      ["Deepfake repo", "https://github.com/Dev123dahiya/Deepfake_Auido_Detection"],
      ["Emotion demo", "https://emotion-based-song-recommendation-4tvs.onrender.com/"],
    ],
  },
  python: {
    title: "Python Developer",
    label: "Backend and automation",
    summary:
      "Best fit for Python automation, APIs, data parsing, dashboards, and practical backend workflows.",
    intro:
      "This view emphasizes Python problem solving, automation, data handling, and deployable tools.",
    required: [
      "Python scripting, OOP, debugging, and clean code",
      "REST API integration and backend workflow thinking",
      "Pandas, data parsing, validation, and file handling",
      "Streamlit or dashboard-style application delivery",
      "Git, documentation, and maintainable project structure",
    ],
    proof: [
      "Invoice parsing pipeline with around 90% field extraction accuracy",
      "Python AI demos across NLP, CV, and audio ML",
      "Automation-heavy data and monitoring project concepts",
      "Dedicated Python resume included",
    ],
    links: [
      ["Python resume", "assets/Dev-Kumar-Dahiya-Python-Resume.pdf"],
      ["Invoice parser repo", "https://github.com/Dev123dahiya/Invoice_Parser"],
      ["More GitHub work", "#more-projects"],
    ],
  },
  data: {
    title: "Data & Cloud Intern",
    label: "Analytics and pipelines",
    summary:
      "Best fit for dashboards, ETL pipelines, Microsoft Azure, Fabric, Power BI, and reporting automation.",
    intro:
      "This view brings forward cloud data tools, reporting impact, and pipeline experience.",
    required: [
      "Power BI dashboards and business metric storytelling",
      "Azure Data Factory, Microsoft Fabric, and cloud deployment basics",
      "SQL-style thinking, data validation, and ETL workflows",
      "API optimization and reporting automation",
      "Clear handoff documents for business users",
    ],
    proof: [
      "6+ Power BI dashboards during software engineering internship",
      "Azure Data Factory and Microsoft Fabric pipeline exposure",
      "Invoice-to-CO2e reporting workflow",
      "Data systems and monitoring portfolio projects",
    ],
    links: [
      ["General resume", "assets/Dev-Kumar-Dahiya-Resume.pdf"],
      ["Experience section", "#process"],
      ["Invoice project", "#work"],
    ],
  },
  fullstack: {
    title: "Full Stack Developer",
    label: "Web applications",
    summary:
      "Best fit for React, Node.js, Express, MongoDB, authentication, deployment, and user-facing systems.",
    intro:
      "This view highlights full-stack implementation, deployment, and practical product workflows.",
    required: [
      "React components, responsive UI, and frontend state",
      "Node.js, Express, REST APIs, and authentication",
      "MongoDB data modeling and cloud database setup",
      "Deployment on Vercel or similar platforms",
      "Debugging, role access, and clean user flows",
    ],
    proof: [
      "Leave Request Management System with employee and manager dashboards",
      "JWT-based role access and MongoDB Atlas backend",
      "Sub-2s deployed app experience",
      "Portfolio site built as a static web project",
    ],
    links: [
      ["Live leave app", "https://leave-request-management-system.vercel.app/"],
      ["Leave app repo", "https://github.com/Dev123dahiya/Leave-Managment-System.git"],
      ["Software resume", "assets/Dev-Kumar-Dahiya-Rohde-Schwarz-Resume.pdf"],
    ],
  },
  iot: {
    title: "IoT Data Systems Intern",
    label: "Monitoring and automation",
    summary:
      "Best fit for sensor-style data ingestion, alerts, dashboards, and edge-to-cloud automation thinking.",
    intro:
      "This view focuses on monitoring systems, automated alerts, and practical data pipelines.",
    required: [
      "Python-based data ingestion and simulation",
      "Real-time alerts, thresholds, and monitoring dashboards",
      "Edge-to-cloud architecture awareness",
      "Sensor data cleaning, storage, and visualization",
      "Reliable documentation and operational thinking",
    ],
    proof: [
      "IoT monitoring concept with Python ingestion and alert logic",
      "Dashboard and metrics background from internship work",
      "Cloud data pipeline exposure with Azure tools",
      "Dedicated IoT and data systems resume included",
    ],
    links: [
      ["IoT resume", "assets/Dev-Kumar-Dahiya-IoT-Resume.pdf"],
      ["Experience section", "#process"],
      ["More projects", "#more-projects"],
    ],
  },
};

const otherProjects = [
  {
    title: "Visual Dataset QA Readiness",
    summary: "Portfolio evidence for image curation, design readability checks, editable file handoff, and visual hierarchy review for AI training datasets.",
    language: "Design / AI Ops",
    linkHref: "assets/flat50-ad-editable.svg",
    linkLabel: "View editable SVG",
  },
  {
    title: "IoT Data Monitoring & Automation",
    summary: "Conceptual edge-to-cloud monitoring system with simulated sensor ingestion, Python alerts, dashboard metrics, and real-time automation logic.",
    language: "Python / IoT",
    linkHref: "assets/Dev-Kumar-Dahiya-IoT-Resume.pdf",
    linkLabel: "View IoT resume",
  },
  {
    title: "Forensic Deepfake Audio Detection",
    summary: "CNN, BiLSTM, attention, MFCC, and mel-spectrogram based audio deepfake detection research.",
    language: "Python / Jupyter",
    linkHref: "https://github.com/Dev123dahiya/Deepfake_Auido_Detection",
  },
  {
    title: "Smart Hospital Management System",
    summary: "JavaScript-based hospital management project for handling healthcare workflows.",
    language: "JavaScript",
    linkHref: "https://github.com/Dev123dahiya/Smart-Hospital-Management-System",
  },
  {
    title: "OrbitX",
    summary: "Python project from your GitHub profile, grouped here as additional technical work.",
    language: "Python",
    linkHref: "https://github.com/Dev123dahiya/OrbitX",
  },
  {
    title: "Malware Detection",
    summary: "Notebook-based machine learning work focused on malware detection experimentation.",
    language: "Jupyter Notebook",
    linkHref: "https://github.com/Dev123dahiya/Malware-Detection",
  },
  {
    title: "Weather",
    summary: "Data/notebook project from your GitHub portfolio showing additional experimentation.",
    language: "Jupyter Notebook",
    linkHref: "https://github.com/Dev123dahiya/weather",
  },
  {
    title: "QR Detection System",
    summary: "QR detection and QR-related projects from your public GitHub repositories.",
    language: "HTML / Web",
    linkHref: "https://github.com/Dev123dahiya/QR-Detection-System",
  },
];

const roleButtons = document.querySelectorAll(".role-option");
const roleSummary = document.querySelector("#role-summary");
const selectedRoleLabel = document.querySelector("#selected-role-label");
const selectedRoleTitle = document.querySelector("#selected-role-title");
const selectedRoleFit = document.querySelector("#selected-role-fit");
const requiredSkills = document.querySelector("#required-skills");
const appliedProof = document.querySelector("#applied-proof");
const roleLinks = document.querySelector("#role-links");

const renderRoleProfile = (roleKey) => {
  const profile = roleProfiles[roleKey] || roleProfiles.llm;

  roleButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.role === roleKey);
  });

  roleSummary.textContent = profile.intro;
  selectedRoleLabel.textContent = profile.label;
  selectedRoleTitle.textContent = profile.title;
  selectedRoleFit.textContent = profile.summary;
  requiredSkills.innerHTML = profile.required.map((skill) => `<li>${skill}</li>`).join("");
  appliedProof.innerHTML = profile.proof.map((proof) => `<li>${proof}</li>`).join("");
  roleLinks.innerHTML = profile.links
    .map(([label, href]) => {
      const opensNewTab = href.startsWith("http") || href.startsWith("assets/");
      return `<a href="${href}" ${opensNewTab ? 'target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
    })
    .join("");
};

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderRoleProfile(button.dataset.role);
  });
});

renderRoleProfile("llm");

const projectGrid = document.querySelector("#project-grid");

projects.forEach((project) => {
  const card = document.createElement("article");
  card.className = "project-card";
  card.innerHTML = `
    <div class="project-visual" style="background:${project.background};">
      <img src="${project.image}" alt="${project.title} project visual" loading="lazy">
      <span>${project.outcome}</span>
    </div>
    <div class="project-copy">
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="project-meta">
        ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <div class="project-actions">
        <a class="project-link" href="${project.linkHref}" target="${project.linkHref.startsWith("http") || project.linkHref.endsWith(".pdf") ? "_blank" : "_self"}" rel="noreferrer">${project.linkLabel}</a>
        ${project.repoHref ? `<a class="project-link" href="${project.repoHref}" target="_blank" rel="noreferrer">${project.repoLabel || "GitHub repo"}</a>` : ""}
      </div>
    </div>
  `;
  projectGrid.appendChild(card);
});

const otherProjectGrid = document.querySelector("#other-project-grid");

otherProjects.forEach((project) => {
  const card = document.createElement("article");
  card.className = "other-project-card";
  card.innerHTML = `
    <span>${project.language}</span>
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <a class="project-link" href="${project.linkHref}" target="_blank" rel="noreferrer">${project.linkLabel || "View on GitHub"}</a>
  `;
  otherProjectGrid.appendChild(card);
});

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});
