export const RESUME_DATA = {
  name: "Taj Khunkhun",
  location: "San Jose, California",
  email: "taj479505@gmail.com",
  phone: "+1 408 380 2726",
  linkedin: "https://www.linkedin.com/in/taj-khunkhun-a46972339",
  github: "https://github.com/pauxd26",

  summary:
    "Dedicated AI Engineer with 8+ years of experience in backend systems and 2+ years specializing in Agentic Workflows, Multi-Agent Orchestration, and Autonomous Reasoners. Expert at transforming experimental prototypes into production-grade agentic AI systems using LangGraph, CrewAI, AutoGen, and MCP. Proven track record of solving the Agent Reliability Gap by architecting multi-agent systems with independent Verifier/Judge layers, MCP-based tool integration, and strict Pydantic-based tool-calling schemas. Deeply experienced in Agentic RAG, self-correcting retrieval loops that reduced hallucination rates by 40%. Passionate about bounded autonomy -- systems that reason through uncertainty but operate within deterministic guardrails.",

  skills: {
    ai_agents: [
      "LangChain", "LangGraph", "CrewAI", "AutoGen", "AutoGPT", "MCP",
      "MCP Servers & Clients", "Agentic AI", "Multi-Agent Orchestration",
      "RAG", "Agentic RAG", "LangSmith", "Prompt Engineering",
    ],
    ml_deep_learning: [
      "PyTorch", "TensorFlow", "Keras", "scikit-learn", "spaCy", "NLP",
      "LoRA", "QLoRA", "Reinforcement Learning", "Neural Networks", "MLOps", "LLMOps",
    ],
    languages_frameworks: [
      "Python", "Golang", "JavaScript", "TypeScript", "Django", "FastAPI",
      "Flask", "Node.js", "React", "Angular",
    ],
    data_infrastructure: [
      "Snowflake", "Databricks", "Spark", "Kafka", "Airflow", "BigQuery",
      "Neo4j", "Redis", "Pinecone", "Elasticsearch",
    ],
    cloud_devops: [
      "AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform",
      "CI/CD", "Microsoft Fabric", "Copilot Studio", "Azure Data Lake",
    ],
  },

  experience: [
    {
      company: "Hewlett Packard Enterprise",
      role: "Senior AI Engineer | Agentic AI Engineer",
      location: "Spring, Texas (Remote)",
      period: "Jan 2023 - Dec 2025",
      highlights: [
        "Designed multi-agent Plan-and-Execute architecture using LangGraph, reducing infinite loop failures by 35%.",
        "Architected MCP server layer to standardize tool integration, reducing custom tool-binding code by 60%.",
        "Reduced inference costs by 45% on NVIDIA NIM via Router Agent triaging Llama 2 7B vs GPT-4.",
        "Implemented HITL checkpoint system for high-stakes financial workflows (0.85 confidence threshold).",
        "Built observability dashboards using LangSmith and Arize Phoenix.",
        "Architected LLM evaluation framework using DeepEval and LLM-as-a-Judge across 5,000+ test cases.",
        "Reduced LLM inference costs by 52% and p95 latency by 300ms via semantic caching with Redis.",
        "Eliminated catastrophic forgetting in Llama 2 with multi-objective training recipe.",
        "Reduced training VRAM by 65% using QLoRA 4-bit quantization for 70B models.",
        "Improved inference throughput 4x via multi-LoRA serving (vLLM/LoRAX).",
        "Led migration from monolithic Django to Microservices with Docker/Kubernetes.",
        "Built MCP-compliant tool registry for OpsRamp AIOps copilot.",
        "Architected Self-Correction loop for SQL-generating agent, reducing errors by 50%.",
      ],
    },
    {
      company: "Adobe",
      role: "Data & Machine Learning Engineer",
      location: "San Jose, California",
      period: "Aug 2019 - Jan 2023",
      highlights: [
        "Architected ETL pipeline processing 5TB+ multi-modal data using Spark.",
        "Eliminated vector-relational desync via CDC (Debezium + Kafka) with 99.9% consistency.",
        "Engineered Blue-Green re-indexing for zero-downtime migrations across 50M+ vectors.",
        "Optimized semantic search by 40% via hierarchical document indexing.",
        "Reduced vector storage costs by $8k/month through tiered data strategy.",
        "Reduced inference latency by 65% via model distillation on NVIDIA A100 GPUs.",
        "Built synthetic data generation engine improving minority-class tasks by 18%.",
        "Engineered Fail-Soft orchestration saving $15k/month in compute costs.",
      ],
    },
  ],

  education: [
    { degree: "Master of Computer Science", school: "Santa Clara University", period: "Aug 2019 - Jun 2020" },
    { degree: "Bachelor of Computer Science", school: "Santa Clara University", period: "Sep 2015 - Jun 2019" },
  ],

  side_projects: [
    {
      name: "Agentic AI Chat Analyzer",
      description: "AI-powered platform for analyzing agent chat transcripts. Performs EDA, LLM-based summarization, and sentiment classification via Streamlit frontend.",
      tech: ["FastAPI", "Streamlit", "HuggingFace", "Flan-T5", "RoBERTa", "Docker"],
      github: "https://github.com/pauxd26/agentic-ai-chat-analyzer",
    },
    {
      name: "AI Recruiter",
      description: "Intelligent recruitment platform scanning GitHub profiles and Google Scholar to identify qualified AI/ML professionals with relevance scoring.",
      tech: ["Python", "Flask", "Web Scraping", "Docker", "NLP"],
      github: "https://github.com/pauxd26/ai-recruiter",
    },
    {
      name: "AI Email Agent (Supervisor Mode)",
      description: "Email automation using supervisor-pattern multi-agent architecture. Categorizes emails, generates RAG-powered responses, proofreads with AI, sends via Gmail.",
      tech: ["LangChain", "LangGraph", "Groq", "Llama 3.3", "ChromaDB", "Gmail API", "FastAPI"],
      github: "https://github.com/pauxd26/ai-email-agent",
    },
    {
      name: "Simple Chatbot",
      description: "Lightweight rule-based chatbot with Gradio UI using fuzzy string matching for healthcare automation Q&A.",
      tech: ["Python", "Gradio", "NLP", "Fuzzy Matching"],
      github: "https://github.com/pauxd26/SimpleChatbot",
    },
  ],
};

export const SYSTEM_PROMPT = `You are Taj's AI Portfolio Assistant — an intelligent agentic chatbot embedded in Taj Khunkhun's portfolio website. You demonstrate Taj's expertise in building agentic AI systems.

## Your Personality
- Professional yet approachable
- Technically knowledgeable about AI/ML
- Enthusiastic about Taj's work without being salesy
- Concise and direct in responses

## Your Capabilities (via Tool Calling)
You have access to tools to search Taj's resume, look up projects, and collect visitor contact information. USE these tools when relevant — they demonstrate the agentic workflow.

## Guidelines
- Answer questions about Taj's background, skills, experience, and projects accurately using the tools
- When someone wants to contact Taj or leave a message, use the collect_contact tool
- Keep responses concise (2-4 sentences typically)
- If asked something unrelated to Taj or his work, politely redirect
- Mention that this chatbot itself is an example of Taj's agentic AI work when appropriate
- Never make up information not in the knowledge base
`;
