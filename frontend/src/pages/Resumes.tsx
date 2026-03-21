import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileUp, FileText, Loader2 } from 'lucide-react';

const Resumes: React.FC = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, [user]);

  const fetchResumes = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/resumes/my', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setResumes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post('http://localhost:5000/api/resumes/upload', formData, {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      fetchResumes();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black dark:text-gray-100 text-gray-900 tracking-tight">
          My Resumes
        </h1>
        <p className="dark:text-gray-400 text-gray-600 font-medium tracking-wide">Upload and manage your resume profiles for AI matching.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold dark:text-gray-100 text-gray-900 mb-4">Upload New Resume</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:bg-gray-800/50 transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <FileUp className="mx-auto h-10 w-10 text-gray-500 mb-3 group-hover:text-blue-400 transition-colors" />
                <p className="text-sm font-medium text-gray-300">
                  {file ? file.name : "Click or drag file to upload"}
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF format (max 5MB)</p>
              </div>
              <button 
                type="submit" 
                disabled={!file || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold transition-all shadow-lg flex justify-center items-center"
              >
                {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Parse Resume'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold dark:text-gray-100 text-gray-900 mb-4">Parsed Profiles</h3>
          {resumes.length === 0 ? (
            <div className="dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 p-8 rounded-2xl text-center dark:text-gray-500 text-gray-500">
              No resumes uploaded yet.
            </div>
          ) : (
            resumes.map(resume => (
              <div key={resume._id} className="dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-6 hover:border-gray-700 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg dark:text-white text-gray-900">{resume.fileName}</h4>
                  <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">Uploaded on {new Date(resume.createdAt).toLocaleDateString()}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <span className="text-gray-500 block mb-1.5 font-medium">Top Skills Extracted</span>
                      <div className="flex flex-wrap gap-1.5">
                        {resume.parsedData?.skills?.map((skill: string, i: number) => (
                          <span key={i} className="bg-[#0d1117] border border-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="dark:text-gray-500 text-gray-500 block mb-1.5 font-medium">Est. Experience</span>
                      <p className="dark:text-gray-200 text-gray-700">{resume.parsedData?.experienceYears} years</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Resumes;
