import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2, User } from 'lucide-react';
import axios from 'axios';

interface SimulationModalProps {
  match: any;
  onClose: () => void;
  token: string;
}

const SimulationModal: React.FC<SimulationModalProps> = ({ match, onClose, token }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: `Hello! I am ${match.candidateName || 'the candidate'}. I'm excited to discuss my experience and why I'm a good fit for this role. What would you like to ask me?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/copilot/simulate', {
        message: userMsg,
        matchId: match._id,
        history: messages
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble responding right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0d1117] w-full max-w-2xl h-[85vh] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden transform animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Interview Simulator: {match.candidateName || 'Candidate'}
              </h3>
              <p className="text-xs text-blue-100 font-medium tracking-wide uppercase">AI-Persona Logic • Based on Resume Data</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-500 uppercase tracking-widest">
              Live Simulation Session
            </div>
            <p className="text-xs text-gray-500 mt-2">The AI is acting as the candidate using their resume context.</p>
          </div>

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${msg.role === 'user' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100 text-gray-800 rounded-tl-none border border-gray-200 dark:border-gray-700'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-tl-none border border-gray-200 dark:border-gray-700">
                  <Loader2 size={16} className="text-blue-500 animate-spin" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d1117] shrink-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a technical or behavioral question..."
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-5 py-3 outline-none focus:border-blue-500 transition-colors dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-3.5 rounded-2xl transition-all shadow-lg active:scale-95 shrink-0"
            >
              <Send size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimulationModal;
