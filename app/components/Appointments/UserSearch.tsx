// app/components/Appointments/UserSearch.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserSearchProps {
  users: User[];
  value: string;
  onChange: (userId: string) => void;
  disabled?: boolean;
}

export default function UserSearch({ 
  users, 
  value, 
  onChange, 
  disabled = false
}: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update display value when selected user changes
  useEffect(() => {
    if (value) {
      const selectedUser = users.find(user => user.id.toString() === value);
      if (selectedUser) {
        setDisplayValue(`${selectedUser.name} (${selectedUser.email})`);
      }
    } else {
      setDisplayValue('');
    }
  }, [value, users]);

  // Filter users based on search term (name or email)
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (userId: string, userName: string, userEmail: string) => {
    onChange(userId);
    setDisplayValue(`${userName} (${userEmail})`);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayValue(e.target.value);
    setIsOpen(true);
    
    // If clearing the input, clear the selection
    if (e.target.value === '') {
      onChange('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClearSelection = () => {
    onChange('');
    setSearchTerm('');
    setDisplayValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for staff member..."
          value={searchTerm || displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="input input-bordered w-full pr-10"
          disabled={disabled}
          required
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {isOpen && (searchTerm || !value) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No staff members found</div>
          ) : (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectUser(
                  user.id.toString(), 
                  user.name,
                  user.email
                )}
              >
                <div className="font-medium">
                  {user.name}
                </div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Hidden select for form submission */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
        required
      >
        <option value="">Select a staff member</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
    </div>
  );
}