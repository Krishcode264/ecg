import { useState, useCallback, useMemo } from 'react';
import type { ECGConfig, ECGWaveParameters, DynamicPatternConfig, CustomBeatParameters } from '../types/ecg';

const defaultWaveParameters: ECGWaveParameters = {
  heart_rate: 70,
  h_p: 0.15,
  b_p: 0.08,
  h_q: -0.1,
  b_q: 0.025,
  h_r: 1.2,
  b_r: 0.05,
  h_s: -0.25,
  b_s: 0.025,
  h_t: 0.2,
  b_t: 0.16,
  l_pq: 0.08,
  l_st: 0.12,
  l_tp: 0.3,
  n_p: 1
};

const defaultRWavePattern: DynamicPatternConfig = {
  enabled: false,
  count: 2,
  interval: 5
};

const defaultPWavePattern: DynamicPatternConfig = {
  enabled: false,
  count: 0,
  interval: 3
};

export const useECGConfig = () => {
  const [config, setConfig] = useState<ECGConfig>({
    waveParameters: defaultWaveParameters,
    pixelsPerMv: 100,
    rWavePattern: defaultRWavePattern,
    pWavePattern: defaultPWavePattern,
    customBeatSequence: {
      enabled: false,
      repeatInterval: 10,
      beats: []
    }
  });

  const updateWaveParameters = useCallback((field: keyof ECGWaveParameters, value: number) => {
    setConfig(prev => ({
      ...prev,
      waveParameters: {
        ...prev.waveParameters,
        [field]: value
      }
    }));
  }, []);

  const updateRWavePattern = useCallback((field: keyof DynamicPatternConfig, value: number | boolean) => {
    setConfig(prev => ({
      ...prev,
      rWavePattern: {
        ...prev.rWavePattern,
        [field]: value
      }
    }));
  }, []);

  const updatePWavePattern = useCallback((field: keyof DynamicPatternConfig, value: number | boolean) => {
    setConfig(prev => ({
      ...prev,
      pWavePattern: {
        ...prev.pWavePattern,
        [field]: value
      }
    }));
  }, []);

  const updateCustomBeatSequence = useCallback((field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      customBeatSequence: {
        ...prev.customBeatSequence,
        [field]: value
      }
    }));
  }, []);

  const updatePixelsPerMv = useCallback((value: number) => {
    setConfig(prev => ({
      ...prev,
      pixelsPerMv: value
    }));
  }, []);

  const addCustomBeat = useCallback(() => {
    const newBeat: CustomBeatParameters = {
      id: Date.now().toString(),
      heart_rate: config.waveParameters.heart_rate,
      h_p: 0.15,
      b_p: 0.08,
      h_q: -0.1,
      b_q: 0.025,
      h_r: 1.2,
      b_r: 0.05,
      h_s: -0.25,
      b_s: 0.025,
      h_t: 0.2,
      b_t: 0.16,
      l_pq: 0.08,
      l_st: 0.12,
      l_tp: 0.3,
      n_p: 1
    };

    setConfig(prev => ({
      ...prev,
      customBeatSequence: {
        ...prev.customBeatSequence,
        beats: [...prev.customBeatSequence.beats, newBeat]
      }
    }));
  }, [config.waveParameters.heart_rate]);

  const updateCustomBeat = useCallback((index: number, beat: CustomBeatParameters) => {
    setConfig(prev => {
      const newBeats = [...prev.customBeatSequence.beats];
      newBeats[index] = beat;
      return {
        ...prev,
        customBeatSequence: {
          ...prev.customBeatSequence,
          beats: newBeats
        }
      };
    });
  }, []);

  const removeCustomBeat = useCallback((index: number) => {
    setConfig(prev => ({
      ...prev,
      customBeatSequence: {
        ...prev.customBeatSequence,
        beats: prev.customBeatSequence.beats.filter((_, i) => i !== index)
      }
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig({
      waveParameters: defaultWaveParameters,
      pixelsPerMv: 100,
      rWavePattern: defaultRWavePattern,
      pWavePattern: defaultPWavePattern,
      customBeatSequence: {
        enabled: false,
        repeatInterval: 10,
        beats: []
      }
    });
  }, []);

  const applyChanges = useCallback(() => {
    // This function will trigger a re-render of the ECG canvas
    // The ECGCanvas component will automatically regenerate the waveform
    // when the config changes, so we just need to force a small update
    setConfig(prev => ({ ...prev }));
  }, []);

  const configMemo = useMemo(() => config, [config]);

  return {
    config: configMemo,
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
  };
}; 