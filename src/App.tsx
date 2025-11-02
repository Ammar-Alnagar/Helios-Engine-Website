import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Users,
  Database,
  Globe,
  Terminal,
  Cpu,
  BookOpen,
  Github,
  Star,
  Download,
  ChevronRight,
  Sparkles,
  Code,
  Bot,
  Menu,
  X
} from 'lucide-react'
import DocsSection from './components/DocsSection'
import ExamplesSection from './components/ExamplesSection'

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Forest of Agents",
      description: "Multi-agent collaboration system where agents can communicate, delegate tasks, and share context for complex workflows.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "RAG System",
      description: "Retrieval-Augmented Generation with vector stores (InMemory and Qdrant) for enhanced knowledge and context.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Streaming",
      description: "True real-time response streaming for both remote and local models with immediate token delivery.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "16+ Built-in Tools",
      description: "Extensive tool suite including web scraping, JSON parsing, file I/O, shell commands, HTTP requests, and text processing.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Local Model Support",
      description: "Run models offline using llama.cpp with HuggingFace integration. Full offline capability with optional local feature.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "OpenAI-Compatible API",
      description: "Expose OpenAI-compatible API endpoints with full parameter support. Use as both CLI tool and Rust library crate.",
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  const stats = [
    { value: "16+", label: "Built-in Tools" },
    { value: "3", label: "Model Modes" },
    { value: "100%", label: "Rust Native" },
    { value: "24/7", label: "Documentation" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Helios Engine</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">Features</a>
              <a href="#docs" className="text-gray-600 hover:text-orange-600 transition-colors">Documentation</a>
              <a href="#examples" className="text-gray-600 hover:text-orange-600 transition-colors">Examples</a>
              <a href="https://github.com/Ammar-Alnagar/Helios-Engine" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-4 py-2">
                <Github className="w-4 h-4 inline mr-2" />
                GitHub
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
            >
              <div className="px-4 py-6 space-y-4">
                <a
                  href="#features"
                  className="block text-gray-600 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#docs"
                  className="block text-gray-600 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Documentation
                </a>
                <a
                  href="#examples"
                  className="block text-gray-600 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Examples
                </a>
                <a
                  href="https://github.com/Ammar-Alnagar/Helios-Engine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Github className="w-4 h-4 inline mr-2" />
                  GitHub
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              v0.3.4 - Latest Release
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              🔥 <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Helios Engine</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Powerful and flexible Rust framework for building LLM-powered agents with tool support,
              streaming chat capabilities, and easy configuration management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                <Terminal className="w-5 h-5 inline mr-2" />
                Get Started
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-4"
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                View Docs
              </motion.button>
            </div>

            {/* Quick Install */}
            <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-medium">Quick Install</span>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <code className="text-green-400 font-mono text-sm block">
                cargo install helios-engine
              </code>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Modern AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create intelligent agents that can interact with users, call tools, and maintain conversation context
              with both online and offline local model support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="card group cursor-pointer"
                onClick={() => setActiveFeature(index)}
              >
                <div className={`feature-icon bg-gradient-to-br ${feature.gradient}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-orange-600 font-medium">
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section id="examples" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple Yet Powerful
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with Helios Engine in minutes with our comprehensive examples and documentation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quick Start</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">1</span>
                  </div>
                  <span className="text-gray-700">Install with cargo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">2</span>
                  </div>
                  <span className="text-gray-700">Initialize configuration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">3</span>
                  </div>
                  <span className="text-gray-700">Start chatting with your agent</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Bot className="w-8 h-8 text-orange-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">CLI Tool</h4>
                  <p className="text-sm text-gray-600">Command-line interface for quick interactions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Code className="w-8 h-8 text-orange-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Rust Library</h4>
                  <p className="text-sm text-gray-600">Use as a dependency in your Rust projects</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-lg p-6 font-mono text-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-medium">Terminal</span>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              <div className="space-y-2 text-green-400">
                <div>$ cargo install helios-engine</div>
                <div>$ helios-engine init</div>
                <div>$ helios-engine chat</div>
                <div className="text-white">🤖 Hello! I'm your AI assistant powered by Helios Engine.</div>
                <div className="text-white">💬 What would you like to explore today?</div>
                <div>$</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <DocsSection />

      {/* Examples Section */}
      <ExamplesSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Amazing AI Agents?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join the growing community of developers building the future of AI with Helios Engine.
              Start your journey today with our comprehensive documentation and examples.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                <Terminal className="w-5 h-5 inline mr-2" />
                Get Started Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
              >
                <Github className="w-5 h-5 inline mr-2" />
                View on GitHub
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Helios Engine</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Powerful Rust framework for building LLM-powered agents with advanced features and easy integration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Installation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quick Start</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Issues</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discussions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contributing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Helios Engine. Made with ❤️ in Rust.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
