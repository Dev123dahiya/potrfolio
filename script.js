const projects = [
  {
    title: "LLM Carbon Invoice Analyzer",
    image: "assets/project-llm-invoice.svg",
    outcome: "~90% field extraction accuracy",
    summary:
      "A GROQ-powered Generative AI pipeline that analyzes invoices, extracts structured fields from PDFs, and turns them into carbon-emission insights for sustainability reporting.",
    tags: ["GROQ", "LLMs", "NLP", "Streamlit", "Pandas"],
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
    outcome: "Full-stack app with role access",
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

const otherProjects = [
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
        ${project.repoHref ? `<a class="project-link" href="${project.repoHref}" target="_blank" rel="noreferrer">GitHub repo</a>` : ""}
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
    <a class="project-link" href="${project.linkHref}" target="_blank" rel="noreferrer">View on GitHub</a>
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
