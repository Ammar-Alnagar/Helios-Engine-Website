import { motion } from 'framer-motion'
import { useState } from 'react'
import { Play, Copy, Check, Code, Terminal, Users, Database, FileText } from 'lucide-react'

const ExamplesSection = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const examples = [
    {
      title: "Basic Chat Agent",
      description: "Simple conversational agent with memory",
      icon: <Terminal className="w-5 h-5" />,
      difficulty: "Beginner",
      code: `use helios_engine::{Agent, Config};

#[tokio::main]
async fn main() -> helios_engine::Result<()> {
    let config = Config::from_file("config.toml")?;

    let mut agent = Agent::builder("BasicAgent")
        .config(config)
        .system_prompt("You are a helpful assistant.")
        .build()
        .await?;

    let response = agent.chat("Hello! How are you?").await?;
    println!("Agent: {}", response);

    Ok(())
}`,
      features: ["Conversation Memory", "Simple Setup"]
    },
    {
      title: "Agent with Tools",
      description: "Enhanced agent with calculator and echo tools",
      icon: <Code className="w-5 h-5" />,
      difficulty: "Intermediate",
      code: `use helios_engine::{Agent, CalculatorTool, Config, EchoTool};

#[tokio::main]
async fn main() -> helios_engine::Result<()> {
    let config = Config::from_file("config.toml")?;

    let mut agent = Agent::builder("ToolAgent")
        .config(config)
        .system_prompt("You are a helpful assistant with access to tools.")
        .tool(Box::new(CalculatorTool))
        .tool(Box::new(EchoTool))
        .build()
        .await?;

    // The agent can now calculate and echo
    let response = agent.chat("What is 25 * 4 + 10?").await?;
    println!("Agent: {}", response);

    Ok(())
}`,
      features: ["16+ Built-in Tools", "Tool Chaining", "Auto Tool Selection"]
    },
    {
      title: "Forest of Agents",
      description: "Multi-agent collaboration system",
      icon: <Users className="w-5 h-5" />,
      difficulty: "Advanced",
      code: `use helios_engine::{Agent, Config, ForestBuilder};

#[tokio::main]
async fn main() -> helios_engine::Result<()> {
    let config = Config::from_file("config.toml")?;

    let mut forest = ForestBuilder::new()
        .config(config)
        .agent(
            "coordinator".to_string(),
            Agent::builder("coordinator")
                .system_prompt("You coordinate team projects.")
        )
        .agent(
            "researcher".to_string(),
            Agent::builder("researcher")
                .system_prompt("You research and analyze information.")
        )
        .build()
        .await?;

    // Agents can communicate and collaborate
    forest
        .send_message(
            &"coordinator".to_string(),
            Some(&"researcher".to_string()),
            "Research sustainable energy solutions.".to_string(),
        )
        .await?;

    Ok(())
}`,
      features: ["Multi-Agent Communication", "Task Delegation", "Collaborative Workflows"]
    },
    {
      title: "RAG with Vector Store",
      description: "Retrieval-Augmented Generation with Qdrant",
      icon: <Database className="w-5 h-5" />,
      difficulty: "Advanced",
      code: `use helios_engine::{Agent, Config, RagTool, QdrantStore};

#[tokio::main]
async fn main() -> helios_engine::Result<()> {
    let config = Config::from_file("config.toml")?;

    // Create RAG-enabled agent
    let mut agent = Agent::builder("RagAgent")
        .config(config)
        .tool(Box::new(RagTool::new(QdrantStore::new(
            "http://localhost:6334".to_string(),
            "documents".to_string(),
        ))))
        .build()
        .await?;

    // Agent can now search and retrieve relevant information
    let response = agent.chat(
        "What are the latest findings about sustainable energy?"
    ).await?;
    println!("Agent: {}", response);

    Ok(())
}`,
      features: ["Vector Search", "Document Retrieval", "Knowledge Enhancement"]
    }
  ]

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Interactive Code Examples
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive collection of examples ranging from basic chatbots to advanced
            multi-agent systems and RAG implementations.
          </p>
        </motion.div>

        {/* Examples Grid */}
        <div className="space-y-8">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Description */}
                <div className="lg:w-1/3">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      {example.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(example.difficulty)}`}>
                      {example.difficulty}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    {example.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {example.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Features:</h4>
                    <ul className="space-y-1">
                      {example.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary flex-1"
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      Run Example
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(example.code, index)}
                      className="btn-secondary p-3"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Code Block */}
                <div className="lg:w-2/3">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
                      <span className="text-white font-medium text-sm">Rust</span>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-green-400 font-mono text-sm leading-relaxed">
                        {example.code}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Want to explore more examples?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of 20+ examples covering everything from basic usage to advanced features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://github.com/Ammar-Alnagar/Helios-Engine/tree/master/examples"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-block"
            >
              <FileText className="w-5 h-5 inline mr-2" />
              View All Examples
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator.clipboard.writeText('git clone https://github.com/Ammar-Alnagar/Helios-Engine.git')}
              className="btn-secondary"
            >
              <Code className="w-5 h-5 inline mr-2" />
              Clone Repository
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ExamplesSection
