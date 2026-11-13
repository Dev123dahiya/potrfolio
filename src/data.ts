// ---------------------------------------------------------------------------
// Everything the site says lives in this file. Edit it to update the portfolio.
// ---------------------------------------------------------------------------

export const GITHUB_USERNAME = 'Dev123dahiya';
const gh = (repo: string) => `https://github.com/${GITHUB_USERNAME}/${repo}`;

export const profile = {
  name: 'Dev Kumar Dahiya',
  role: 'Software Developer at Ethara AI',
  location: 'Gurugram, India',
  headline: 'I build the backend systems and LLM pipelines behind real products.',
  intro:
    'Right now that means REST APIs that bring LLM features into live products at Ethara AI. Before that I built data pipelines on Microsoft Fabric at MAQ Software, a Generative AI invoice reader at Horizon17, and co-authored a Springer paper on spotting AI-generated voices.',
  // The photo loads from Google Drive. To host it yourself, put the file at
  // public/profile.jpg and add '/profile.jpg' as the first entry.
  photoCandidates: [
    'https://lh3.googleusercontent.com/d/1vVinkB7RzjKnjgFL6vbwbK9SMP1jPJSz=w600',
    'https://drive.google.com/thumbnail?id=1vVinkB7RzjKnjgFL6vbwbK9SMP1jPJSz&sz=w600',
  ],
  email: 'devdahiya4002@gmail.com',
  resumeUrl: '/Dev_Kumar_Dahiya_Resume.pdf',
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: 'https://www.linkedin.com/in/devkumardahiya',
  openTo: 'Open to Software Engineer, AI/ML Engineer, Backend and Data Engineer roles, on-site, hybrid or remote.',
};

export type Area = 'AI & LLMs' | 'Backend & full stack' | 'Data';

export interface Project {
  name: string;
  repo: string;
  area: Area;
  summary: string;
  stack: string[];
  /** Screenshot in public/projects. */
  image: string;
  /** What the screenshot shows, printed on the image frame. */
  shot: string;
  live?: string;
}

// The featured project gets the large slot at the top of "Selected work".
export const featured = {
  name: 'PIE Job Agent',
  repo: gh('pie-job-agent'),
  summary:
    'A personal job-search agent. It pulls openings from public job boards, has Claude shortlist them against a verified profile, builds a tailored resume for each one and prepares the application, all tracked in a dashboard.',
  steps: [
    'Finds jobs from the Greenhouse public job-board API',
    'Claude scores and shortlists them against my real profile',
    'Builds a job-specific resume from the master resume',
    'Runs the application in a real browser as a dry run, and only submits after I confirm',
  ],
  stack: ['FastAPI', 'SQLAlchemy', 'Alembic', 'Claude API', 'Playwright', 'Next.js', 'TypeScript', 'pytest'],
  image: '/projects/pie-job-agent.webp',
  shot: 'Dashboard, running locally on a fresh database',
};

export const projects: Project[] = [
  {
    name: 'Deepfake Audio Detection',
    repo: gh('deepfake-audio-detection'),
    area: 'AI & LLMs',
    summary:
      'Classifies speech as real or AI-generated with a CNN + BiLSTM + attention model, with training, evaluation and FastAPI / Streamlit apps for inference.',
    stack: ['Python', 'TensorFlow', 'librosa', 'FastAPI', 'Streamlit'],
    image: '/projects/deepfake-audio.webp',
    shot: 'Streamlit app',
  },
  {
    name: 'OCR Bill Analyzer',
    repo: gh('Invoice_Parser'),
    area: 'AI & LLMs',
    summary:
      'Turns PDF bills and invoices into structured JSON: EasyOCR reads the page, then Groq and Gemini LLMs extract the fields, behind a FastAPI API.',
    stack: ['Python', 'FastAPI', 'EasyOCR', 'Gemini', 'Groq'],
    image: '/projects/ocr-bill-analyzer.webp',
    shot: 'Upload screen',
  },
  {
    name: 'OrbitX',
    repo: gh('OrbitX'),
    area: 'AI & LLMs',
    summary:
      'Batch document pipeline that spots invoices and contracts, extracts typed fields and a summary with an LLM, validates them and writes JSON.',
    stack: ['Python', 'OpenAI API', 'Pydantic', 'PyMuPDF'],
    image: '/projects/orbitx.webp',
    shot: 'Real output from a run: output/results.json',
  },
  {
    name: 'LLM Prompt & Response Evaluator',
    repo: gh('prompt-response-evaluator'),
    area: 'AI & LLMs',
    summary:
      'REST API where users submit prompts, attach model responses, get them scored automatically and track the results over time.',
    stack: ['Django REST Framework', 'PostgreSQL', 'JWT', 'NumPy', 'Pandas'],
    image: '/projects/prompt-evaluator.webp',
    shot: 'The scoring engine run on a sample answer',
  },
  {
    name: 'BIOMED XPERT CRM',
    repo: gh('biomed-xpert-crm'),
    area: 'Backend & full stack',
    summary:
      'Lead and sales tracker for a biomedical equipment business, with a six-stage pipeline and Excel, CSV and PDF exports.',
    stack: ['TypeScript', 'React', 'Express', 'Prisma', 'Docker'],
    image: '/projects/biomed-crm.webp',
    shot: 'Sign-in screen',
  },
  {
    name: 'Leave Request Management',
    repo: gh('leave-management-system'),
    area: 'Backend & full stack',
    summary: 'Full-stack leave requests and approvals with JWT login and role-based access.',
    stack: ['React', 'Express', 'MongoDB', 'JWT'],
    image: '/projects/leave-management.webp',
    shot: 'Sign-in screen',
  },
  {
    name: 'Smart Hospital Management',
    repo: gh('Smart-Hospital-Management-System'),
    area: 'Backend & full stack',
    summary:
      'Hospital workflow app with role-based logins for admins, doctors and patients, appointments, prescriptions, reports and emergency alerts.',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    image: '/projects/smart-hospital.webp',
    shot: 'Sign-in screen',
  },
  {
    name: 'Emotion-Based Music Recommender',
    repo: gh('emotion-based-music-recommender'),
    area: 'AI & LLMs',
    summary: 'Reads your facial emotion from the webcam and recommends songs that match the mood.',
    stack: ['Python', 'TensorFlow', 'OpenCV', 'Streamlit'],
    image: '/projects/emotion-music.webp',
    shot: 'Streamlit app',
  },
  {
    name: 'Test Drive Analytics Dashboard',
    repo: gh('crestwyn-test-drive-analytics-dashboard'),
    area: 'Data',
    summary:
      'Multi-page BI dashboard covering a year of test drives, consultant performance, satisfaction and purchase conversion for a showroom.',
    stack: ['Data visualization', 'Analytics'],
    image: '/projects/test-drive-dashboard.webp',
    shot: 'Vehicle popularity page',
  },
];

