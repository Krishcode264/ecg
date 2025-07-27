import React from 'react';
import { ECGCanvas } from './components/ECGCanvas';
import { ECGControls } from './components/ECGControls';
import { useECGConfig } from './hooks/useECGConfig';
import './App.css';

function App() {
  const {
    config,
    updateWaveParameters,
    updateRWavePattern,
    updatePWavePattern,
    updateCustomBeatSequence,
    updatePixelsPerMv,
    addCustomBeat,
    updateCustomBeat,
    removeCustomBeat,
    resetToDefaults,
    applyChanges
  } = useECGConfig();

  return (
    <div className="App">
      <h1>ECG Waveform Animator (Custom Beats)</h1>
      <div className="container">
        <ECGControls 
          config={config} 
          onConfigChange={(newConfig) => {
            // This will be handled by the individual update functions
          }}
          updateWaveParameters={updateWaveParameters}
          updateRWavePattern={updateRWavePattern}
          updatePWavePattern={updatePWavePattern}
          updateCustomBeatSequence={updateCustomBeatSequence}
          updatePixelsPerMv={updatePixelsPerMv}
          addCustomBeat={addCustomBeat}
          updateCustomBeat={updateCustomBeat}
          removeCustomBeat={removeCustomBeat}
          resetToDefaults={resetToDefaults}
          applyChanges={applyChanges}
        />
        <ECGCanvas config={config} width={1000} height={400} />
      </div>
    </div>
  );
}

export default App;
