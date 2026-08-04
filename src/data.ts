// ---------------------------------------------------------------------------
// EDIT THIS FILE to update your portfolio content. Everything the site shows
// (except the live GitHub feed) comes from here.
// ---------------------------------------------------------------------------

export const GITHUB_USERNAME = "Dev123dahiya";

// Company/school logos load from a logo service by domain, with a monogram
// fallback if the logo can't be fetched.
export const logoFor = (domain: string) => `https://logo.clearbit.com/${domain}`;
// A repo's GitHub social-preview image (real screenshot-style card from GitHub).
export const repoImage = (repo: string) =>
  `https://opengraph.githubassets.com/main/${GITHUB_USERNAME}/${repo}`;

export const profile = {
  name: "Dev Kumar Dahiya",
  title: "Full-Stack Software Developer & Applied ML",
  tagline:
    "I build full-stack web applications and applied machine-learning systems end to end, from API design and real-time backends to deep-learning pipelines.",
  location: "Gurugram, India",
  // Your photo from Google Drive. The site tries these in order until one loads.
  // If you'd rather host it locally, drop the file at public/profile.jpg and put
  // "/profile.jpg" first in this list.
  photoCandidates: [
    "https://lh3.googleusercontent.com/d/1vVinkB7RzjKnjgFL6vbwbK9SMP1jPJSz=w1000",
    "https://drive.google.com/thumbnail?id=1vVinkB7RzjKnjgFL6vbwbK9SMP1jPJSz&sz=w1000",
    `https://github.com/${GITHUB_USERNAME}.png`,
  ],
  photoFallback: "/profile-fallback.svg",
  email: "devdahiya4002@gmail.com",
  phone: "+91 74045 12322",
  resumeUrl: "/Dev_Kumar_Dahiya_Resume.pdf",
  // Optional: paste a Formspree endpoint (https://formspree.io/f/xxxx) to receive
  // messages in your inbox. Leave empty to open the visitor's email client instead.
  formEndpoint: "",
  socials: {
    github: `https://github.com/${GITHUB_USERNAME}`,
    linkedin: "https://linkedin.com/in/devkumardahiya",
  },
};

export const about =
  "Software engineer focused on building production-quality web and AI systems: scalable backends, cloud-native deployments, and performant frontends. Experienced in React, Node.js, C#, and data/ML pipelines. I deliver reliable systems, ship features end-to-end, and mentor cross-functional teams to production.";

export let stats = [
  { label: "Projects", value: "0", suffix: "+" },
  { label: "Experience (internships)", value: "2", suffix: "+" },
  { label: "GitHub contributions", value: "500", suffix: "+" },
  { label: "Publications", value: "1", suffix: "" },
];

export const experience = [
  {
    role: "Full-Stack Software Developer",
    org: "ethara.ai",
    domain: "ethara.ai",
    url: "https://www.ethara.ai/",
    location: "Gurugram, India",
    period: "May 2026 - Present",
    // Local or hosted image for the company (place file at public/ethara.jpg)
    image: "/ethara.jpg",
    points: [
      "Build and ship full-stack features across a React/TypeScript frontend and a Node.js backend, owning work from API design through UI delivery.",
      "Develop and integrate REST APIs and database models, and collaborate through code reviews and deployments in an AI product environment.",
      "Improve application performance and reliability while contributing to architecture decisions for new features.",
    ],
  },
  {
    role: "Associate Software Engineer Intern",
    org: "MAQ Software",
    domain: "maqsoftware.com",
    url: "https://maqsoftware.com/",
    location: "Noida, India",
    period: "Nov 2025 - Feb 2026",
    // Local or hosted image for MAQ (place file at public/maq.jpg)
    image: "/maq.jpg",
    points: [
      "Built and optimized backend services in C# and ASP.NET, improving reliability and scalability of business-facing applications.",
      "Designed interactive Power BI dashboards turning raw operational data into decision-ready business-intelligence views.",
      "Engineered data workflows in Microsoft Fabric and Azure Data Factory to consolidate analytics-ready datasets.",
    ],
  },
  {
    role: "Artificial Intelligence Intern",
    org: "Horizon 17 Technologies",
    domain: "horizon17ww.com",
    url: "http://www.horizon17ww.com/",
    location: "Gurugram, India",
    period: "May 2025 - Jul 2025",
    points: [
      "Designed an AI system that reads invoices and estimates the carbon emissions tied to each, automating a manual assessment.",
      "Integrated GROQ-served LLMs to extract and interpret structured and unstructured data from uploaded documents.",
      "Built a pipeline that converts extracted data into carbon-usage metrics and clear environmental insights.",
    ],
  },
];

export interface Project {
  name: string;
  blurb: string;
  tags: string[];
  image: string;      // real photo from the web (primary)
  cover: string;      // illustration fallback if the photo fails
  repo?: string;      // GitHub repo name (enables the live preview image)
  github?: string;
  live?: string;
  accent: [string, string]; // gradient for the generated cover
}