export const experience = [
  {
    role: 'Software Developer',
    org: 'Ethara AI',
    url: 'https://www.ethara.ai/',
    logo: '/logos/ethara-white.png',
    logoOnDark: true,
    place: 'Gurugram',
    start: 'May 2026',
    end: 'Present',
    points: [
      'Built 8 REST APIs and backend services that add LLM features to live products.',
      'Made APIs 30% faster with better queries and caching, and raised unit-test coverage to 80%.',
      'Shipped 6 full-stack features in 2-week Agile sprints with design and product.',
    ],
  },
  {
    role: 'Associate Software Engineer Intern',
    org: 'MAQ Software',
    url: 'https://maqsoftware.com/',
    logo: '/logos/maq.png',
    logoOnDark: false,
    place: 'Noida',
    start: 'Nov 2025',
    end: 'Feb 2026',
    points: [
      'Built automated ETL pipelines in Microsoft Fabric and Azure Data Factory that load and clean 1M records.',
      'Built 5 Power BI dashboards that bring together business data from 4 sources.',
      'Wrote 10 backend APIs in C# and ASP.NET and managed Azure setups for dev and staging.',
    ],
  },
  {
    role: 'AI Intern',
    org: 'Horizon17',
    url: 'https://www.horizon17ww.com/',
    logo: '/logos/horizon17.png',
    logoOnDark: false,
    place: 'Gurugram',
    start: 'May 2025',
    end: 'Jul 2025',
    points: [
      'Built a Generative AI system that reads scanned invoices with OCR and LLMs and estimates the carbon emissions behind each one.',
      'Reached 90% extraction accuracy on 500 invoices by improving prompts and checking the LLM’s answers.',
      'Built the pipeline and charts for carbon-use numbers, cutting manual data entry by 60%.',
    ],
  },
];

export const publication = {
  title: 'Forensic Deepfake Audio Detection Using CNN-Attention Mechanism',
  venue: 'ICICC 2026, Springer Lecture Notes in Networks and Systems (Innovative Computing and Communications)',
  url: 'https://link.springer.com/chapter/10.1007/978-3-032-28594-2_9',
  summary:
    'We trained a CNN + BiLSTM model with attention on MFCC and Mel-spectrogram features to tell real voices from AI-generated ones. It reached 99.33% accuracy on 10,000 audio clips across accents.',
  repo: gh('deepfake-audio-detection'),
  publisherLogo: '/logos/springer-white.png',
};

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'SQL', 'C#', 'TypeScript', 'JavaScript', 'C++'] },
  { group: 'AI & LLMs', items: ['LLM APIs (Claude, OpenAI, Groq, Gemini)', 'RAG and agents', 'Prompt engineering', 'PyTorch', 'TensorFlow', 'OpenCV', 'OCR'] },
  { group: 'Backend & web', items: ['FastAPI', 'Django REST Framework', 'ASP.NET', 'Node.js and Express', 'React', 'Next.js', 'REST APIs', 'JWT auth'] },
  { group: 'Data & cloud', items: ['PostgreSQL', 'MongoDB', 'Microsoft Azure', 'Azure Data Factory', 'Microsoft Fabric', 'Power BI', 'Docker', 'Git and CI/CD'] },
];

export const education = {
  degree: 'B.Tech in Computer Science and Engineering',
  school: 'Amity University, Noida',
  url: 'https://www.amity.edu/',
  logo: '/logos/amity.png',
  photo: '/img/amity-campus.jpg',
  photoCredit: 'Amity University campus, Noida. Photo: आशीष भटनागर, public domain, via Wikimedia Commons.',
  years: '2022 – 2026',
  grade: 'CGPA 8.60',
  certifications: [
    'Microsoft Certified: Fabric Data Engineer Associate (DP-700)',
    'Oracle Database certification',
    'IBM Cybersecurity Fundamentals',
  ],
};

// Logo strip under the hero: where I've worked, studied and published.
export const affiliations = [
  { name: 'Ethara AI', logo: '/logos/ethara-ink.png', height: 26 },
  { name: 'MAQ Software', logo: '/logos/maq.png', height: 24 },
  { name: 'Horizon17', logo: '/logos/horizon17.png', height: 40 },
  { name: 'Amity University', logo: '/logos/amity.png', height: 40 },
  { name: 'Springer Nature', logo: '/logos/springer.png', height: 17 },
];
