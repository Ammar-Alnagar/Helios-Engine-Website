import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface Example {
  id: string
  title: string
  description: string
  code: string
  output: string
  gradient: string
}

const InteractiveExamples = () => {
  const [activeExample, setActiveExample] = useState<string | null>(null)
  const [loadingExample, setLoadingExample] = useState<string | null>(null)
  const [displayedText, setDisplayedText] = useState<{ [key: string]: string }>({})
  const [isStreaming, setIsStreaming] = useState<string | null>(null)
  const [displayedCode, setDisplayedCode] = useState<{ [key: string]: string }>({})
  const [isCodeStreaming, setIsCodeStreaming] = useState<{ [key: string]: boolean }>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const examples: Example[] = [
    {
      id: 'basic-chat',
      title: 'Basic Chat Agent',
      description: 'Create a simple chat agent with streaming responses',
      gradient: 'from-blue-500 to-cyan-500',
      code: `use helios_engine::{Agent, LLMConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize agent with OpenAI
    let config = LLMConfig::openai("gpt-4");
    let mut agent = Agent::new(config)?;
    
    // Send a message and get response
    let response = agent
        .chat("What is Rust programming?")
        .await?;
    
    println!("Agent: {}", response);
    Ok(())
}`,
      output: `Agent: Rust is a systems programming language that focuses on safety, 
speed, and concurrency. It prevents memory errors and data races at 
compile time, making it ideal for building reliable and efficient software. 
Rust is commonly used for operating systems, game engines, web servers, 
and command-line tools.`
    },
    {
      id: 'agent-with-tools',
      title: 'Agent with Tools',
      description: 'Enable your agent to use built-in tools like web scraping and file operations',
      gradient: 'from-purple-500 to-pink-500',
      code: `use helios_engine::{Agent, LLMConfig, ToolRegistry};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = LLMConfig::openai("gpt-4");
    let mut agent = Agent::new(config)?;
    
    // Register built-in tools
    agent.register_tool(ToolRegistry::web_scraper())?;
    agent.register_tool(ToolRegistry::file_reader())?;
    agent.register_tool(ToolRegistry::json_parser())?;
    
    let response = agent
        .chat("Scrape the Rust homepage and summarize it")
        .await?;
    
    println!("{}", response);
    Ok(())
}`,
      output: `🔧 Using tool: web_scraper
📥 Fetching: https://www.rust-lang.org
✅ Successfully scraped 2,457 bytes

Summary: The Rust homepage highlights Rust as a language empowering everyone 
to build reliable and efficient software. Key features include performance, 
reliability, and productivity. The site showcases community projects, learning 
resources, and emphasizes Rust's use in production by companies like Mozilla, 
Dropbox, and Discord.`
    },
    {
      id: 'streaming-chat',
      title: 'Real-time Streaming',
      description: 'Stream responses in real-time for better user experience',
      gradient: 'from-orange-500 to-red-500',
      code: `use helios_engine::{Agent, LLMConfig};
use futures::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = LLMConfig::openai("gpt-4");
    let mut agent = Agent::new(config)?;
    
    // Create streaming response
    let mut stream = agent
        .chat_stream("Write a haiku about Rust")
        .await?;
    
    print!("Agent: ");
    while let Some(chunk) = stream.next().await {
        let text = chunk?;
        print!("{}", text);
    }
    println!();
    Ok(())
}`,
      output: `Agent: Memory safe code,
Blazing speed without the fear,
Rust empowers all.

✨ Streamed in real-time
⚡ Response time: 1.2s
📊 Tokens: 24`
    },
    {
      id: 'forest-agents',
      title: 'Forest of Agents',
      description: 'Multi-agent collaboration for complex workflows',
      gradient: 'from-green-500 to-teal-500',
      code: `use helios_engine::{Forest, Agent, LLMConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = LLMConfig::openai("gpt-4");
    
    // Create forest with multiple specialized agents
    let mut forest = Forest::new();
    
    let researcher = Agent::new(config.clone())?
        .with_role("Research Specialist");
    let writer = Agent::new(config.clone())?
        .with_role("Content Writer");
    let reviewer = Agent::new(config)?
        .with_role("Quality Reviewer");
    
    forest.add_agent("researcher", researcher);
    forest.add_agent("writer", writer);
    forest.add_agent("reviewer", reviewer);
    
    let result = forest
        .execute("Research and write about WebAssembly")
        .await?;
    
    println!("{}", result);
    Ok(())
}`,
      output: `🌲 Forest Coordination Active

👤 Researcher: Gathering information about WebAssembly...
   ✓ Found 15 relevant sources
   ✓ Key topics identified: performance, portability, security

✍️  Writer: Creating comprehensive article...
   ✓ Introduction drafted
   ✓ Technical details explained
   ✓ Use cases documented

🔍 Reviewer: Quality check in progress...
   ✓ Technical accuracy verified
   ✓ Readability score: 87/100
   ✓ All claims fact-checked

📄 Final output ready: "WebAssembly: The Future of Web Performance"
   Word count: 1,247 | Reading time: 6 minutes`
    },
    {
      id: 'rag-system',
      title: 'RAG with Vector Store',
      description: 'Retrieval-Augmented Generation for knowledge-enhanced responses',
      gradient: 'from-indigo-500 to-purple-500',
      code: `use helios_engine::{Agent, LLMConfig, RAG, VectorStore};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = LLMConfig::openai("gpt-4");
    let mut agent = Agent::new(config)?;
    
    // Create RAG system with in-memory vector store
    let mut rag = RAG::new(VectorStore::in_memory());
    
    // Add documents to knowledge base
    rag.add_document("rust_guide.md").await?;
    rag.add_document("api_docs.md").await?;
    rag.add_document("tutorials.md").await?;
    
    // Attach RAG to agent
    agent.with_rag(rag);
    
    let response = agent
        .chat("How do I implement async traits in Rust?")
        .await?;
    
    println!("{}", response);
    Ok(())
}`,
      output: `🔍 Searching knowledge base...
   ✓ Found 3 relevant documents
   ✓ Retrieved 5 code examples
   ✓ Context relevance: 94%

Based on the documentation, here's how to implement async traits in Rust:

1. Use the #[async_trait] macro from the async-trait crate
2. Define your trait with async methods
3. Implement it for your types

Example:
\`\`\`rust
use async_trait::async_trait;

#[async_trait]
trait AsyncProcessor {
    async fn process(&self, data: String) -> Result<String>;
}
\`\`\`

📚 Sources: rust_guide.md (lines 342-367), api_docs.md (section 4.2)`
    },
    {
      id: 'local-model',
      title: 'Local Model Support',
      description: 'Run models offline with llama.cpp integration',
      gradient: 'from-pink-500 to-rose-500',
      code: `use helios_engine::{Agent, LLMConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Configure local model with llama.cpp
    let config = LLMConfig::local()
        .model_path("./models/llama-2-7b.gguf")
        .context_size(4096)
        .temperature(0.7);
    
    let mut agent = Agent::new(config)?;
    
    println!("🚀 Running completely offline!");
    
    let response = agent
        .chat("Explain closures in Rust")
        .await?;
    
    println!("Agent: {}", response);
    Ok(())
}`,
      output: `🚀 Running completely offline!
📦 Loading model: llama-2-7b.gguf
✓ Model loaded (7B parameters)
💾 Memory usage: 4.2 GB
🔒 100% offline - no internet required

Agent: Closures in Rust are anonymous functions that can capture 
variables from their surrounding scope. They're defined using |args| syntax 
and can be stored in variables or passed as arguments. Rust closures 
automatically implement FnOnce, FnMut, or Fn traits depending on how they 
capture their environment.

⚡ Generation speed: 42 tokens/sec
🔋 Running on: CPU (16 threads)`
    },
    {
      id: 'custom-tools',
      title: 'Custom Tool Creation',
      description: 'Build your own custom tools for specialized tasks',
      gradient: 'from-yellow-500 to-orange-500',
      code: `use helios_engine::{Agent, LLMConfig, Tool, ToolBuilder};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a custom calculator tool
    let calculator = ToolBuilder::new("calculator")
        .description("Performs mathematical calculations")
        .parameter("expression", "The math expression to evaluate")
        .handler(|params| {
            let expr = params.get("expression")?;
            // Evaluation logic here
            Ok(format!("Result: {}", evaluate(expr)))
        })
        .build()?;
    
    let config = LLMConfig::openai("gpt-4");
    let mut agent = Agent::new(config)?;
    agent.register_tool(calculator)?;
    
    let response = agent
        .chat("What is 1234 * 5678?")
        .await?;
    
    println!("{}", response);
    Ok(())
}`,
      output: `🔧 Using tool: calculator
📊 Expression: 1234 * 5678
✓ Calculation complete

The result of 1234 × 5678 is 7,006,652.

This was calculated using the custom calculator tool that handles 
mathematical expressions with high precision.`
    },
    {
      id: 'memory-context',
      title: 'Conversation Memory',
      description: 'Maintain context across multiple interactions',
      gradient: 'from-teal-500 to-cyan-500',
      code: `use helios_engine::{Agent, LLMConfig, Memory};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = LLMConfig::openai("gpt-4");
    let mut agent = Agent::new(config)?
        .with_memory(Memory::new(10)); // Remember last 10 exchanges
    
    // First message
    agent.chat("My name is Alice").await?;
    
    // Second message - agent remembers context
    agent.chat("What's my name?").await?;
    
    // Third message - still remembers
    let response = agent
        .chat("Can you tell me about Rust?")
        .await?;
    
    println!("{}", response);
    Ok(())
}`,
      output: `💬 Message 1: "My name is Alice"
Agent: Nice to meet you, Alice! How can I assist you today?

💬 Message 2: "What's my name?"
Agent: Your name is Alice, as you just told me!

💬 Message 3: "Can you tell me about Rust?"
Agent: Of course, Alice! Rust is a systems programming language focused 
on safety, speed, and concurrency. It's great for building reliable and 
efficient software without garbage collection.

💾 Context window: 3 messages | Memory usage: 234 tokens`
    },
    {
      id: 'api-server',
      title: 'OpenAI-Compatible API',
      description: 'Serve your agent as an API endpoint',
      gradient: 'from-violet-500 to-purple-500',
      code: `use helios_engine::{Server, Agent, LLMConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create agent
    let config = LLMConfig::openai("gpt-4");
    let agent = Agent::new(config)?;
    
    // Start OpenAI-compatible API server
    let server = Server::new()
        .with_agent(agent)
        .port(8080)
        .enable_cors()
        .api_key("your-api-key");
    
    println!("🚀 Server running on http://localhost:8080");
    println!("📡 OpenAI-compatible endpoint: /v1/chat/completions");
    
    server.run().await?;
    Ok(())
}`,
      output: `🚀 Server running on http://localhost:8080
📡 OpenAI-compatible endpoint: /v1/chat/completions
✓ CORS enabled
🔐 API key authentication active

Available endpoints:
  POST   /v1/chat/completions
  POST   /v1/completions
  GET    /v1/models
  GET    /health

Ready to accept requests! You can now use this with any OpenAI client library.

Example curl command:
curl http://localhost:8080/v1/chat/completions \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "gpt-4", "messages": [...]}'`
    },
    {
      id: 'batch-processing',
      title: 'Batch Processing',
      description: 'Process multiple requests efficiently',
      gradient: 'from-emerald-500 to-green-500',
      code: `use helios_engine::{Agent, LLMConfig, BatchProcessor};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = LLMConfig::openai("gpt-4");
    let agent = Agent::new(config)?;
    
    let processor = BatchProcessor::new(agent)
        .max_concurrent(5)
        .retry_on_error(3);
    
    let prompts = vec![
        "Summarize machine learning",
        "Explain quantum computing",
        "Describe blockchain technology",
        "What is cloud computing?",
        "Define artificial intelligence",
    ];
    
    println!("Processing {} prompts...", prompts.len());
    let results = processor.process_batch(prompts).await?;
    
    for (i, result) in results.iter().enumerate() {
        println!("Result {}: {}", i + 1, result);
    }
    
    Ok(())
}`,
      output: `Processing 5 prompts...

⚡ Batch processing started
├─ Worker 1: Processing prompt 1/5
├─ Worker 2: Processing prompt 2/5
├─ Worker 3: Processing prompt 3/5
├─ Worker 4: Processing prompt 4/5
└─ Worker 5: Processing prompt 5/5

✓ Result 1: Machine learning is a subset of AI that enables systems to learn...
✓ Result 2: Quantum computing leverages quantum mechanics principles to...
✓ Result 3: Blockchain is a distributed ledger technology that ensures...
✓ Result 4: Cloud computing delivers computing services over the internet...
✓ Result 5: Artificial intelligence is the simulation of human intelligence...

📊 Statistics:
   Total prompts: 5
   Successful: 5
   Failed: 0
   Average time: 2.3s per prompt
   Total time: 3.1s (parallel execution)`
    },
    {
      id: 'error-handling',
      title: 'Error Handling & Retry',
      description: 'Robust error handling with automatic retries',
      gradient: 'from-red-500 to-pink-500',
      code: `use helios_engine::{Agent, LLMConfig, RetryPolicy};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = LLMConfig::openai("gpt-4");
    
    let mut agent = Agent::new(config)?
        .with_retry(RetryPolicy::exponential()
            .max_attempts(3)
            .initial_delay(1000)
        )
        .with_timeout(30_000) // 30 seconds
        .on_error(|error| {
            eprintln!("⚠️  Error: {}", error);
        });
    
    match agent.chat("Explain error handling").await {
        Ok(response) => println!("✓ {}", response),
        Err(e) => eprintln!("✗ Failed after retries: {}", e),
    }
    
    Ok(())
}`,
      output: `Attempting request...
⚠️  Error: Request timeout
⏳ Retrying in 1s... (attempt 1/3)

Attempting request...
⚠️  Error: Rate limit exceeded
⏳ Retrying in 2s... (attempt 2/3)

Attempting request...
✓ Success!

Error handling in Rust is managed through the Result type, which can be 
either Ok(value) or Err(error). This forces explicit handling of potential 
failures, making your code more robust and reliable.

📊 Request Stats:
   Total attempts: 3
   Failures: 2
   Success: 1
   Total time: 4.2s`
    }
  ]

  const handleTryMe = (exampleId: string) => {
    if (activeExample === exampleId) {
      // Hide output
      setActiveExample(null)
      setLoadingExample(null)
      setDisplayedText({})
      setIsStreaming(null)
    } else {
      // Show loading then output
      setLoadingExample(exampleId)
      setActiveExample(null)
      setDisplayedText({})
      
      // Simulate execution time (1.5 seconds)
      setTimeout(() => {
        setLoadingExample(null)
        setActiveExample(exampleId)
        setIsStreaming(exampleId)
        
        // Start streaming animation
        const example = examples.find(ex => ex.id === exampleId)
        if (example) {
          streamText(exampleId, example.output)
        }
      }, 1500)
    }
  }

  const streamText = (exampleId: string, text: string) => {
    let currentIndex = 0
    const chunkSize = 2 // Characters to add per interval
    const interval = 20 // Milliseconds between chunks
    
    const streamInterval = setInterval(() => {
      if (currentIndex < text.length) {
        currentIndex += chunkSize
        setDisplayedText(prev => ({
          ...prev,
          [exampleId]: text.slice(0, currentIndex)
        }))
      } else {
        clearInterval(streamInterval)
        setIsStreaming(null)
      }
    }, interval)
  }

  const streamCode = (exampleId: string, code: string) => {
    let currentIndex = 0
    const chunkSize = 3 // Characters to add per interval
    const interval = 15 // Milliseconds between chunks (faster for code)
    
    setIsCodeStreaming(prev => ({ ...prev, [exampleId]: true }))
    
    const streamInterval = setInterval(() => {
      if (currentIndex < code.length) {
        currentIndex += chunkSize
        setDisplayedCode(prev => ({
          ...prev,
          [exampleId]: code.slice(0, currentIndex)
        }))
      } else {
        clearInterval(streamInterval)
        setIsCodeStreaming(prev => ({ ...prev, [exampleId]: false }))
      }
    }, interval)
  }

  // Start streaming code when component mounts
  useEffect(() => {
    // Only stream code for the current example
    const currentExample = examples[currentIndex]
    if (currentExample && !displayedCode[currentExample.id]) {
      setTimeout(() => {
        streamCode(currentExample.id, currentExample.code)
      }, 300)
    }
  }, [currentIndex]) // Re-run when currentIndex changes

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevExample()
      } else if (e.key === 'ArrowRight') {
        nextExample()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  // Fade effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Check if section is scrolling out of view
        // Start fading when the section is about to exit viewport
        if (rect.top < -windowHeight * 0.2) {
          setIsFading(true)
        } else {
          setIsFading(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const nextExample = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length)
    setActiveExample(null)
    setLoadingExample(null)
  }

  const prevExample = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length)
    setActiveExample(null)
    setLoadingExample(null)
  }

  const goToExample = (index: number) => {
    setCurrentIndex(index)
    setActiveExample(null)
    setLoadingExample(null)
  }

  return (
    <section 
      ref={sectionRef}
      id="interactive-examples" 
      className={`py-20 bg-gray-50 dark:bg-gray-800 fade-section ${isFading ? 'fading' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Interactive Examples
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore Helios Engine capabilities with live code examples. Click "Try Me" to see the expected output.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevExample}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-gray-700"
            aria-label="Previous example"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          
          <button
            onClick={nextExample}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-gray-700"
            aria-label="Next example"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Carousel Content */}
          <AnimatePresence mode="wait">
            {examples.map((example, index) => index === currentIndex && (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="card"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {example.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {example.description}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${example.gradient} flex-shrink-0 ml-4 mt-2`}></div>
              </div>

              {/* Code Block */}
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-300">main.rs</span>
                    {isCodeStreaming[example.id] && (
                      <span className="text-xs text-orange-400 flex items-center">
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ● typing...
                        </motion.span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <pre className="p-4 overflow-x-auto min-h-[200px]">
                  <code className="text-sm font-mono text-gray-100 leading-relaxed">
                    {displayedCode[example.id] || ''}
                    {isCodeStreaming[example.id] && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-gray-100 ml-1"
                      />
                    )}
                  </code>
                </pre>
              </div>

              {/* Try Me Button */}
              <motion.button
                onClick={() => handleTryMe(example.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loadingExample === example.id}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeExample === example.id || loadingExample === example.id
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    : `bg-gradient-to-r ${example.gradient} text-white shadow-lg hover:shadow-xl`
                }`}
              >
                {loadingExample === example.id ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 dark:border-gray-500 dark:border-t-gray-300 rounded-full"
                    />
                    <span>Running...</span>
                  </>
                ) : activeExample === example.id ? (
                  <>
                    <X className="w-5 h-5" />
                    <span>Hide Output</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Try Me</span>
                  </>
                )}
              </motion.button>

              {/* Loading Panel */}
              <AnimatePresence>
                {loadingExample === example.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-orange-500 rounded-full"
                        />
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Executing code...
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Compiling and running your Rust program
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Output Panel */}
              <AnimatePresence>
                {activeExample === example.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${
                          isStreaming === example.id 
                            ? 'bg-orange-500 animate-pulse' 
                            : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {isStreaming === example.id ? 'Streaming...' : 'Output:'}
                        </span>
                      </div>
                      <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {displayedText[example.id] || ''}
                        {isStreaming === example.id && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-2 h-4 bg-gray-800 dark:bg-gray-200 ml-1"
                          />
                        )}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            ))}
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            {examples.map((example, index) => (
              <button
                key={example.id}
                onClick={() => goToExample(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-orange-600'
                    : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to example ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {currentIndex + 1} / {examples.length}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Want to try these examples yourself? Check out our examples directory on GitHub.
          </p>
          <motion.a
            href="https://github.com/Ammar-Alnagar/Helios-Engine/tree/master/examples"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-block"
          >
            Browse All Examples
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default InteractiveExamples