// Projects from GitHub (github.com/Dev123dahiya). Each links to its real repo
// and shows the repo's live GitHub preview image over a themed photo.
const P = "?auto=format&fit=crop&w=1000&q=70";
const gh = (repo: string) => `https://github.com/${GITHUB_USERNAME}/${repo}`;

export const featured: Project[] = [
  {
    name: "Deepfake Audio Detection",
    image: "https://images.unsplash.com/photo-1780723131289-c2ac00c07ea1" + P,
    cover: "/covers/deepvoice.svg",
    blurb:
      "Deep-learning system that flags spoofed (deepfake) audio from spectrogram features. The research direction behind my ICICC 2026 paper reporting 99.33% accuracy.",
    tags: ["Python", "Jupyter", "Deep Learning", "Audio"],
    repo: "Foreign-seek-deepfake-audio-detection",
    github: gh("Foreign-seek-deepfake-audio-detection"),
    accent: ["#7C5CFC", "#EC4899"],
  },
  {
    name: "Forest Fire Detection",
    image: "https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6" + P,
    cover: "/covers/fire.svg",
    blurb:
      "Convolutional neural network that detects forest fires from imagery, aimed at fast early-warning classification.",
    tags: ["Python", "Jupyter", "CNN", "Computer Vision"],
    repo: "Forest-Fire-Detection",
    github: gh("Forest-Fire-Detection"),
    accent: ["#F59E0B", "#EC4899"],
  },
  {
    name: "Malware Detection",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" + P,
    cover: "/covers/security.svg",
    blurb:
      "Machine-learning model that classifies software as malicious or benign from extracted features, applied to security screening.",
    tags: ["Python", "Jupyter", "Machine Learning", "Security"],
    repo: "Malware-Detection",
    github: gh("Malware-Detection"),
    accent: ["#EC4899", "#7C5CFC"],
  },
  {
    name: "QR Detection System",
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf" + P,
    cover: "/covers/qr.svg",
    blurb:
      "Computer-vision system that detects and decodes QR codes from images and a live camera feed.",
    tags: ["Python", "OpenCV", "Computer Vision"],
    repo: "QR-Detection-System",
    github: gh("QR-Detection-System"),
    accent: ["#5B8DEF", "#7C5CFC"],
  },
  {
    name: "QR Toolkit",
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf" + P,
    cover: "/covers/qr.svg",
    blurb:
      "A web-based toolkit for generating and working with QR codes, built with a lightweight HTML and JavaScript frontend.",
    tags: ["HTML", "JavaScript", "QR"],
    repo: "QR-things",
    github: gh("QR-things"),
    accent: ["#22D3EE", "#5B8DEF"],
  },
  {
    name: "Weather Explorer",
    image: "https://images.unsplash.com/photo-1603437873662-dc1f44901825" + P,
    cover: "/covers/weather.svg",
    blurb:
      "Weather data exploration and visualization notebook that pulls conditions and charts trends over time.",
    tags: ["Python", "Jupyter", "Pandas", "Data Viz"],
    repo: "weather",
    github: gh("weather"),
    accent: ["#5B8DEF", "#22D3EE"],
  },
];

// Ensure stats projects count reflects featured array length (avoid forward reference)
stats[0].value = String(featured.length);

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Java", "Python", "C++", "C#", "JavaScript", "TypeScript", "SQL"] },
  { group: "Frameworks", items: ["React", "Node.js", "Express", "ASP.NET", "FastAPI", "Flask"] },
  { group: "AI / ML", items: ["PyTorch", "OpenCV", "CNN", "BiLSTM + Attention", "LLMs (GROQ)", "NumPy", "Pandas"] },
  { group: "Data & Cloud", items: ["Azure", "Azure Data Factory", "Microsoft Fabric", "Power BI", "PySpark", "GCP"] },
  { group: "Databases", items: ["MongoDB", "MongoDB Atlas", "SQL"] },
  { group: "Dev & Infra", items: ["Git", "Docker", "Docker Compose", "Socket.IO", "JWT"] },
];

export const publication = {
  title: "Forensic Deepfake Audio Detection Using a CNN-Attention Mechanism",
  venue: "International Conference on Intelligent Computing and Communication (ICICC 2026)",
  date: "Feb 2026",
  points: [
    "Combined mel-spectrogram and MFCC features with a BiLSTM + Attention architecture for robust audio analysis.",
    "Achieved 99.33% accuracy across multiple accents, enabling real-time cross-lingual deepfake detection.",
  ],
};

export const education = {
  school: "Amity University",
  domain: "amity.edu",
  location: "Noida, Uttar Pradesh",
  degree: "B.Tech, Computer Science",
  detail: "CGPA 8.60",
  period: "Aug 2022 - May 2026",
  // Optional: path to a local or hosted image for the school (place file in public/)
  // Example: "/education.jpg"
  image: "/education.jpg",
};
