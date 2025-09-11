// app/components/Appointments/TimeSelect.tsx
'use client';

interface TimeSelectProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
}

export default function TimeSelect({ value, onChange, disabled = false }: TimeSelectProps) {
  // Generate time slots in 15-minute intervals from 8 AM to 8 PM
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 6; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const time = new Date(`2023-01-01T${timeString}`);
        const displayTime = time.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        times.push({ value: timeString, display: displayTime });
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select select-bordered w-full"
      disabled={disabled}
      required
    >
      <option value="">Select a time</option>
      {timeSlots.map((time) => (
        <option key={time.value} value={time.value}>
          {time.display}
        </option>
      ))}
    </select>
  );
}