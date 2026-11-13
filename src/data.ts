// ---------------------------------------------------------------------------
// Everything the site says lives in this file. Edit it to update the portfolio.
// ---------------------------------------------------------------------------

export const GITHUB_USERNAME = 'Dev123dahiya';
const gh = (repo: string) => `https://github.com/${GITHUB_USERNAME}/${repo}`;

// Files in public/. Prefixing with Vite's base keeps them working whether the
// site is served from a domain root or from a sub-path such as /potrfolio/.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const profile = {
  name: 'Dev Kumar Dahiya',
  role: 'Software Developer at Ethara AI',
  location: 'Gurugram, India',
  headline: 'I build the backend systems and LLM pipelines behind real products.',
  intro:
    'Right now that means REST APIs that bring LLM features into live products at Ethara AI. Before that I built data pipelines on Microsoft Fabric at MAQ Software, a Generative AI invoice reader at Horizon17, and co-authored a Springer paper on spotting AI-generated voices.',
  email: 'devdahiya4002@gmail.com',
  resumeUrl: asset('Dev_Kumar_Dahiya_Resume.pdf'),
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: 'https://www.linkedin.com/in/devkumardahiya',
  openTo: 'Open to Software Engineer, AI/ML Engineer, Backend and Data Engineer roles, on-site, hybrid or remote.',
};

export type Area = 'AI & LLMs' | 'Backend & full stack' | 'Data' | 'Cloud & security';

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
  image: asset('projects/pie-job-agent.webp'),
  shot: 'Dashboard, running locally on a fresh database',
};

