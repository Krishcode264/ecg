import React from 'react';
import type { ECGConfig, CustomBeatParameters, ECGWaveParameters, DynamicPatternConfig } from '../types/ecg';
import { ParameterInput } from './ParameterInput';
import { CustomBeatRow } from './CustomBeatRow';

interface ECGControlsProps {
  config: ECGConfig;
  updateWaveParameters: (field: keyof ECGWaveParameters, value: number) => void;
  updateRWavePattern: (field: keyof DynamicPatternConfig, value: number | boolean) => void;
  updatePWavePattern: (field: keyof DynamicPatternConfig, value: number | boolean) => void;
  updateCustomBeatSequence: (field: string, value: any) => void;
  updatePixelsPerMv: (value: number) => void;
  addCustomBeat: () => void;
  updateCustomBeat: (index: number, beat: CustomBeatParameters) => void;
  removeCustomBeat: (index: number) => void;
  applyChanges: () => void;
}

export const ECGControls: React.FC<ECGControlsProps> = ({ 
  config, 
  updateWaveParameters,
  updateRWavePattern,
  updatePWavePattern,
  updateCustomBeatSequence,
  updatePixelsPerMv,
  addCustomBeat,
  updateCustomBeat,
  removeCustomBeat,
  applyChanges
}) => {

  return (
    <div className="controls">
      <ParameterInput
        label="Heart Rate (bpm)"
        value={config.waveParameters.heart_rate}
        onChange={(value) => updateWaveParameters('heart_rate', value)}
        step={1}
        min={20}
        max={250}
      />
      
      <ParameterInput
        label="Pixels per mV"
        value={config.pixelsPerMv}
        onChange={updatePixelsPerMv}
        step={10}
        min={10}
      />

      <h3>Wave Parameters (mV, sec)</h3>
      <ParameterInput
        label="P Wave Height"
        value={config.waveParameters.h_p}
        onChange={(value) => updateWaveParameters('h_p', value)}
        step={0.01}
      />
      <ParameterInput
        label="P Wave Breadth"
        value={config.waveParameters.b_p}
        onChange={(value) => updateWaveParameters('b_p', value)}
        step={0.01}
      />
      <ParameterInput
        label="Q Wave Height"
        value={config.waveParameters.h_q}
        onChange={(value) => updateWaveParameters('h_q', value)}
        step={0.01}
      />
      <ParameterInput
        label="Q Wave Breadth"
        value={config.waveParameters.b_q}
        onChange={(value) => updateWaveParameters('b_q', value)}
        step={0.005}
      />
      <ParameterInput
        label="R Wave Height"
        value={config.waveParameters.h_r}
        onChange={(value) => updateWaveParameters('h_r', value)}
        step={0.1}
      />
      <ParameterInput
        label="R Wave Breadth"
        value={config.waveParameters.b_r}
        onChange={(value) => updateWaveParameters('b_r', value)}
        step={0.01}
      />
      <ParameterInput
        label="S Wave Height"
        value={config.waveParameters.h_s}
        onChange={(value) => updateWaveParameters('h_s', value)}
        step={0.01}
      />
      <ParameterInput
        label="S Wave Breadth"
        value={config.waveParameters.b_s}
        onChange={(value) => updateWaveParameters('b_s', value)}
        step={0.005}
      />
      <ParameterInput
        label="T Wave Height"
        value={config.waveParameters.h_t}
        onChange={(value) => updateWaveParameters('h_t', value)}
        step={0.01}
      />
      <ParameterInput
        label="T Wave Breadth"
        value={config.waveParameters.b_t}
        onChange={(value) => updateWaveParameters('b_t', value)}
        step={0.01}
      />
      <ParameterInput
        label="PQ Segment Length"
        value={config.waveParameters.l_pq}
        onChange={(value) => updateWaveParameters('l_pq', value)}
        step={0.01}
      />
      <ParameterInput
        label="ST Segment Length"
        value={config.waveParameters.l_st}
        onChange={(value) => updateWaveParameters('l_st', value)}
        step={0.01}
      />
      <ParameterInput
        label="TP Segment Length"
        value={config.waveParameters.l_tp}
        onChange={(value) => updateWaveParameters('l_tp', value)}
        step={0.01}
      />
      <ParameterInput
        label="Default P Waves per QRS"
        value={config.waveParameters.n_p}
        onChange={(value) => updateWaveParameters('n_p', value)}
        step={1}
      />

      <h3>Dynamic R Wave Pattern</h3>
      <ParameterInput
        label="Enable R Wave Pattern"
        value={config.rWavePattern.enabled ? 1 : 0}
        onChange={(value) => updateRWavePattern('enabled', value)}
        type="checkbox"
        checked={config.rWavePattern.enabled}
      />
      <ParameterInput
        label="R Waves in Pattern"
        value={config.rWavePattern.count}
        onChange={(value) => updateRWavePattern('count', value)}
        step={1}
        min={0}
      />
      <ParameterInput
        label="Apply After N QRS"
        value={config.rWavePattern.interval}
        onChange={(value) => updateRWavePattern('interval', value)}
        step={1}
        min={0}
      />

      <h3>Dynamic P Wave Pattern</h3>
      <ParameterInput
        label="Enable P Wave Pattern"
        value={config.pWavePattern.enabled ? 1 : 0}
        onChange={(value) => updatePWavePattern('enabled', value)}
        type="checkbox"
        checked={config.pWavePattern.enabled}
      />
      <ParameterInput
        label="P Waves in Pattern"
        value={config.pWavePattern.count}
        onChange={(value) => updatePWavePattern('count', value)}
        step={1}
        min={0}
      />
      <ParameterInput
        label="Apply After N QRS"
        value={config.pWavePattern.interval}
        onChange={(value) => updatePWavePattern('interval', value)}
        step={1}
        min={0}
      />

      <h3>Custom Beat Sequence</h3>
      <ParameterInput
        label="Enable Custom Beat Sequence"
        value={config.customBeatSequence.enabled ? 1 : 0}
        onChange={(value) => updateCustomBeatSequence('enabled', value)}
        type="checkbox"
        checked={config.customBeatSequence.enabled}
      />
      <ParameterInput
        label="Normal Beats Before Repeat"
        value={config.customBeatSequence.repeatInterval}
        onChange={(value) => updateCustomBeatSequence('repeatInterval', value)}
        step={1}
        min={0}
      />
      
      <div id="customBeatsContainer">
        {config.customBeatSequence.beats.map((beat, index) => (
          <CustomBeatRow
            key={beat.id}
            beat={beat}
            onChange={(updatedBeat) => updateCustomBeat(index, updatedBeat)}
            onRemove={() => removeCustomBeat(index)}
          />
        ))}
      </div>
      
      <button
        onClick={addCustomBeat}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          fontSize: '1rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
          background: '#27ae60',
          color: 'white'
        }}
      >
        + Add Custom Beat
      </button>

      <button
        onClick={applyChanges}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          fontSize: '1rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
          background: '#20a4f3',
          color: 'white'
        }}
      >
        Apply Changes
      </button>
    </div>
  );
}; 