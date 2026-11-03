// Seed script to populate 54 realistic opportunities across 16 domains
const path = require('path');
const dotenv = require('dotenv');

// Load env variables with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');

const BLOCKED_COMPANIES = [
  'google', 'microsoft', 'amazon', 'tcs', 'infosys', 'wipro', 'flipkart',
  'zoho', 'swiggy', 'zomato', 'paytm', 'meta', 'apple', 'adobe',
  'oracle', 'ibm', 'accenture', 'cognizant', 'capgemini'
];

const EXPECTED_DOMAINS = {
  'Web Development': 4,
  'Full Stack Development': 4,
  'Python Development': 4,
  'Java Development': 3,
  'Data Science': 4,
  'Data Analytics': 3,
  'AI/ML': 4,
  'Mobile Development': 3,
  'UI/UX Design': 3,
  'Cybersecurity': 3,
  'Cloud & DevOps': 4,
  'Software Testing': 3,
  'Embedded & IoT': 3,
  'Game Development': 3,
  'Blockchain': 3,
  'Digital Marketing': 3
};

const rawSeedData = [
  // Web Development (4) - At least 2 contain "React"
  {
    title: 'React Developer Intern',
    company: 'PixelCraft Labs',
    domain: 'Web Development',
    location: 'Bengaluru, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Work alongside senior frontend engineers to build dynamic user interfaces using modern React and Redux Toolkit. You will translate wireframes into clean, reusable component hierarchies and assist in state management.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
    salary: '₹15,000 - ₹25,000 /month',
    applicationLink: 'https://example.com/apply/pixelcraft-labs-react-developer-intern'
  },
  {
    title: 'Frontend Developer (React)',
    company: 'ApexNova Systems',
    domain: 'Web Development',
    location: 'Hyderabad, India (Hybrid)',
    experience: '0-1 years',
    type: 'Job',
    description: 'Develop and maintain responsive single-page applications with React, TypeScript, and Tailwind CSS. You will optimize web performance across desktop and mobile browsers while collaborating with UX designers.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    salary: '₹4 - 6 LPA',
    applicationLink: 'https://example.com/apply/apexnova-systems-frontend-developer-react'
  },
  {
    title: 'Node.js Backend Intern',
    company: 'ByteSurge Tech',
    domain: 'Web Development',
    location: 'Pune, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Assist in creating scalable server-side REST APIs using Node.js and Express.js. You will write unit tests, handle database connectivity, and gain hands-on experience optimizing API latency.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Postman'],
    salary: '₹12,000 - ₹18,000 /month',
    applicationLink: 'https://example.com/apply/bytesurge-tech-nodejs-backend-intern'
  },
  {
    title: 'WordPress / Web Developer',
    company: 'CloudPulse Solutions',
    domain: 'Web Development',
    location: 'Remote (India)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Build and customize responsive websites using WordPress, PHP, and JavaScript. You will configure modern plugins, manage child themes, and ensure cross-browser compatibility across client portals.',
    skills: ['WordPress', 'PHP', 'HTML5', 'CSS3', 'JavaScript'],
    salary: '₹10,000 - ₹15,000 /month',
    applicationLink: 'https://example.com/apply/cloudpulse-solutions-wordpress-web-developer'
  },

  // Full Stack Development (4)
  {
    title: 'MERN Stack Intern',
    company: 'NexusWave Software',
    domain: 'Full Stack Development',
    location: 'Mumbai, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Collaborate on full-stack application development using MongoDB, Express, React, and Node.js. You will build end-to-end features, implement authentication flows, and connect frontend components to backend endpoints.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Git'],
    salary: '₹14,000 - ₹22,000 /month',
    applicationLink: 'https://example.com/apply/nexuswave-software-mern-stack-intern'
  },
  {
    title: 'Python (Django) Full Stack Developer',
    company: 'CodeForge Dynamics',
    domain: 'Full Stack Development',
    location: 'Delhi NCR, India (Hybrid)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Deliver robust full-stack web solutions powered by Django and modern JavaScript frameworks. You will design PostgreSQL database schemas, write secure REST endpoints, and implement clean client views.',
    skills: ['Python', 'Django', 'PostgreSQL', 'JavaScript', 'HTML5'],
    salary: '₹5 - 8 LPA',
    applicationLink: 'https://example.com/apply/codeforge-dynamics-python-django-full-stack-developer'
  },
  {
    title: 'Java Spring Boot Full Stack Developer',
    company: 'QuantumLeap Innovations',
    domain: 'Full Stack Development',
    location: 'Chennai, India (On-site)',
    experience: '2-3 years',
    type: 'Job',
    description: 'Architect enterprise-grade microservices with Spring Boot and Angular frontends. You will ensure high availability, design resilient transactional workflows, and maintain automated CI/CD deployment pipelines.',
    skills: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'Docker'],
    salary: '₹7 - 10 LPA',
    applicationLink: 'https://example.com/apply/quantumleap-innovations-java-spring-boot-full-stack'
  },
  {
    title: 'Full Stack Developer Trainee',
    company: 'ZenithStack Labs',
    domain: 'Full Stack Development',
    location: 'Noida, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Undergo structured mentoring across frontend and backend development stacks. You will contribute to sprint goals, write clean code, and participate in code reviews with senior engineering mentors.',
    skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    salary: '₹12,000 - ₹16,000 /month',
    applicationLink: 'https://example.com/apply/zenithstack-labs-full-stack-developer-trainee'
  },

  // Python Development (4)
  {
    title: 'Python Developer Intern',
    company: 'HyperVortex Technologies',
    domain: 'Python Development',
    location: 'Gurugram, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Develop modular Python scripts for data processing and internal business automation. You will work with standard Python libraries, create automated test cases, and document workflow routines.',
    skills: ['Python', 'Git', 'OOP', 'SQL', 'Linux'],
    salary: '₹15,000 - ₹20,000 /month',
    applicationLink: 'https://example.com/apply/hypervortex-technologies-python-developer-intern'
  },
  {
    title: 'Flask/FastAPI Backend Developer',
    company: 'AlphaSync Studios',
    domain: 'Python Development',
    location: 'Bengaluru, India (Remote)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Build high-performance asynchronous microservices utilizing FastAPI, Pydantic, and SQLAlchemy. You will integrate third-party payment gateways and optimize JSON serialization pipelines.',
    skills: ['Python', 'FastAPI', 'Flask', 'PostgreSQL', 'Redis'],
    salary: '₹6 - 9 LPA',
    applicationLink: 'https://example.com/apply/alphasync-studios-flask-fastapi-backend-developer'
  },
  {
    title: 'Python Automation & Scripting Intern',
    company: 'AstraFlow Networks',
    domain: 'Python Development',
    location: 'Kolkata, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Write robust automation scripts using Selenium and Beautiful Soup for enterprise data extraction. You will schedule automated cron jobs and generate structured analytical reports in CSV and JSON formats.',
    skills: ['Python', 'BeautifulSoup', 'Selenium', 'Pandas', 'Regex'],
    salary: '₹10,000 - ₹15,000 /month',
    applicationLink: 'https://example.com/apply/astraflow-networks-python-automation-scripting'
  },
  {
    title: 'Junior Python Developer',
    company: 'BlueHorizon Digital',
    domain: 'Python Development',
    location: 'Ahmedabad, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Participate in backend API construction and database schema maintenance using Python and SQLite. You will debug edge cases, implement logging utilities, and ensure compliance with PEP 8 standards.',
    skills: ['Python', 'Flask', 'SQLite', 'Git', 'PyTest'],
    salary: '₹12,000 - ₹18,000 /month',
    applicationLink: 'https://example.com/apply/bluehorizon-digital-junior-python-developer'
  },

  // Java Development (3)
  {
    title: 'Java Backend Intern',
    company: 'CobaltCore Innovations',
    domain: 'Java Development',
    location: 'Jaipur, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Assist the core platform team in building enterprise Java modules using Spring Framework. You will learn best practices in object-oriented design patterns, multithreading, and relational database queries.',
    skills: ['Java', 'Spring', 'Hibernate', 'MySQL', 'Maven'],
    salary: '₹12,000 - ₹20,000 /month',
    applicationLink: 'https://example.com/apply/cobaltcore-innovations-java-backend-intern'
  },
  {
    title: 'Spring Boot Developer',
    company: 'CyberNest Solutions',
    domain: 'Java Development',
    location: 'Bengaluru, India (On-site)',
    experience: '2-3 years',
    type: 'Job',
    description: 'Develop resilient cloud-ready microservices using Java 17, Spring Boot, and Apache Kafka. You will profile performance bottlenecks, write JPA queries, and ensure 99.9% application uptime.',
    skills: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker'],
    salary: '₹8 - 12 LPA',
    applicationLink: 'https://example.com/apply/cybernest-solutions-spring-boot-developer'
  },
  {
    title: 'Junior Java Developer',
    company: 'DataBloom Analytics',
    domain: 'Java Development',
    location: 'Pune, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Write robust backend services and maintain unit test coverage using JUnit and Mockito. You will troubleshoot bugs in existing Java codebases and contribute to database migration scripts.',
    skills: ['Java', 'JUnit', 'SQL', 'Git', 'Spring Core'],
    salary: '₹10,000 - ₹16,000 /month',
    applicationLink: 'https://example.com/apply/databloom-analytics-junior-java-developer'
  },

  // Data Science (4)
  {
    title: 'Data Science Intern',
    company: 'EchoLogic Systems',
    domain: 'Data Science',
    location: 'Hyderabad, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Support senior data scientists in exploratory data analysis and feature engineering. You will clean messy datasets with Pandas, visualize insights with Matplotlib, and train baseline regression models.',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib'],
    salary: '₹15,000 - ₹22,000 /month',
    applicationLink: 'https://example.com/apply/echologic-systems-data-science-intern'
  },
  {
    title: 'Machine Learning Analyst',
    company: 'FalconByte Technologies',
    domain: 'Data Science',
    location: 'Bengaluru, India (Remote)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Analyze real-world business datasets and evaluate predictive machine learning algorithms. You will tune hyperparameters, track experiments with MLflow, and communicate key performance metrics to leaders.',
    skills: ['Python', 'Scikit-Learn', 'SQL', 'Tableau', 'Statistics'],
    salary: '₹6 - 9 LPA',
    applicationLink: 'https://example.com/apply/falconbyte-technologies-machine-learning-analyst'
  },
  {
    title: 'Junior Data Scientist',
    company: 'FusionGrid Labs',
    domain: 'Data Science',
    location: 'Mumbai, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Build predictive machine learning pipelines using Scikit-Learn and XGBoost for classification tasks. You will conduct hypothesis testing and document model assumptions for peer review.',
    skills: ['Python', 'XGBoost', 'Pandas', 'Seaborn', 'Statistics'],
    salary: '₹18,000 - ₹25,000 /month',
    applicationLink: 'https://example.com/apply/fusiongrid-labs-junior-data-scientist'
  },
  {
    title: 'Statistical Modelling Intern',
    company: 'GlitchMatrix Software',
    domain: 'Data Science',
    location: 'Delhi NCR, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Apply probability and inferential statistics to understand user behaviour across platform funnels. You will build regression models, calculate confidence intervals, and present visual analytical summaries.',
    skills: ['R', 'Python', 'Statistics', 'Probability', 'Excel'],
    salary: '₹12,000 - ₹18,000 /month',
    applicationLink: 'https://example.com/apply/glitchmatrix-software-statistical-modelling'
  },

  // Data Analytics (3)
  {
    title: 'Data Analyst Intern (SQL and Excel)',
    company: 'HexaSphere Solutions',
    domain: 'Data Analytics',
    location: 'Chennai, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Perform data extraction and aggregation across complex relational tables using advanced SQL. You will build executive Excel dashboards featuring pivot tables, lookups, and trend charts.',
    skills: ['SQL', 'Advanced Excel', 'Data Cleaning', 'Power BI'],
    salary: '₹10,000 - ₹16,000 /month',
    applicationLink: 'https://example.com/apply/hexasphere-solutions-data-analyst-intern-sql'
  },
  {
    title: 'Power BI Developer',
    company: 'InfiniTree Technologies',
    domain: 'Data Analytics',
    location: 'Gurugram, India (Remote)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Design and deploy interactive enterprise reporting dashboards using Microsoft Power BI and DAX. You will model star schema databases, set up row-level security, and schedule automated gateway refreshes.',
    skills: ['Power BI', 'DAX', 'SQL', 'Data Modeling', 'Power Query'],
    salary: '₹5 - 8 LPA',
    applicationLink: 'https://example.com/apply/infinitree-technologies-power-bi-developer'
  },
  {
    title: 'Business Intelligence Analyst',
    company: 'KineticWave Studios',
    domain: 'Data Analytics',
    location: 'Noida, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Track key performance indicators and build recurring metric reports for cross-functional stakeholders. You will validate data accuracy, run exploratory queries in MySQL, and synthesize data into business takeaways.',
    skills: ['Tableau', 'SQL', 'Excel', 'Data Visualization'],
    salary: '₹14,000 - ₹20,000 /month',
    applicationLink: 'https://example.com/apply/kineticwave-studios-business-intelligence-analyst'
  },

  // AI/ML (4)
  {
    title: 'ML Engineer Intern',
    company: 'LuminaSpark Labs',
    domain: 'AI/ML',
    location: 'Bengaluru, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Assist in training deep learning models and preparing training datasets with PyTorch. You will evaluate model accuracy, measure inference latencies, and containerize baseline models using Docker.',
    skills: ['PyTorch', 'Python', 'Deep Learning', 'Docker', 'Git'],
    salary: '₹18,000 - ₹25,000 /month',
    applicationLink: 'https://example.com/apply/luminaspark-labs-ml-engineer-intern'
  },
  {
    title: 'NLP Engineer',
    company: 'MindSprout Analytics',
    domain: 'AI/ML',
    location: 'Hyderabad, India (Remote)',
    experience: '2-3 years',
    type: 'Job',
    description: 'Build production natural language processing solutions leveraging Hugging Face Transformers and spaCy. You will fine-tune language models for classification, named entity recognition, and sentiment analysis.',
    skills: ['NLP', 'Transformers', 'PyTorch', 'Python', 'FastAPI'],
    salary: '₹8 - 14 LPA',
    applicationLink: 'https://example.com/apply/mindsprout-analytics-nlp-engineer'
  },
  {
    title: 'Computer Vision Intern',
    company: 'NanoVolt Dynamics',
    domain: 'AI/ML',
    location: 'Pune, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Implement computer vision pipelines for object detection and image segmentation using OpenCV and YOLO. You will label training datasets, apply data augmentations, and benchmark model inference times.',
    skills: ['OpenCV', 'YOLO', 'Python', 'PyTorch', 'NumPy'],
    salary: '₹15,000 - ₹22,000 /month',
    applicationLink: 'https://example.com/apply/nanovolt-dynamics-computer-vision-intern'
  },
  {
    title: 'Generative AI Developer Intern',
    company: 'NovaRidge Digital',
    domain: 'AI/ML',
    location: 'Remote (India)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Create prototype applications using large language models, retrieval augmented generation, and vector stores. You will build prompt chains with LangChain and connect conversational interfaces to REST endpoints.',
    skills: ['LangChain', 'Python', 'Vector DB', 'Prompt Engineering'],
    salary: '₹20,000 - ₹25,000 /month',
    applicationLink: 'https://example.com/apply/novaridge-digital-generative-ai-developer'
  },

  // Mobile Development (3)
  {
    title: 'Flutter Developer Intern',
    company: 'OmniStrat Technologies',
    domain: 'Mobile Development',
    location: 'Bengaluru, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Develop slick cross-platform mobile apps for iOS and Android using Flutter and Dart. You will implement reactive state management with Bloc, integrate RESTful APIs, and test on physical devices.',
    skills: ['Flutter', 'Dart', 'Bloc', 'REST APIs', 'Git'],
    salary: '₹12,000 - ₹20,000 /month',
    applicationLink: 'https://example.com/apply/omnistrat-technologies-flutter-developer-intern'
  },
  {
    title: 'Android (Kotlin) Developer',
    company: 'OptimaSync Systems',
    domain: 'Mobile Development',
    location: 'Chennai, India (Hybrid)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Build modern Android applications using Kotlin, Jetpack Compose, and Coroutines. You will write clean MVVM architectures, integrate offline caching with Room, and publish release APK builds.',
    skills: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Coroutines', 'Room'],
    salary: '₹5 - 8 LPA',
    applicationLink: 'https://example.com/apply/optimasync-systems-android-kotlin-developer'
  },
  {
    title: 'React Native Developer',
    company: 'OrbitPeak Studios',
    domain: 'Mobile Development',
    location: 'Mumbai, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Assist in building cross-platform mobile applications using React Native and Expo. You will design mobile-first UI components, troubleshoot device quirks, and connect frontend views with backend endpoints.',
    skills: ['React Native', 'JavaScript', 'Expo', 'Redux', 'Mobile UI'],
    salary: '₹14,000 - ₹22,000 /month',
    applicationLink: 'https://example.com/apply/orbitpeak-studios-react-native-developer'
  },

  // UI/UX Design (3)
  {
    title: 'UI/UX Design Intern',
    company: 'PrismFlow Design',
    domain: 'UI/UX Design',
    location: 'Pune, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Design interactive high-fidelity prototypes and maintain design systems in Figma. You will collaborate closely with product managers to transform user requirements into intuitive interface workflows.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'UI Design'],
    salary: '₹12,000 - ₹18,000 /month',
    applicationLink: 'https://example.com/apply/prismflow-design-ui-ux-design-intern'
  },
  {
    title: 'Product Designer',
    company: 'PulseMatrix Labs',
    domain: 'UI/UX Design',
    location: 'Bengaluru, India (Hybrid)',
    experience: '2-3 years',
    type: 'Job',
    description: 'Lead product design initiatives from exploratory user journeys to production design specs. You will facilitate user feedback interviews, conduct usability testing, and align design language with brand guidelines.',
    skills: ['Figma', 'Product Design', 'User Research', 'Design Systems'],
    salary: '₹7 - 11 LPA',
    applicationLink: 'https://example.com/apply/pulsematrix-labs-product-designer'
  },
  {
    title: 'UX Research Intern',
    company: 'RadianCraft Solutions',
    domain: 'UI/UX Design',
    location: 'Delhi NCR, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Conduct qualitative user interviews and synthesize feedback into personas and journey maps. You will run surveys, analyze usability session recordings, and recommend UX improvements.',
    skills: ['User Research', 'Usability Testing', 'Figma', 'Survey Design'],
    salary: '₹10,000 - ₹15,000 /month',
    applicationLink: 'https://example.com/apply/radiancraft-solutions-ux-research-intern'
  },

  // Cybersecurity (3)
  {
    title: 'SOC Analyst Intern',
    company: 'SkyWard Dynamics',
    domain: 'Cybersecurity',
    location: 'Hyderabad, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Monitor enterprise security alert queues and investigate suspicious network anomalies. You will analyze firewall and SIEM logs, triage security events, and escalate critical threats to incident response leads.',
    skills: ['SIEM', 'Network Security', 'Wireshark', 'Linux', 'Incident Response'],
    salary: '₹14,000 - ₹20,000 /month',
    applicationLink: 'https://example.com/apply/skyward-dynamics-soc-analyst-intern'
  },
  {
    title: 'Penetration Testing Intern',
    company: 'SonicByte Networks',
    domain: 'Cybersecurity',
    location: 'Bengaluru, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Perform web application vulnerability assessments based on OWASP Top 10 guidelines. You will use tools like Burp Suite to identify vulnerabilities, document risks, and suggest remediation steps.',
    skills: ['Burp Suite', 'OWASP Top 10', 'Kali Linux', 'Vulnerability Assessment'],
    salary: '₹15,000 - ₹22,000 /month',
    applicationLink: 'https://example.com/apply/sonicbyte-networks-penetration-testing-intern'
  },
  {
    title: 'Network Security Engineer',
    company: 'SparkForge Innovations',
    domain: 'Cybersecurity',
    location: 'Mumbai, India (On-site)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Configure and maintain enterprise firewalls, VPN gateways, and intrusion prevention systems. You will audit network topology, ensure zero-trust access control policies, and mitigate security risks.',
    skills: ['Firewalls', 'VPN', 'TCP/IP', 'Cisco', 'Zero Trust'],
    salary: '₹6 - 9 LPA',
    applicationLink: 'https://example.com/apply/sparkforge-innovations-network-security-engineer'
  },

  // Cloud & DevOps (4)
  {
    title: 'AWS Cloud Intern',
    company: 'SpectraPoint Technologies',
    domain: 'Cloud & DevOps',
    location: 'Noida, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Learn to deploy and manage serverless architectures and EC2 clusters on AWS. You will configure S3 storage policies, set up CloudWatch monitoring alarms, and write automation scripts.',
    skills: ['AWS', 'EC2', 'S3', 'CloudWatch', 'Bash'],
    salary: '₹15,000 - ₹22,000 /month',
    applicationLink: 'https://example.com/apply/spectrapoint-technologies-aws-cloud-intern'
  },
  {
    title: 'DevOps Engineer Intern',
    company: 'StrataLogic Systems',
    domain: 'Cloud & DevOps',
    location: 'Pune, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Assist in containerizing application services with Docker and maintaining CI/CD pipelines. You will write infrastructure configuration scripts and gain hands-on experience with Kubernetes deployments.',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux'],
    salary: '₹14,000 - ₹20,000 /month',
    applicationLink: 'https://example.com/apply/stratalogic-systems-devops-engineer-intern'
  },
  {
    title: 'Linux System Administrator',
    company: 'SummitPixel Digital',
    domain: 'Cloud & DevOps',
    location: 'Ahmedabad, India (On-site)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Manage production Ubuntu and Red Hat enterprise servers with strict service level objectives. You will automate system patching, configure user permissions, and troubleshoot performance degradation.',
    skills: ['Linux', 'Bash Scripting', 'SSH', 'Networking', 'Systemd'],
    salary: '₹4 - 7 LPA',
    applicationLink: 'https://example.com/apply/summitpixel-digital-linux-system-administrator'
  },
  {
    title: 'CI/CD Automation Engineer',
    company: 'SyncSphere Labs',
    domain: 'Cloud & DevOps',
    location: 'Bengaluru, India (Remote)',
    experience: '2-3 years',
    type: 'Job',
    description: 'Design and optimize automated continuous integration and continuous deployment pipelines using GitHub Actions. You will integrate security scanning tools and ensure fast release build cycles.',
    skills: ['GitHub Actions', 'Jenkins', 'Terraform', 'Docker', 'AWS'],
    salary: '₹7 - 11 LPA',
    applicationLink: 'https://example.com/apply/syncsphere-labs-cicd-automation-engineer'
  },

  // Software Testing (3)
  {
    title: 'Manual QA Tester Intern',
    company: 'TerraCore Solutions',
    domain: 'Software Testing',
    location: 'Kolkata, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Execute detailed functional and regression test suites across modern web applications. You will log reproducible defect tickets in Jira and verify fixes alongside the software development team.',
    skills: ['Manual Testing', 'Test Cases', 'Jira', 'Bug Tracking', 'SDLC'],
    salary: '₹10,000 - ₹14,000 /month',
    applicationLink: 'https://example.com/apply/terracore-solutions-manual-qa-tester-intern'
  },
  {
    title: 'Selenium Automation Tester',
    company: 'TitanWave Networks',
    domain: 'Software Testing',
    location: 'Hyderabad, India (Hybrid)',
    experience: '0-1 years',
    type: 'Job',
    description: 'Develop automated browser test suites using Selenium WebDriver and TestNG in Java. You will build maintainable Page Object Models, automate regression runs, and generate execution test reports.',
    skills: ['Selenium', 'Java', 'TestNG', 'Automation', 'Git'],
    salary: '₹4 - 6 LPA',
    applicationLink: 'https://example.com/apply/titanwave-networks-selenium-automation-tester'
  },
  {
    title: 'API Testing Engineer',
    company: 'TrueNorth Tech',
    domain: 'Software Testing',
    location: 'Pune, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Design and automate comprehensive API verification suites with Postman and Newman. You will validate status codes, inspect payload contracts, and ensure response times meet agreed service targets.',
    skills: ['Postman', 'REST APIs', 'Newman', 'JavaScript', 'JSON'],
    salary: '₹12,000 - ₹18,000 /month',
    applicationLink: 'https://example.com/apply/truenorth-tech-api-testing-engineer'
  },

  // Embedded & IoT (3)
  {
    title: 'IoT Developer Intern',
    company: 'UrbanGrid Dynamics',
    domain: 'Embedded & IoT',
    location: 'Bengaluru, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Build connected IoT sensor prototypes communicating via MQTT and HTTP protocols. You will interface digital sensors with microcontrollers, parse incoming telemetry, and stream metrics to cloud dashboards.',
    skills: ['IoT', 'MQTT', 'Embedded C', 'ESP32', 'Sensors'],
    salary: '₹12,000 - ₹18,000 /month',
    applicationLink: 'https://example.com/apply/urbangrid-dynamics-iot-developer-intern'
  },
  {
    title: 'Embedded Systems Engineer',
    company: 'VectorNova Studios',
    domain: 'Embedded & IoT',
    location: 'Chennai, India (On-site)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Develop low-level firmware for ARM Cortex microcontrollers in Embedded C. You will implement UART, SPI, and I2C drivers, debug board circuits with oscilloscopes, and ensure reliable real-time operation.',
    skills: ['Embedded C', 'ARM Cortex', 'I2C', 'SPI', 'Firmware'],
    salary: '₹5 - 8 LPA',
    applicationLink: 'https://example.com/apply/vectornova-studios-embedded-systems-engineer'
  },
  {
    title: 'Arduino/Raspberry Pi Developer Intern',
    company: 'VertexStream Labs',
    domain: 'Embedded & IoT',
    location: 'Jaipur, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Prototype embedded hardware projects using Arduino boards and Raspberry Pi single-board computers. You will write Python and C code to control actuators, gather environmental data, and test hardware.',
    skills: ['Arduino', 'Raspberry Pi', 'Python', 'Electronics', 'GPIO'],
    salary: '₹10,000 - ₹15,000 /month',
    applicationLink: 'https://example.com/apply/vertexstream-labs-arduino-raspberry-pi-dev'
  },

  // Game Development (3)
  {
    title: 'Unity Game Developer Intern',
    company: 'VelocePeak Solutions',
    domain: 'Game Development',
    location: 'Hyderabad, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Program interactive game mechanics and character controls using Unity engine and C#. You will optimize 3D scene rendering, implement sound triggers, and test gameplay balancing with design teammates.',
    skills: ['Unity', 'C#', 'Game Physics', '3D Math', 'Git'],
    salary: '₹12,000 - ₹20,000 /month',
    applicationLink: 'https://example.com/apply/velocepeak-solutions-unity-game-developer'
  },
  {
    title: 'Game Designer Intern',
    company: 'VividLogic Technologies',
    domain: 'Game Development',
    location: 'Mumbai, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Author comprehensive game design documents detailing level layouts, core gameplay loops, and economy balance. You will create rapid paper prototypes and iterate based on player playtest feedback.',
    skills: ['Game Design', 'Level Design', 'Prototyping', 'Documentation'],
    salary: '₹10,000 - ₹16,000 /month',
    applicationLink: 'https://example.com/apply/vividlogic-technologies-game-designer-intern'
  },
  {
    title: 'Gameplay Programmer',
    company: 'VoltCraft Studios',
    domain: 'Game Development',
    location: 'Pune, India (On-site)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Implement complex player interactions, enemy AI behaviours, and collision response systems in C#. You will profile framerate bottlenecks, refine animation trees, and resolve game physics defects.',
    skills: ['C#', 'Unity', 'Gameplay Systems', 'AI Behavior', 'Git'],
    salary: '₹5 - 8 LPA',
    applicationLink: 'https://example.com/apply/voltcraft-studios-gameplay-programmer'
  },

  // Blockchain (3)
  {
    title: 'Solidity Smart Contract Intern',
    company: 'WaveFront Digital',
    domain: 'Blockchain',
    location: 'Bengaluru, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Write and test EVM smart contracts using Solidity, Hardhat, and Chai. You will implement standard ERC-20 token contracts, conduct unit tests, and evaluate contract execution gas costs on testnets.',
    skills: ['Solidity', 'Ethereum', 'Hardhat', 'JavaScript', 'Web3'],
    salary: '₹16,000 - ₹25,000 /month',
    applicationLink: 'https://example.com/apply/wavefront-digital-solidity-smart-contract'
  },
  {
    title: 'Web3 Developer',
    company: 'WireSpire Systems',
    domain: 'Blockchain',
    location: 'Delhi NCR, India (Hybrid)',
    experience: '1-2 years',
    type: 'Job',
    description: 'Build decentralized applications connecting React frontends to Ethereum contracts via Ethers.js. You will manage wallet connection states, handle blockchain events, and ensure smooth transaction UX.',
    skills: ['Solidity', 'Ethers.js', 'React', 'Web3', 'Node.js'],
    salary: '₹7 - 12 LPA',
    applicationLink: 'https://example.com/apply/wirespire-systems-web3-developer'
  },
  {
    title: 'Blockchain Analyst Intern',
    company: 'ZephyrStack Labs',
    domain: 'Blockchain',
    location: 'Gurugram, India (On-site)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Analyze on-chain transaction data and smart contract events using Dune Analytics and Python. You will research decentralized finance protocols and prepare analytical summary briefs on blockchain trends.',
    skills: ['Blockchain', 'Dune Analytics', 'SQL', 'Python', 'Crypto'],
    salary: '₹12,000 - ₹18,000 /month',
    applicationLink: 'https://example.com/apply/zephyrstack-labs-blockchain-analyst-intern'
  },

  // Digital Marketing (3)
  {
    title: 'SEO Intern',
    company: 'ZeroPoint Technologies',
    domain: 'Digital Marketing',
    location: 'Noida, India (Remote)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Conduct keyword discovery research and technical on-page SEO audits to grow organic traffic. You will optimize meta tags, monitor ranking changes with Google Search Console, and write content briefs.',
    skills: ['SEO', 'Google Search Console', 'Keyword Research', 'Google Analytics'],
    salary: '₹10,000 - ₹15,000 /month',
    applicationLink: 'https://example.com/apply/zeropoint-technologies-seo-intern'
  },
  {
    title: 'Social Media Marketing Intern',
    company: 'ZygoFlow Dynamics',
    domain: 'Digital Marketing',
    location: 'Pune, India (Hybrid)',
    experience: 'Fresher',
    type: 'Internship',
    description: 'Create engaging social media campaigns across LinkedIn, Twitter, and Instagram for tech audiences. You will track community engagement rates, schedule publication calendars, and craft visual captions.',
    skills: ['Social Media', 'Content Creation', 'Canva', 'Copywriting', 'Analytics'],
    salary: 'Not disclosed',
    applicationLink: 'https://example.com/apply/zygoflow-dynamics-social-media-marketing'
  },
  {
    title: 'Performance Marketing Executive',
    company: 'BeaconHive Systems',
    domain: 'Digital Marketing',
    location: 'Bengaluru, India (On-site)',
    experience: '0-1 years',
    type: 'Job',
    description: 'Manage paid search and display advertising campaigns across Google Ads and Meta Ads Manager. You will conduct A/B ad copy tests, optimize customer acquisition costs, and measure conversion funnels.',
    skills: ['Google Ads', 'Meta Ads', 'PPC', 'Analytics', 'Conversion Optimization'],
    salary: '₹3 - 5 LPA',
    applicationLink: 'https://example.com/apply/beaconhive-systems-performance-marketing'
  }
];

