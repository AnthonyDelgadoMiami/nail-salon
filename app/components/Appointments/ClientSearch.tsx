// app/components/Appointments/ClientSearch.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
}

interface ClientSearchProps {
  clients: Client[];
  value: string;
  onChange: (clientId: string) => void;
  disabled?: boolean;
  showWalkInOption?: boolean;
  isWalkIn?: boolean;
  onWalkInDataChange?: (data: { phone: string; email: string }) => void;
}

export default function ClientSearch({ 
  clients, 
  value, 
  onChange, 
  disabled = false,
  showWalkInOption = false,
  isWalkIn = false,
  onWalkInDataChange
}: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [walkInClient, setWalkInClient] = useState({
    phone: '',
    email: ''
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Update display value when selected client changes
  useEffect(() => {
    if (value === 'walk-in') {
      setDisplayValue('Walk-In Client');
    } else if (value) {
      const selectedClient = clients.find(client => client.id.toString() === value);
      if (selectedClient) {
        setDisplayValue(`${selectedClient.firstName} ${selectedClient.lastName} (${selectedClient.phone})`);
      }
    } else {
      setDisplayValue('');
    }
  }, [value, clients]);

  // Filter clients based on search term (name or phone)
  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleSelectClient = (clientId: string, clientName: string, clientPhone: string) => {
    onChange(clientId);
    setDisplayValue(clientId === 'walk-in' ? 'Walk-In Client' : `${clientName} (${clientPhone})`);
    setSearchTerm('');
    setIsOpen(false);
    
    // If selecting walk-in, clear any previous walk-in data
    if (clientId === 'walk-in') {
      setWalkInClient({ phone: '', email: '' });
      if (onWalkInDataChange) {
        onWalkInDataChange({ phone: '', email: '' });
      }
    }
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
    // Show all clients when focusing on empty input
    if (!value && searchTerm === '') {
      setSearchTerm('');
    }
  };

  const handleInputBlur = () => {
    // Don't close immediately to allow for clicking on options
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

  // Handler for walk-in phone changes
  const handleWalkInPhoneChange = (phone: string) => {
    setWalkInClient(prev => ({ ...prev, phone }));
    if (onWalkInDataChange) {
      onWalkInDataChange({ phone, email: walkInClient.email });
    }
  };

  // Handler for walk-in email changes
  const handleWalkInEmailChange = (email: string) => {
    setWalkInClient(prev => ({ ...prev, email }));
    if (onWalkInDataChange) {
      onWalkInDataChange({ phone: walkInClient.phone, email });
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
          placeholder="Search by name or phone number..."
          value={searchTerm || displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="input input-bordered w-full pr-10"
          disabled={disabled}
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
          {showWalkInOption && (
            <div
              className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
              onClick={() => handleSelectClient('walk-in', 'Walk-In', 'Client')}
            >
              <div className="font-medium text-primary">➕ Walk-In Client</div>
              <div className="text-sm text-gray-600">Create new client</div>
            </div>
          )}
          
          {filteredClients.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No clients found</div>
          ) : (
            filteredClients.map(client => (
              <div
                key={client.id}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectClient(
                  client.id.toString(), 
                  `${client.firstName} ${client.lastName}`,
                  client.phone
                )}
              >
                <div className="font-medium">
                  {client.firstName} {client.lastName}
                </div>
                <div className="text-sm text-gray-600">{client.phone}</div>
                {client.email && (
                  <div className="text-xs text-gray-500">{client.email}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Hidden select for form submission - FIXED: Only show required when not walk-in */}
      <select
        ref={selectRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
        required={!isWalkIn} // This is the key fix
      >
        <option value="">Select a client</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>
            {client.firstName} {client.lastName} ({client.phone})
          </option>
        ))}
      </select>
    </div>
  );
}