// Order matters: the gallery shows the first nine until the visitor asks for the rest.
export const projects: Project[] = [
  {
    name: 'Mini SQL Engine',
    repo: gh('mini-sql-engine'),
    area: 'Data',
    summary:
      'A SQL engine in pure Python: lexer, parser, a planner that pushes filters down and picks indexes and join algorithms, and an executor. Its answers are checked against SQLite.',
    stack: ['Python', 'Query planning', 'Hash joins', 'Indexes', 'SQLite (as the reference)'],
    image: asset('projects/mini-sql-engine.webp'),
    shot: 'Real output: python -m minisql',
  },
  {
    name: 'RAG Knowledge Assistant',
    repo: gh('rag-knowledge-assistant'),
    area: 'AI & LLMs',
    summary:
      'Question answering over documents, built from its parts: heading-aware chunking, keyword and vector retrieval fused together, answers that must cite sources, and an evaluation against labelled questions.',
    stack: ['Python', 'NumPy', 'BM25', 'Vector search', 'Retrieval evaluation'],
    image: asset('projects/rag-knowledge-assistant.webp'),
    shot: 'Real output: python -m ragkit eval',
  },
  {
    name: 'Distributed Job Queue',
    repo: gh('distributed-job-queue'),
    area: 'Backend & full stack',
    summary:
      'A durable background-job queue on SQLite that several worker processes share safely. Handles crashed workers, retries with backoff, poison jobs and duplicate submissions.',
    stack: ['Python', 'SQLite', 'Concurrent workers', 'Retries', 'Idempotency'],
    image: asset('projects/distributed-job-queue.webp'),
    shot: 'Real output: python -m jobqueue demo',
  },
  {
    name: 'Auth Service',
    repo: gh('auth-service'),
    area: 'Cloud & security',
    summary:
      'The core of a login system using only the Python standard library: scrypt passwords, signed access tokens, rotating refresh tokens that detect theft, two-factor codes, lockout and role-based permissions.',
    stack: ['Python', 'JWT', 'TOTP (RFC 6238)', 'scrypt', 'RBAC'],
    image: asset('projects/auth-service.webp'),
    shot: 'Real output: python -m authsvc',
  },
  {
    name: 'Deepfake Audio Detection',
    repo: gh('deepfake-audio-detection'),
    area: 'AI & LLMs',
    summary:
      'Classifies speech as real or AI-generated with a CNN + BiLSTM + attention model, with training, evaluation and FastAPI / Streamlit apps for inference.',
    stack: ['Python', 'TensorFlow', 'librosa', 'FastAPI', 'Streamlit'],
    image: asset('projects/deepfake-audio.webp'),
    shot: 'Streamlit app',
  },
  {
    name: 'LLM Gateway',
    repo: gh('llm-gateway'),
    area: 'AI & LLMs',
    summary:
      'One front door for several LLM providers: fallback with circuit breakers, response caching, personal-data masking before a prompt leaves, prompt-injection screening and per-team budgets. Demo runs on scripted providers.',
    stack: ['Python', 'Circuit breaker', 'Caching', 'PII redaction', 'Cost tracking'],
    image: asset('projects/llm-gateway.webp'),
    shot: 'Real output: python -m gateway',
  },
  {
    name: 'DuckDB ELT Pipeline',
    repo: gh('duckdb-elt-pipeline'),
    area: 'Data',
    summary:
      'An incremental data pipeline on DuckDB: raw files land untouched, SQL validates and models them, bad rows go to quarantine, and nothing reaches the reporting tables unless data-quality checks pass.',
    stack: ['Python', 'DuckDB', 'SQL', 'Slowly changing dimensions', 'Data quality checks'],
    image: asset('projects/duckdb-elt-pipeline.webp'),
    shot: 'Real output: python -m eltpipe demo',
  },
  {
    name: 'Realtime Chat Server',
    repo: gh('realtime-chat-server'),
    area: 'Backend & full stack',
    summary:
      'A WebSocket chat server: rooms, presence, typing indicators, replay of missed messages after a dropped connection, rate limits, and a pub/sub layer so several server processes act as one.',
    stack: ['TypeScript', 'Node.js', 'WebSockets', 'Pub/sub'],
    image: asset('projects/realtime-chat-server.webp'),
    shot: 'Real output: npm test',
  },
  {
    name: 'BIOMED XPERT CRM',
    repo: gh('biomed-xpert-crm'),
    area: 'Backend & full stack',
    summary:
      'Lead and sales tracker for a biomedical equipment business, with a six-stage pipeline and Excel, CSV and PDF exports.',
    stack: ['TypeScript', 'React', 'Express', 'Prisma', 'Docker'],
    image: asset('projects/biomed-crm.webp'),
    shot: 'Sign-in screen',
  },
  {
    name: 'Kubernetes Microservices Deploy',
    repo: gh('k8s-microservices-deploy'),
    area: 'Cloud & security',
    summary:
      'Three services and the Helm chart that runs them: health probes, graceful shutdown, locked-down pods, autoscaling and network policies. CI installs it on a real cluster and checks that restarts drop no requests.',
    stack: ['Kubernetes', 'Helm', 'Docker', 'GitHub Actions', 'Python'],
    image: asset('projects/k8s-microservices-deploy.webp'),
    shot: 'Real output from the CI run on a live cluster',
  },
  {
    name: 'Observability Kit',
    repo: gh('observability-kit'),
    area: 'Cloud & security',
    summary:
      'Metrics in the Prometheus format, distributed traces with W3C trace context, structured logs tied to traces, and error-budget alerts that page only when two time windows agree. Demo is a simulated incident.',
    stack: ['Python', 'Prometheus format', 'Distributed tracing', 'SLO alerting'],
    image: asset('projects/observability-kit.webp'),
    shot: 'Real output: python -m obskit',
  },
  {
    name: 'Secret Scanner',
    repo: gh('secret-scanner'),
    area: 'Cloud & security',
    summary:
      'Finds credentials committed to a codebase and dependencies with known security holes. Supports a baseline for old findings, output for GitHub code scanning, and fails CI on anything new.',
    stack: ['Python', 'Entropy detection', 'SARIF', 'CI gating'],
    image: asset('projects/secret-scanner.webp'),
    shot: 'Real output: python -m secretscan demo',
  },
  {
    name: 'Infra Policy Linter',
    repo: gh('infra-policy-linter'),
    area: 'Cloud & security',
    summary:
      'Checks Dockerfiles and Kubernetes manifests for risky settings such as running as root, baked-in secrets and missing limits. 18 rules with file, line and reason, and a CI exit code.',
    stack: ['Python', 'Docker', 'Kubernetes', 'YAML', 'Policy as code'],
    image: asset('projects/infra-policy-linter.webp'),
    shot: 'Real output: python -m policylint examples/bad',
  },
  {
    name: 'Vector Search Engine',
    repo: gh('vector-search-engine'),
    area: 'AI & LLMs',
    summary:
      'The HNSW index used inside vector databases, written from scratch, with an exact baseline and a benchmark of accuracy against work done, including the case where it breaks down.',
    stack: ['Python', 'NumPy', 'HNSW', 'Benchmarking'],
    image: asset('projects/vector-search-engine.webp'),
    shot: 'Real output: python -m vecsearch',
  },
  {
    name: 'OCR Bill Analyzer',
    repo: gh('Invoice_Parser'),
    area: 'AI & LLMs',
    summary:
      'Turns PDF bills and invoices into structured JSON: EasyOCR reads the page, then Groq and Gemini LLMs extract the fields, behind a FastAPI API.',
    stack: ['Python', 'FastAPI', 'EasyOCR', 'Gemini', 'Groq'],
    image: asset('projects/ocr-bill-analyzer.webp'),
    shot: 'Upload screen',
  },
  {
    name: 'Event-Sourced Ledger',
    repo: gh('event-sourced-ledger'),
    area: 'Backend & full stack',
    summary:
      'A double-entry accounting ledger where an append-only event log is the only source of truth. Balances are a cache that can be deleted and rebuilt from the log.',
    stack: ['Python', 'SQLite', 'Event sourcing', 'Double-entry accounting'],
    image: asset('projects/event-sourced-ledger.webp'),
    shot: 'Real output: python -m ledger',
  },
  {
    name: 'Churn ML Pipeline',
    repo: gh('churn-ml-pipeline'),
    area: 'Data',
    summary:
      'What comes after model.fit: input validation, leak-free training, calibrated probabilities, a decision threshold chosen from business costs, a model registry with a promotion gate, and drift monitoring. Uses synthetic data.',
    stack: ['Python', 'scikit-learn', 'pandas', 'Model registry', 'Drift monitoring'],
    image: asset('projects/churn-ml-pipeline.webp'),
    shot: 'Real output: python -m churnml',
  },
  {
    name: 'Agent Tool Runtime',
    repo: gh('agent-tool-runtime'),
    area: 'AI & LLMs',
    summary:
      'A strict runtime for tool-using LLM agents. It validates every tool call, blocks actions that need approval, caps the number of steps, records each step and can replay a run exactly. Demo runs on a scripted model.',
    stack: ['Python', 'Tool calling', 'Guardrails', 'Replayable traces'],
    image: asset('projects/agent-tool-runtime.webp'),
    shot: 'Real output: python -m agentrt',
  },
  {
    name: 'LLM Eval Harness',
    repo: gh('llm-eval-harness'),
    area: 'AI & LLMs',
    summary:
      'Evaluates LLM outputs with statistics attached: confidence intervals on every score, a significance test between two versions, and a regression gate that fails CI only when a drop is unlikely to be noise.',
    stack: ['Python', 'Bootstrap intervals', 'McNemar test', 'CI gating'],
    image: asset('projects/llm-eval-harness.webp'),
    shot: 'Real output: python -m evalkit demo',
  },
  {
    name: 'Stream Windowing Engine',
    repo: gh('stream-windowing-engine'),
    area: 'Data',
    summary:
      'Event-time aggregation for streams that arrive out of order: tumbling, sliding and session windows, watermarks, corrections for late data, and checkpoints that resume without double-counting.',
    stack: ['Python', 'Stream processing', 'Watermarks', 'Checkpointing'],
    image: asset('projects/stream-windowing-engine.webp'),
    shot: 'Real output: python -m streamwin',
  },
  {
    name: 'URL Shortener Service',
    repo: gh('url-shortener-service'),
    area: 'Backend & full stack',
    summary:
      'The system-design interview answer, actually built and measured: unique short codes, sharding with consistent hashing, a read cache, and tests for each part.',
    stack: ['Python', 'Consistent hashing', 'LRU cache', 'Sharding'],
    image: asset('projects/url-shortener-service.webp'),
    shot: 'Real output: python -m shortener',
  },
  {
    name: 'Rate Limiter Lab',
    repo: gh('rate-limiter-lab'),
    area: 'Backend & full stack',
    summary:
      'Four rate-limiting algorithms behind one interface, middleware for FastAPI and Starlette, and a benchmark against a client that bursts at window edges to show which ones let extra traffic through.',
    stack: ['Python', 'ASGI middleware', 'Token bucket', 'Sliding window'],
    image: asset('projects/rate-limiter-lab.webp'),
    shot: 'Real output: python -m bench.run',
  },
  {
    name: 'Recommender Engine',
    repo: gh('recsys-engine'),
    area: 'Data',
    summary:
      'Three recommenders for click and purchase data written from scratch, with an offline evaluation that holds out each user\'s last interaction and tunes on a separate validation split. Uses synthetic data.',
    stack: ['Python', 'NumPy', 'Matrix factorisation (ALS)', 'Item kNN', 'Ranking metrics'],
    image: asset('projects/recsys-engine.webp'),
    shot: 'Real output: python -m recsys',
  },
  {
    name: 'OrbitX',
    repo: gh('OrbitX'),
    area: 'AI & LLMs',
    summary:
      'Batch document pipeline that spots invoices and contracts, extracts typed fields and a summary with an LLM, validates them and writes JSON.',
    stack: ['Python', 'OpenAI API', 'Pydantic', 'PyMuPDF'],
    image: asset('projects/orbitx.webp'),
    shot: 'Real output from a run: output/results.json',
  },
  {
    name: 'LLM Prompt & Response Evaluator',
    repo: gh('prompt-response-evaluator'),
    area: 'AI & LLMs',
    summary:
      'REST API where users submit prompts, attach model responses, get them scored automatically and track the results over time.',
    stack: ['Django REST Framework', 'PostgreSQL', 'JWT', 'NumPy', 'Pandas'],
    image: asset('projects/prompt-evaluator.webp'),
    shot: 'The scoring engine run on a sample answer',
  },
  {
    name: 'Smart Hospital Management',
    repo: gh('Smart-Hospital-Management-System'),
    area: 'Backend & full stack',
    summary:
      'Hospital workflow app with role-based logins for admins, doctors and patients, appointments, prescriptions, reports and emergency alerts.',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    image: asset('projects/smart-hospital.webp'),
    shot: 'Sign-in screen',
  },
  {
    name: 'Leave Request Management',
    repo: gh('leave-management-system'),
    area: 'Backend & full stack',
    summary: 'Full-stack leave requests and approvals with JWT login and role-based access.',
    stack: ['React', 'Express', 'MongoDB', 'JWT'],
    image: asset('projects/leave-management.webp'),
    shot: 'Sign-in screen',
  },
  {
    name: 'Team Task Manager',
    repo: gh('taskflow-pro'),
    area: 'Backend & full stack',
    summary:
      'Full-stack task manager: admins create projects and assign work, members update their own tasks, with a dashboard of totals, overdue items and filters.',
    stack: ['React', 'Tailwind CSS', 'Express', 'MongoDB', 'JWT'],
    image: asset('projects/team-task-manager.webp'),
    shot: 'Sign-in screen',
  },
  {
    name: 'Emotion-Based Music Recommender',
    repo: gh('emotion-based-music-recommender'),
    area: 'AI & LLMs',
    summary: 'Reads your facial emotion from the webcam and recommends songs that match the mood.',
    stack: ['Python', 'TensorFlow', 'OpenCV', 'Streamlit'],
    image: asset('projects/emotion-music.webp'),
    shot: 'Streamlit app',
  },
  {
    name: 'Malware Detection',
    repo: gh('Malware-Detection'),
    area: 'AI & LLMs',
    summary:
      'Classifies Windows executables as benign or malware by converting the file bytes into images and fine-tuning a ResNet-34 on them.',
    stack: ['Python', 'fastai', 'ResNet-34', 'Jupyter'],
    image: asset('projects/malware-detection.webp'),
    shot: 'Notebook output: executables rendered as images, with labels',
  },
  {
    name: 'Prompt Analysis Benchmark',
    repo: gh('Prompt_Analysis'),
    area: 'AI & LLMs',
    summary:
      'A benchmark for judging how well an LLM handles an end-to-end coding task: the prompt, a reference implementation, and a written comparison of two model responses.',
    stack: ['Python', 'LLM evaluation', 'Prompt design'],
    image: asset('projects/prompt-analysis.webp'),
    shot: 'The benchmark prompt: Prompt.md',
  },
  {
    name: 'Test Drive Analytics Dashboard',
    repo: gh('crestwyn-test-drive-analytics-dashboard'),
    area: 'Data',
    summary:
      'Multi-page BI dashboard covering a year of test drives, consultant performance, satisfaction and purchase conversion for a showroom.',
    stack: ['Data visualization', 'Analytics'],
    image: asset('projects/test-drive-dashboard.webp'),
    shot: 'Vehicle popularity page',
  },
  {
    name: 'Sales Performance Dashboard',
    repo: gh('sales-visualization-dashboard-fix'),
    area: 'Data',
    summary:
      'A regional sales dashboard built in Python from quarterly and monthly CSV data: revenue by region, market share, and revenue against operating cost.',
    stack: ['Python', 'pandas', 'Matplotlib'],
    image: asset('projects/sales-dashboard.webp'),
    shot: 'The dashboard image the script produces',
  },
];

