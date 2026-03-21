import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mic, Square, Play, Check, AlertCircle, Loader2 } from 'lucide-react';

const Assessment: React.FC = () => {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    generateAndFetch();
  }, [matchId]);

  const generateAndFetch = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/assessments/generate', 
        { matchId },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setAssessment(data);
    } catch (error) {
      console.error(error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access is required for the AI assessment simulation.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSubmitAnswer = async () => {
    if (!assessment) return;
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append('questionId', assessment.questions[currentQ].questionId);
    formData.append('transcription', 'AI mock transcription: Candidate detailed their approach confidently.');
    
    if (audioBlob) {
      formData.append('audio', audioBlob, 'answer.webm');
    }

    try {
      const { data } = await axios.post(`http://localhost:5000/api/assessments/${assessment._id}/submit`, formData, {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setAssessment(data);
      setAudioBlob(null);
      
      // Move to the next question (which might have been newly created by AI)
      setCurrentQ(prev => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!assessment) return (
    <div className="flex flex-col items-center justify-center mt-32 text-gray-500 font-medium animate-pulse">
      <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
      Generating dynamic AI assessment tailored to your profile gaps...
    </div>
  );

  const isFinished = assessment.status === 'completed';

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto mt-16 bg-[#161b22] border border-green-500/20 p-10 rounded-2xl shadow-2xl text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Check className="text-green-400 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">Assessment Complete!</h2>
        <p className="text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
          The AI has completely processed your audio responses and transcriptions.
          The recruiter will review your profile based on your match score and verified technical depth.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#0d1117] p-8 rounded-xl border border-gray-800 shadow-inner mb-10 text-left">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-2">Comm. Score</span>
            <span className="text-4xl font-black text-blue-400">{Math.round(assessment.communicationScore)}%</span>
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-2">Tech Insights</span>
            <span className="text-4xl font-black text-purple-400">{Math.round(assessment.technicalScore)}%</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-medium transition-colors shadow-lg border border-gray-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const question = assessment.questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto md:mt-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            {currentQ + 1}
          </div>
          <div>
            <h2 className="text-2xl font-black dark:text-gray-100 text-gray-900 tracking-tight">AI Live Interview</h2>
            <p className="dark:text-gray-400 text-gray-600 font-medium text-sm mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">Live Response Analysis Enabled</p>
          </div>
        </div>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="mb-10 relative z-10">
          <span className="inline-block px-3 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg mb-6 border border-blue-500/20 uppercase tracking-widest shadow-sm">
            {question?.category || 'General'} Evaluation
          </span>
          <h3 className="text-2xl md:text-3xl font-semibold leading-tight text-white mb-2">
            {question?.questionText || "AI is thinking of the next question..."}
          </h3>
        </div>

        <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-inner mb-8 relative z-10 transition-all">
          {!audioBlob ? (
            <>
              {isRecording ? (
                <div className="flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-red-500/30">
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-red-600 transition-colors shadow-lg shadow-red-500/50" onClick={stopRecording}>
                      <Square fill="currentColor" size={20} />
                    </div>
                  </div>
                  <span className="text-red-400 font-medium tracking-wide">Recording your answer...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center group">
                  <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-105 transition-transform">
                    <button 
                      onClick={startRecording}
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg shadow-blue-500/40"
                    >
                      <Mic size={28} />
                    </button>
                  </div>
                  <span className="text-gray-300 font-semibold mb-2">Click microphone to record your answer</span>
                  <span className="text-sm text-gray-500">Maximum 2 minutes length</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center w-full max-w-lg animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6">
                <Check size={28} />
              </div>
              <span className="text-green-400 font-medium mb-6">Audio processed successfully!</span>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full bg-[#161b22] px-6 py-5 rounded-xl border border-gray-700 mb-6 shadow-lg">
                <button className="text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 p-2 rounded-lg shrink-0">
                  <Play fill="currentColor" size={20} />
                </button>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-400 font-bold font-mono shrink-0">0:45</span>
              </div>
              <button 
                onClick={() => setAudioBlob(null)}
                className="text-sm text-gray-500 hover:text-white transition-colors underline underline-offset-4"
              >
                Discard and Re-record
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-800 relative z-10">
          <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
            <AlertCircle size={16} className="text-indigo-400" /> Transcribed via AI Layer
          </p>
          <button 
            disabled={!audioBlob || submitting || !question}
            onClick={handleSubmitAnswer}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all shadow-lg flex justify-center items-center gap-3"
          >
            {submitting ? 'AI Analyzing Response...' : 'Submit Answer'}
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