// Attach unique past createdAt and updatedAt timestamps
const now = new Date();
const seedOpportunities = rawSeedData.map((doc, index) => {
  const days = ((index * 7) % 35) + 1;
  const minutes = index * 17;
  const pastDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000) - (minutes * 60 * 1000));
  return {
    ...doc,
    createdAt: pastDate,
    updatedAt: pastDate
  };
});

// Phase 1: In-memory pre-validation BEFORE touching the database
const validateSeedData = () => {
  console.log('Running pre-seed validation checks...');

  // 1. Total count check
  if (seedOpportunities.length !== 54) {
    throw new Error(`Validation failed: Expected 54 opportunities, found ${seedOpportunities.length}`);
  }

  // 2. Type counts check
  const internships = seedOpportunities.filter((o) => o.type === 'Internship');
  const jobs = seedOpportunities.filter((o) => o.type === 'Job');
  if (internships.length !== 36) {
    throw new Error(`Validation failed: Expected 36 internships, found ${internships.length}`);
  }
  if (jobs.length !== 18) {
    throw new Error(`Validation failed: Expected 18 jobs, found ${jobs.length}`);
  }

  // 3. Experience check
  for (const o of internships) {
    if (o.experience !== 'Fresher') {
      throw new Error(`Validation failed: Internship "${o.title}" has invalid experience "${o.experience}". Must be "Fresher".`);
    }
  }
  const validJobExp = ['0-1 years', '1-2 years', '2-3 years'];
  for (const o of jobs) {
    if (!validJobExp.includes(o.experience)) {
      throw new Error(`Validation failed: Job "${o.title}" has invalid experience "${o.experience}".`);
    }
  }

  // 4. Domains and counts check
  const domainCounts = {};
  for (const o of seedOpportunities) {
    domainCounts[o.domain] = (domainCounts[o.domain] || 0) + 1;
  }
  for (const [domain, count] of Object.entries(EXPECTED_DOMAINS)) {
    if (domainCounts[domain] !== count) {
      throw new Error(`Validation failed: Domain "${domain}" has count ${domainCounts[domain]}, expected ${count}`);
    }
  }
  if (Object.keys(domainCounts).length !== 16) {
    throw new Error(`Validation failed: Expected 16 distinct domains, found ${Object.keys(domainCounts).length}`);
  }

  // 5. Unique companies check
  const companySet = new Set();
  for (const o of seedOpportunities) {
    const lower = o.company.toLowerCase();
    if (companySet.has(lower)) {
      throw new Error(`Validation failed: Duplicate company name found: "${o.company}"`);
    }
    companySet.add(lower);
  }

  // 6. Blocked company names check
  for (const o of seedOpportunities) {
    const lower = o.company.toLowerCase();
    for (const blocked of BLOCKED_COMPANIES) {
      if (lower.includes(blocked)) {
        throw new Error(`Validation failed: Company "${o.company}" contains blocked brand name "${blocked}"`);
      }
    }
  }

  // 7. Unique application links check & URL format
  const linkSet = new Set();
  for (const o of seedOpportunities) {
    if (linkSet.has(o.applicationLink)) {
      throw new Error(`Validation failed: Duplicate application link: "${o.applicationLink}"`);
    }
    linkSet.add(o.applicationLink);
    if (!/^https:\/\/example\.com\/apply\/[a-z0-9-]+$/.test(o.applicationLink)) {
      throw new Error(`Validation failed: Link "${o.applicationLink}" must match format https://example.com/apply/<slug>`);
    }
  }

  // 8. No "c++" (case-insensitive) anywhere
  for (const o of seedOpportunities) {
    const fullText = JSON.stringify(o).toLowerCase();
    if (fullText.includes('c++')) {
      throw new Error(`Validation failed: Record contains prohibited text "c++": ${o.title}`);
    }
  }

  // 9. Location format check (contains "(" and Indian cities)
  for (const o of seedOpportunities) {
    if (!o.location.includes('(')) {
      throw new Error(`Validation failed: Location "${o.location}" does not contain "("`);
    }
  }

  // 10. Web Development titles: At least TWO contain "React"
  const webDevReactTitles = seedOpportunities.filter(
    (o) => o.domain === 'Web Development' && o.title.includes('React')
  );
  if (webDevReactTitles.length < 2) {
    throw new Error(`Validation failed: Expected at least 2 Web Dev titles containing "React", found ${webDevReactTitles.length}`);
  }

  // 11. Description length (150 - 350 chars, no line breaks, no HTML)
  for (const o of seedOpportunities) {
    if (o.description.length < 150 || o.description.length > 350) {
      throw new Error(`Validation failed: Description for "${o.title}" length is ${o.description.length}. Must be 150-350 chars.`);
    }
    if (o.description.includes('\n') || /<[^>]+>/.test(o.description)) {
      throw new Error(`Validation failed: Description for "${o.title}" contains line breaks or HTML.`);
    }
  }

  // 12. Not disclosed salary check: at most 4
  const notDisclosedSalaries = seedOpportunities.filter((o) => o.salary === 'Not disclosed');
  if (notDisclosedSalaries.length > 4) {
    throw new Error(`Validation failed: Found ${notDisclosedSalaries.length} "Not disclosed" salaries. Maximum is 4.`);
  }

  // 13. Mongoose schema validation check on each record
  for (const doc of seedOpportunities) {
    const modelInstance = new Opportunity(doc);
    const validationError = modelInstance.validateSync();
    if (validationError) {
      throw new Error(`Mongoose validation failed for "${doc.title}": ${validationError.message}`);
    }
  }

  // 14. Unique past createdAt check
  const createdAtSet = new Set();
  for (const o of seedOpportunities) {
    const timeVal = o.createdAt.getTime();
    if (createdAtSet.has(timeVal)) {
      throw new Error(`Validation failed: Duplicate createdAt timestamp detected.`);
    }
    createdAtSet.add(timeVal);
    if (timeVal >= now.getTime()) {
      throw new Error(`Validation failed: Timestamp is not in the past for "${o.title}".`);
    }
  }

  console.log('All pre-seed validation checks PASSED successfully!');
};

