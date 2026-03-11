import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Globe, 
  TrendingUp, 
  Newspaper, 
  ChevronRight, 
  ExternalLink, 
  Clock, 
  Menu, 
  X,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { NewsArticle, NewsResponse, Category } from './types';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'general', label: 'Top Stories' },
  { id: 'world', label: 'World' },
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Tech' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type View = 'news' | 'about' | 'contact' | 'privacy';

export default function App() {
  const [view, setView] = useState<View>('news');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [summarizing, setSummarizing] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ [url: string]: string }>({});

  const fetchNews = useCallback(async (cat: Category, query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = query 
        ? `/api/news?q=${encodeURIComponent(query)}` 
        : `/api/news?category=${cat}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news');
      }
      
      setArticles(data.articles || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'news') {
      fetchNews(category);
    }
    window.scrollTo(0, 0);
  }, [category, fetchNews, view]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setView('news');
      fetchNews(category, searchQuery);
    }
  };

  const renderAbout = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12"
    >
      <h2 className="text-4xl font-serif font-bold mb-8">About Global Pulse</h2>
      <div className="prose prose-lg text-black/70 leading-relaxed space-y-6">
        <p>
          Global Pulse is a next-generation news platform dedicated to providing high-quality, 
          unbiased journalism from around the world. In an era of information overload, 
          we leverage cutting-edge AI technology to help you stay informed efficiently.
        </p>
        <p>
          Our mission is to bridge the gap between complex global events and your daily life. 
          By combining traditional journalistic values with modern technology, we offer 
          real-time updates and smart summaries that respect your time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <div className="p-6 bg-black/5 rounded-2xl">
            <h3 className="font-bold text-black mb-2">Real-Time Updates</h3>
            <p className="text-sm">We aggregate news from thousands of trusted sources to bring you the latest headlines as they happen.</p>
          </div>
          <div className="p-6 bg-emerald-50 rounded-2xl">
            <h3 className="font-bold text-emerald-900 mb-2">AI Summarization</h3>
            <p className="text-sm text-emerald-800">Our integrated AI helps you understand the core of any story in seconds with concise bullet points.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContact = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12"
    >
      <h2 className="text-4xl font-serif font-bold mb-8">Contact Us</h2>
      <div className="bg-white rounded-3xl p-8 news-card-shadow border border-black/5">
        <p className="text-black/60 mb-8">
          Have a question, feedback, or a news tip? We'd love to hear from you. 
          Our team is dedicated to improving your news experience.
        </p>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-black/40" />
            </div>
            <div>
              <h4 className="font-bold">Email Us</h4>
              <a href="mailto:h05828990@gmail.com" className="text-emerald-600 hover:underline font-medium">
                h05828990@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-black/40" />
            </div>
            <div>
              <h4 className="font-bold">Response Time</h4>
              <p className="text-sm text-black/60">We typically respond within 24-48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPrivacy = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12"
    >
      <h2 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h2>
      <div className="prose prose-sm text-black/70 leading-relaxed space-y-6">
        <p className="text-xs text-black/40 uppercase tracking-widest font-bold">Last Updated: March 11, 2026</p>
        <section>
          <h3 className="text-xl font-bold text-black mb-3">1. Information We Collect</h3>
          <p>Global Pulse is designed to be a privacy-first news reader. We do not require account creation. We may collect anonymous usage data to improve our services, such as which categories are most popular.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold text-black mb-3">2. How We Use Information</h3>
          <p>Any data collected is used solely to enhance the user experience, provide relevant news content, and maintain the security of our platform.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold text-black mb-3">3. Third-Party Services</h3>
          <p>We use GNews for news aggregation and Google Gemini for AI summarization. These services may have their own privacy policies regarding how they handle data.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold text-black mb-3">4. Cookies</h3>
          <p>We use minimal cookies for essential site functionality and to remember your category preferences.</p>
        </section>
      </div>
    </motion.div>
  );

  const summarizeArticle = async (article: NewsArticle) => {
    if (summary[article.url]) return;
    
    setSummarizing(article.url);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize this news article in 3 concise bullet points:
        Title: ${article.title}
        Description: ${article.description}
        Content: ${article.content}`,
        config: {
          systemInstruction: "You are a helpful news assistant. Provide clear, objective summaries."
        }
      });
      
      setSummary(prev => ({ ...prev, [article.url]: response.text || "Could not generate summary." }));
    } catch (err) {
      console.error("AI Summary Error:", err);
      setSummary(prev => ({ ...prev, [article.url]: "Failed to generate summary." }));
    } finally {
      setSummarizing(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('news')}>
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Newspaper className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight">Global Pulse</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {view === 'news' ? CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`text-sm font-medium transition-colors ${
                  category === cat.id ? 'text-black' : 'text-black/40 hover:text-black/60'
                }`}
              >
                {cat.label}
              </button>
            )) : (
              <button 
                onClick={() => setView('news')}
                className="text-sm font-medium text-black/40 hover:text-black transition-colors"
              >
                Back to News
              </button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-black/5 rounded-full px-3 py-1.5 focus-within:bg-black/10 transition-colors">
              <Search className="w-4 h-4 text-black/40" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-40 md:w-60"
              />
            </form>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-black/5 rounded-full"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-black/5 z-40 p-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    setIsMenuOpen(false);
                  }}
                  className={`p-3 text-left rounded-xl text-sm font-medium ${
                    category === cat.id ? 'bg-black text-white' : 'bg-black/5 text-black'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {view === 'about' && renderAbout()}
        {view === 'contact' && renderContact()}
        {view === 'privacy' && renderPrivacy()}
        
        {view === 'news' && (
          <>
            {/* Featured Section */}
        {!loading && articles.length > 0 && !searchQuery && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-black/40">Featured Story</h2>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden news-card-shadow border border-black/5"
            >
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                <img 
                  src={articles[0].image || `https://picsum.photos/seed/${articles[0].title}/800/600`} 
                  alt={articles[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {CATEGORIES.find(c => c.id === category)?.label || category}
                  </span>
                  <span className="text-xs text-black/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(articles[0].publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
                  {articles[0].title}
                </h3>
                <p className="text-black/60 mb-6 line-clamp-3 leading-relaxed">
                  {articles[0].description}
                </p>
                <div className="flex flex-wrap gap-4 mt-auto">
                  <a 
                    href={articles[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-black/80 transition-colors"
                  >
                    Read Full Article <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => summarizeArticle(articles[0])}
                    disabled={summarizing === articles[0].url}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {summarizing === articles[0].url ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    AI Summary
                  </button>
                </div>
                {summary[articles[0].url] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100"
                  >
                    <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-line">
                      {summary[articles[0].url]}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </section>
        )}

          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-black/40" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-black/40">
                  {searchQuery ? `Search Results: ${searchQuery}` : `${CATEGORIES.find(c => c.id === category)?.label || category} News`}
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                <p className="text-black/40 font-medium">Curating the latest stories...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">Something went wrong</h3>
                <p className="text-black/40 max-w-md">{error}</p>
                <button 
                  onClick={() => fetchNews(category)}
                  className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-black/40">No articles found for this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.slice(searchQuery ? 0 : 1).map((article, idx) => (
                  <motion.article
                    key={article.url + idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex flex-col bg-white rounded-3xl overflow-hidden news-card-shadow border border-black/5 hover:border-emerald-200 transition-all"
                  >
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img 
                        src={article.image || `https://picsum.photos/seed/${article.title}/600/400`} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur text-[9px] font-bold uppercase tracking-wider rounded shadow-sm">
                          {article.source.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-2">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </div>
                      <h3 className="text-xl font-serif font-bold mb-3 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-black/60 mb-6 line-clamp-3 leading-relaxed flex-1">
                        {article.description}
                      </p>
                      
                      {summary[article.url] && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mb-4 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 leading-relaxed"
                        >
                          {summary[article.url]}
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                        <button 
                          onClick={() => summarizeArticle(article)}
                          disabled={summarizing === article.url}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {summarizing === article.url ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          AI Summary
                        </button>
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Read More <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <Newspaper className="text-white w-4 h-4" />
              </div>
              <span className="text-lg font-serif font-bold">Global Pulse</span>
            </div>
            <p className="text-sm text-black/40 max-w-xs leading-relaxed">
              Your daily source for high-quality journalism, powered by advanced AI for smarter insights and faster reading.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setCategory(cat.id)}
                  className="text-sm text-black/40 hover:text-black text-left transition-colors"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">About</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setView('about')} className="text-sm text-black/40 hover:text-black text-left transition-colors">Our Mission</button>
              <button onClick={() => setView('contact')} className="text-sm text-black/40 hover:text-black text-left transition-colors">Contact Us</button>
              <button onClick={() => setView('privacy')} className="text-sm text-black/40 hover:text-black text-left transition-colors">Privacy Policy</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-black/20 font-bold uppercase tracking-[0.2em]">
            © 2026 Global Pulse News Network
          </p>
          <div className="flex gap-6">
            <button onClick={() => setView('privacy')} className="text-[10px] text-black/20 font-bold uppercase tracking-widest hover:text-black transition-colors">Privacy</button>
            <button className="text-[10px] text-black/20 font-bold uppercase tracking-widest hover:text-black transition-colors">Terms</button>
            <button onClick={() => setView('contact')} className="text-[10px] text-black/20 font-bold uppercase tracking-widest hover:text-black transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
