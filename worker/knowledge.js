// Public portfolio facts only. The AI assistant answers from this text, so keep it accurate.
// To add or change facts, edit the sentences below, then run "npx wrangler deploy" from the worker folder.
export const KNOWLEDGE = `
ABOUT SAHIL
Sahil Chauhan is a B.Tech graduate (2025) in Artificial Intelligence, based in Nagpur, Maharashtra, India. He turns raw data into meaningful insights using SQL, Excel, Power BI, Tableau and Python: cleaning and analysing data, building dashboards and spotting trends that support decisions. His background also covers feature engineering, machine learning fundamentals and Generative AI.
Roles he is looking for: Data Analyst and related analytics or business analyst roles, AI / ML, GenAI, Agentic AI, and Software Developer.
Contact: chauhansahil03115@gmail.com. LinkedIn: https://www.linkedin.com/in/sahil-chauhan-490b0021a/ . GitHub: https://github.com/Chauhansahiil . The website also has a contact form.

THE WEBSITE ALSO HAS a "Check the fit" section where visitors can paste a job description to see which of his skills match and which are gaps.

WHAT MAKES HIM DIFFERENT
He combines an AI degree with practical experience: three internships (Python, data analysis and full-stack development), an end-to-end SQL, Python and Power BI project, and a co-authored published research paper on blockchain banking. His full-stack background means he understands how data is created and moves through applications, not only how it is analysed. He learns quickly: at KultureHire he went from beginner to pro level in pivot table analysis.

STRENGTHS AND WEAKNESS
Strengths: the full analytics workflow (cleaning data with Pandas, answering business questions in SQL, presenting results in Power BI); a quick learner; a well-rounded technical base across AI, data and full-stack; has collaborated in a team on a published paper.
Weakness he is working on: limited experience with large real-world business datasets, since most of his hands-on work is at project and internship scale. He is addressing it through larger end-to-end projects and by looking for a role with real business data.

KEY STRENGTHS (use when asked why to hire Sahil)
1. Hands-on analysis experience: Data Analyst Intern at KultureHire building data standardization and cleaning frameworks in Excel and Power BI, plus Python data work at CodeSoft with NumPy and Pandas.
2. End-to-end project work: the Customer Trends Analysis project covers cleaning (Pandas), analysis (SQL) and an interactive Power BI dashboard.
3. AI background with relevant certifications: B.Tech in Artificial Intelligence, plus Accenture Data Analytics and Visualization, IBM Data Analysis with Python, and NVIDIA Fundamentals of Deep Learning.

WHERE HE SEES HIMSELF IN 3 TO 5 YEARS
This depends on the role. If the visitor has not said which role, ask which one they mean (Data Analyst or analytics, AI / ML, GenAI, Agentic AI, or Software Developer) before answering. Then answer for that role only:
- Data Analyst / analytics / business analyst: a dependable analyst who owns dashboards and reporting that teams rely on, takes a business question from raw data to a clear recommendation, deepens SQL, Power BI, Tableau, Python and statistics, grows closer to the business side and moves toward a senior or business analytics role, mentoring newer analysts.
- AI / ML: building and deploying machine learning solutions that solve real problems, building on his foundation in machine learning, neural networks, NLP and deep learning, learning production practices such as deployment and monitoring, and growing into an engineer trusted with end-to-end ML work.
- GenAI: building reliable LLM-powered applications using retrieval-augmented generation (RAG), careful prompt design and evaluation so answers are grounded in real data, moving toward designing GenAI solutions end to end with a focus on accuracy, safety and business value.
- Agentic AI: designing systems where AI agents plan, use tools and complete multi-step tasks dependably, combining his AI background with full-stack experience, focusing on reliability, guardrails and evaluation, and taking agent-based products from idea to production.
- Software Developer: a well-rounded full-stack engineer who builds clean, maintainable applications and takes ownership of what he ships, growing from his React, Node.js, Express and database experience into technical ownership and eventually leading small teams, bringing data and AI into the products.

PROJECT: CUSTOMER TRENDS ANALYSIS (SQL, Python, Power BI)
Repo: https://github.com/Chauhansahiil/Customer-Trends-Analysis-using-SQL-Python-and-Power-BI . It is based on an open-source project by Amlan Mohanty (MIT licence), which Sahil worked through end to end and published with his own notebook, SQL queries, Power BI dashboard (.pbix file) and report. Always say it is based on that original project, never that he invented it.
Dataset: a retail customer shopping dataset (CSV) with fields such as gender, age group, item and category purchased, purchase amount, discount applied, review rating, shipping type, subscription status and previous purchases. The exact number of rows is not stated on the portfolio; point to the repo.
Workflow: import, explore and clean the data in Python (Pandas), load it into a SQL database, answer business questions in SQL, then build an interactive Power BI dashboard.
The ten SQL business questions: revenue by gender; discount users who still spent above average; top 5 products by average review rating; Standard vs Express shipping spend; subscribers vs non-subscribers (spend and revenue); top 5 products by discount rate; customer segments New, Returning and Loyal by previous purchases; top 3 most purchased products in each category; whether repeat buyers also subscribe; revenue by age group.
SQL techniques used there: aggregations, subqueries, CASE logic, CTEs and the ROW_NUMBER window function.
The actual result numbers are in the dashboard and report in the repo. Do not state or guess any figures. There is no public live dashboard link; the .pbix file and report are in the repo, and for a walkthrough or screenshots the visitor should contact Sahil.
Hardest part (his own words, to be refined by him): turning broad business questions into precise SQL, such as grouping customers into New, Returning and Loyal segments and ranking top products per category with CTEs and a window function, and keeping the work consistent from Python to SQL to Power BI.

PROJECT AND PAPER: SECURE BANKING SYSTEM USING BLOCKCHAIN
Repo: https://github.com/Chauhansahiil/Secure-Banking-System-Using-Blockchain-Technology- . Published paper: "Secure Banking System Using Block-chain Technology", International Journal of Innovative Research in Technology (IJIRT), Volume 11, Issue 7, December 2024, https://ijirt.org/publishedpaper/IJIRT170787_PAPER.pdf . Authors: Dr. Smita Nirkhi (Head of the AI department, G H Raisoni College of Engineering and Management), Yash Sute, Aniket Doifode, Sahil Chauhan and Revatish Sur. Sahil is a co-author and team member; his exact individual contribution is not described in the paper.
What it does: a banking web application where transactions are confirmed through the MetaMask wallet using Web3.js, with smart contracts developed in Remix IDE, SHA-256 hashing for data integrity, token-based (JWT) authentication, a receiver-address step for transfers, and separate User and Admin modules (admin approves registrations and adds branch details). The aim is to reduce fraud, data breaches and manual processing compared with centralised banking, with transparent and tamper-resistant transaction records and PDF transaction records for users.

EXPERIENCE
1. Full Stack Developer Intern, Tenet Computer and Communication Pvt. Ltd., Nagpur (Dec 2024 - Jun 2025). Front-end with HTML, CSS, JavaScript and React; back-end with Node.js and Express; assisted with MySQL and MongoDB databases and API integration. He worked on the Elevate LMS project (a learning management system with client and server parts): https://github.com/Chauhansahiil/Elevate-lms . Do not claim he built it alone.
2. Data Analyst Intern, KultureHire (Sep 2024 - Oct 2024). Went from beginner to pro level in pivot table analysis. Built frameworks for data standardization and cleaning in Excel and Power BI.
3. Python Programming Intern, CodeSoft (Aug 2023 - Sep 2023). Wrote basic and intermediate Python programs and scripts for task automation, data processing and analysis using NumPy and Pandas.
Do not add up internship durations or call it a year of experience. His only analyst-specific experience is the KultureHire internship (Sep - Oct 2024); he is a fresher / entry-level candidate who graduated in 2025.
Why he moved from full-stack to data analysis: his degree is in AI, and analysis is where that background and his interest in turning numbers into decisions meet. The full-stack internship gave him a solid grounding in applications, APIs and databases, which also helps in analytics, while his data work at KultureHire and in his projects pointed him toward analysis as the direction to grow in.

SKILLS
Machine Learning and AI: GenAI, LLM, PyTorch, TensorFlow, RAG. Data analysis and visualization: SQL, Excel (VLOOKUP), Power BI (DAX), Tableau, Seaborn, EDA. Cloud and DevOps: CI/CD, REST API, AWS. Data preparation: feature engineering, data preprocessing. Programming: Python, R, C++. Databases: MySQL, MongoDB, Snowflake.
Skill levels, stated honestly: SQL is strong (joins, aggregations, subqueries, CTEs, window functions) without exaggeration. Python and Pandas: about 4 out of 5 for data analyst or business analyst work. Power BI is the dashboard tool he has used most; he also knows Tableau.

CERTIFICATIONS
Accenture Data Analytics and Visualization (Forage); Data Analysis with Python (Cognitive Class, IBM Developer Skills Network); Fundamentals of Deep Learning (NVIDIA); Certified Ethereum Developer Program (Indian Blockchain Institute).

EDUCATION
B.Tech in Artificial Intelligence, G H Raisoni College of Engineering and Management, Nagpur, 2021-2025, CGPA 6.96 / 10.0. XII (HSC), Sindhu College, Nagpur, 2021, 77%. His studies ran continuously from 2021 to 2025 with no gap in dates, and alongside them he completed three internships, a published paper and certifications. Whether he has any backlogs is not stated on the portfolio: say so and suggest asking him.
Coursework: Artificial Intelligence (Machine Learning, Neural Networks, Reinforcement Learning, NLP, Computer Vision and Deep Learning, Knowledge Representation and Reasoning) and Data Analytics (SQL and DBMS, Statistics and Probability, Data Analytics, Big Data Computing).

HIRING FACTS
Notice period: 15 days. If the job is within his home state (Maharashtra), he can join immediately. He is open to relocating to any city and is fine with remote, hybrid or on-site work.
Salary expectation: around 4.5 LPA, open to discussion based on the role, responsibilities and growth.
Work authorisation: for jobs in India he needs no visa or sponsorship; for jobs outside India he would need visa sponsorship.

LANGUAGES, HOBBIES AND INTERESTS
Languages: Marathi (mother tongue), Hindi, English and basic German. Hobbies: cricket, badminton and video games. Interests: watching movies, reading books and some carpentry work.

TOOLS NOT LISTED
What he does not know (answer in one sentence): he has not listed big-data and cloud tools such as Spark, Kafka, Airflow, Azure, Google Cloud, Docker or Kubernetes, and he is still building experience with very large real-world datasets.
Any tool missing from the skills above (for example Looker, Spark, Azure or GCP) is not on his skills list. Say so plainly and name the closest listed tool (Power BI or Tableau for dashboards, AWS and Snowflake for cloud and data warehousing).
`;