// Phase 2: Database operation
const runSeed = async () => {
  try {
    // 1. Run in-memory pre-validation FIRST before touching DB
    validateSeedData();

    // 2. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // 3. Clear collections
    console.log('Clearing existing Opportunity and Application collections...');
    await Opportunity.deleteMany({});
    await Application.deleteMany({});

    // 4. Insert raw documents using collection.insertMany to preserve custom createdAt
    console.log('Inserting seed records into database...');
    await Opportunity.collection.insertMany(seedOpportunities);

    // 5. Verify from database
    const totalCount = await Opportunity.countDocuments();
    const distinctDomains = await Opportunity.distinct('domain');
    const allCreatedAt = await Opportunity.find({}, { createdAt: 1, _id: 0 });
    const uniqueCreatedAtCount = new Set(allCreatedAt.map((d) => d.createdAt.getTime())).size;

    console.log('\n--- Database Verification Summary ---');
    console.log(`Total Opportunities: ${totalCount}`);
    console.log(`Distinct Domains Count: ${distinctDomains.length}`);
    console.log(`Unique CreatedAt Timestamps: ${uniqueCreatedAtCount}`);

    // Aggregate counts by domain to print table
    const domainCounts = await Opportunity.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\nDomain Breakdown:');
    console.table(
      domainCounts.map((d) => ({
        Domain: d._id,
        Count: d.count
      }))
    );

    console.log('Database seeded and verified successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\nSeed failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

runSeed();

