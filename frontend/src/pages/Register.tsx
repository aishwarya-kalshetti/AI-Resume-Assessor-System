import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 p-8 rounded-2xl shadow-xl dark:shadow-black/50 shadow-gray-200/50 transition-colors">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 dark:text-white text-gray-900">Create Account</h2>
        <p className="dark:text-gray-400 text-gray-500 text-sm">Join the TalentLens platform</p>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium dark:text-gray-400 text-gray-600 mb-1.5 pl-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full dark:bg-[#0d1117] bg-gray-50 border dark:border-gray-700 border-gray-300 rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            required
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-400 text-gray-600 mb-1.5 pl-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full dark:bg-[#0d1117] bg-gray-50 border dark:border-gray-700 border-gray-300 rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            required
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-400 text-gray-600 mb-1.5 pl-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full dark:bg-[#0d1117] bg-gray-50 border dark:border-gray-700 border-gray-300 rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            required
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-400 text-gray-600 mb-1.5 pl-1">I am a...</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full dark:bg-[#0d1117] bg-gray-50 border dark:border-gray-700 border-gray-300 rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20 mt-6 text-white tracking-wide">
          Sign Up
        </button>
      </form>

      <p className="mt-8 text-center text-sm dark:text-gray-500 text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium ml-1">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
