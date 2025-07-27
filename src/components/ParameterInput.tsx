import React from 'react';

interface ParameterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  type?: 'number' | 'checkbox';
  checked?: boolean;
}

export const ParameterInput: React.FC<ParameterInputProps> = ({
  label,
  value,
  onChange,
  step = 0.01,
  min,
  max,
  type = 'number',
  checked
}) => {
  if (type === 'checkbox') {
    return (
      <div className="param-group">
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked ? 1 : 0)}
          />
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="param-group">
      <label htmlFor={label.toLowerCase().replace(/\s+/g, '_')}>
        {label}:
      </label>
      <input
        type="number"
        id={label.toLowerCase().replace(/\s+/g, '_')}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        min={min}
        max={max}
      />
    </div>
  );
}; 