import React from 'react';
import type { CustomBeatParameters } from '../types/ecg';
import { ParameterInput } from './ParameterInput';

interface CustomBeatRowProps {
  beat: CustomBeatParameters;
  onChange: (beat: CustomBeatParameters) => void;
  onRemove: () => void;
}

export const CustomBeatRow: React.FC<CustomBeatRowProps> = ({ beat, onChange, onRemove }) => {
  const updateBeat = (field: keyof CustomBeatParameters, value: number) => {
    onChange({ ...beat, [field]: value });
  };

  return (
    <div className="custom-beat-row">
      <ParameterInput
        label="P Height"
        value={beat.h_p}
        onChange={(value) => updateBeat('h_p', value)}
        step={0.01}
      />
      <ParameterInput
        label="P Breadth"
        value={beat.b_p}
        onChange={(value) => updateBeat('b_p', value)}
        step={0.01}
      />
      <ParameterInput
        label="Q Height"
        value={beat.h_q}
        onChange={(value) => updateBeat('h_q', value)}
        step={0.01}
      />
      <ParameterInput
        label="Q Breadth"
        value={beat.b_q}
        onChange={(value) => updateBeat('b_q', value)}
        step={0.005}
      />
      <ParameterInput
        label="R Height"
        value={beat.h_r}
        onChange={(value) => updateBeat('h_r', value)}
        step={0.1}
      />
      <ParameterInput
        label="R Breadth"
        value={beat.b_r}
        onChange={(value) => updateBeat('b_r', value)}
        step={0.01}
      />
      <ParameterInput
        label="S Height"
        value={beat.h_s}
        onChange={(value) => updateBeat('h_s', value)}
        step={0.01}
      />
      <ParameterInput
        label="S Breadth"
        value={beat.b_s}
        onChange={(value) => updateBeat('b_s', value)}
        step={0.005}
      />
      <ParameterInput
        label="T Height"
        value={beat.h_t}
        onChange={(value) => updateBeat('h_t', value)}
        step={0.01}
      />
      <ParameterInput
        label="T Breadth"
        value={beat.b_t}
        onChange={(value) => updateBeat('b_t', value)}
        step={0.01}
      />
      <ParameterInput
        label="PQ Length"
        value={beat.l_pq}
        onChange={(value) => updateBeat('l_pq', value)}
        step={0.01}
      />
      <ParameterInput
        label="ST Length"
        value={beat.l_st}
        onChange={(value) => updateBeat('l_st', value)}
        step={0.01}
      />
      <ParameterInput
        label="TP Length"
        value={beat.l_tp}
        onChange={(value) => updateBeat('l_tp', value)}
        step={0.01}
      />
      <button
        onClick={onRemove}
        style={{
          marginTop: '5px',
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        Remove Beat
      </button>
    </div>
  );
}; 