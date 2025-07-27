export interface ECGWaveParameters {
  heart_rate: number;
  h_p: number; // P Wave Height
  b_p: number; // P Wave Breadth
  h_q: number; // Q Wave Height
  b_q: number; // Q Wave Breadth
  h_r: number; // R Wave Height
  b_r: number; // R Wave Breadth
  h_s: number; // S Wave Height
  b_s: number; // S Wave Breadth
  h_t: number; // T Wave Height
  b_t: number; // T Wave Breadth
  l_pq: number; // PQ Segment Length
  l_st: number; // ST Segment Length
  l_tp: number; // TP Segment Length
  n_p: number; // Default P Waves per QRS
}

export interface CustomBeatParameters extends ECGWaveParameters {
  id: string;
}

export interface DynamicPatternConfig {
  enabled: boolean;
  count: number;
  interval: number;
}

export interface ECGConfig {
  waveParameters: ECGWaveParameters;
  pixelsPerMv: number;
  rWavePattern: DynamicPatternConfig;
  pWavePattern: DynamicPatternConfig;
  customBeatSequence: {
    enabled: boolean;
    repeatInterval: number;
    beats: CustomBeatParameters[];
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface WaveformTimes {
  P: number[];
  Q: number;
  R: number[];
  S: number[];
  T: number;
}

export interface ScaledParameters {
  b_p: number;
  l_pq: number;
  b_q: number;
  b_r: number;
  b_s: number;
  l_st: number;
  b_t: number;
  l_tp: number;
} 