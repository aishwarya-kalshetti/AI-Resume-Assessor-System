import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';

interface ScheduleModalProps {
  candidateName: string;
  matchId: string;
  onClose: () => void;
  onScheduled: (result: any) => void;
  token: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ candidateName, matchId, onClose, onScheduled, token }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00'
  ];

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both a date and time.');
      return;
    }
    setIsScheduling(true);
    setError('');
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);
      const displayDate = scheduledAt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const displayTime = scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const meetSuffix = Math.random().toString(36).substring(2, 9);

      const result = {
        matchId,
        candidateName,
        scheduledAt: scheduledAt.toISOString(),
        displayDate,
        displayTime,
        meetLink: `https://meet.google.com/xxx-${meetSuffix}`,
        aiReason: `Interview manually scheduled for ${candidateName} on ${displayDate} at ${displayTime}.`,
        status: 'Scheduled'
      };
      onScheduled(result);
    } catch {
      setError('Scheduling failed. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Schedule Interview</h2>
            <p className="text-blue-200 text-sm">{candidateName}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Date Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest dark:text-gray-400 text-gray-500 mb-2 flex items-center gap-1.5">
              <Calendar size={12} /> Interview Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full dark:bg-[#0d1117] bg-gray-50 border dark:border-gray-700 border-gray-300 rounded-xl px-4 py-3 text-sm dark:text-white text-gray-900 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Time Slot Grid */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest dark:text-gray-400 text-gray-500 mb-3 flex items-center gap-1.5">
              <Clock size={12} /> Select Time Slot
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                    selectedTime === slot
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'dark:bg-[#0d1117] bg-gray-50 border dark:border-gray-700 border-gray-200 dark:text-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-500'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="dark:bg-blue-500/10 bg-blue-50 border dark:border-blue-500/20 border-blue-200 rounded-xl p-4 text-sm dark:text-blue-300 text-blue-700 font-medium animate-in fade-in">
              📅 &nbsp;{new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 border dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 dark:hover:bg-gray-800 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={isScheduling}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isScheduling ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              Confirm Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
