import { useState } from 'react';
import { Menu, X, ChevronRight, BarChart3, TrendingUp, Database, Code } from 'lucide-react';

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Hina
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="hover:text-cyan-400 transition-colors text-sm font-medium"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Hi, I'm <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Hina</span>
                </h1>
                <p className="text-xl text-slate-300">
                  Data Analyst | Insights Architect | Data Storyteller
                </p>
              </div>
              
              <p className="text-lg text-slate-400 leading-relaxed">
                I transform complex data into actionable insights. Specialized in building dashboards, conducting statistical analysis, and helping businesses make data-driven decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  View My Work <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  Get In Touch
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
                <div className="absolute inset-0 bg-slate-800/50 rounded-3xl border-2 border-cyan-400/30 flex items-center justify-center">
                  <BarChart3 size={120} className="text-cyan-400/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">About Me</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Database size={40} />,
                title: "Data Management",
                desc: "Proficient in SQL, data warehousing, and ETL processes to manage large datasets efficiently."
              },
              {
                icon: <TrendingUp size={40} />,
                title: "Data Visualization",
                desc: "Creating compelling visualizations with Tableau, Power BI, and Python libraries."
              },
              {
                icon: <Code size={40} />,
                title: "Analytics & Programming",
                desc: "Strong in Python, R, and Excel for statistical analysis and predictive modeling."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-400/10">
                <div className="text-cyan-400 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Sales Dashboard",
                desc: "Interactive Power BI dashboard analyzing Q1-Q4 sales trends across 5 regions, revealing 23% YoY growth."
              },
              {
                title: "Customer Segmentation",
                desc: "Applied K-means clustering to segment 50K+ customers into behavioral groups, improving targeting efficiency."
              },
              {
                title: "Predictive Analytics Model",
                desc: "Built machine learning model predicting customer churn with 87% accuracy using Python and scikit-learn."
              },
              {
                title: "Market Research Analysis",
                desc: "Conducted comprehensive market analysis with statistical testing, identifying 3 key market opportunities."
              }
            ].map((project, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-lg p-8 hover:border-cyan-400/50 transition-all hover:translate-y-[-4px] hover:shadow-lg hover:shadow-cyan-400/20">
                <h3 className="text-2xl font-bold mb-3 text-cyan-400">{project.title}</h3>
                <p className="text-slate-300 leading-relaxed">{project.desc}</p>
                <button className="mt-6 text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2">
                  Learn More <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Skills & Tools</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { category: "Languages", items: ["Python", "R", "SQL", "Excel VBA"] },
              { category: "BI Tools", items: ["Power BI", "Tableau", "Google Analytics", "Looker"] },
              { category: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "BigQuery"] },
              { category: "Other", items: ["Statistics", "A/B Testing", "Git", "Data Storytelling"] }
            ].map((skill, idx) => (
              <div key={idx} className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map((item, i) => (
                    <li key={i} className="text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-slate-300 mb-10 text-lg">
            Interested in discussing data strategies or collaboration? I'd love to hear from you!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hina@example.com" className="bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Email Me
            </a>
            <a href="#" className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg font-semibold transition-all">
              LinkedIn Profile
            </a>
            <a href="#" className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg font-semibold transition-all">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8 px-4 text-center text-slate-400">
        <p>© 2025 Hina. All rights reserved. | Data Analyst & Business Intelligence Specialist</p>
      </footer>
    </div>
  );
}