export const experience = [
  {
    role: 'Software Developer',
    org: 'Ethara AI',
    url: 'https://www.ethara.ai/',
    logo: asset('logos/ethara-white.png'),
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
    logo: asset('logos/maq.png'),
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
    logo: asset('logos/horizon17.png'),
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
  publisherLogo: asset('logos/springer-white.png'),
};

// Skills whose name differs from the word used in project tech lists.
// Clicking a skill searches the project gallery for this term.
export const skillSearch: Record<string, string> = {
  'LLM APIs (Claude, OpenAI, Groq, Gemini)': 'LLM',
  'RAG and agents': 'retrieval',
  'Prompt engineering': 'prompt',
  'Node.js and Express': 'Express',
  'JWT auth': 'JWT',
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
  logo: asset('logos/amity.png'),
  photo: asset('img/amity-campus.jpg'),
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
  { name: 'Ethara AI', logo: asset('logos/ethara-ink.png'), height: 26, section: 'experience', sectionLabel: 'Experience' },
  { name: 'MAQ Software', logo: asset('logos/maq.png'), height: 24, section: 'experience', sectionLabel: 'Experience' },
  { name: 'Horizon17', logo: asset('logos/horizon17.png'), height: 40, section: 'experience', sectionLabel: 'Experience' },
  { name: 'Amity University', logo: asset('logos/amity.png'), height: 40, section: 'education', sectionLabel: 'Education' },
  { name: 'Springer Nature', logo: asset('logos/springer.png'), height: 17, section: 'research', sectionLabel: 'Research' },
];
