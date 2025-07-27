import type { ECGWaveParameters, Point, WaveformTimes, ScaledParameters, DynamicPatternConfig, CustomBeatParameters } from '../types/ecg';

const PIXELS_PER_SECOND = 150;

export class ECGGenerator {
  private globalBeatCounter = 0;
  private globalCustomIdx = 0;
  private globalWaitingNormalBeats = 0;
  private globalRCycleCounter = 0;
  private globalPCycleCounter = 0;
  private svgWidth: number;
  private svgHeight: number;
  private pixelsPerMv: number;

  constructor(svgWidth: number, svgHeight: number, pixelsPerMv: number) {
    this.svgWidth = svgWidth;
    this.svgHeight = svgHeight;
    this.pixelsPerMv = pixelsPerMv;
  }

  private raisedCosinePulse(t: number, h: number, b: number, t0: number): number {
    if (b === 0 || t < t0 || t > t0 + b) return 0;
    return (h / 2) * (1 - Math.cos((2 * Math.PI * (t - t0)) / b));
  }

  private calculateWaveformTimes(
    tElapsed: number,
    s: ScaledParameters,
    curPCount: number,
    curRCount: number
  ): WaveformTimes {
    let off = tElapsed;
    const times: WaveformTimes = { P: [], Q: 0, R: [], S: [], T: 0 };

    // P waves
    for (let i = 0; i < curPCount; i++) {
      times.P.push(off + i * (s.b_p + s.l_pq));
    }
    off += curPCount * (s.b_p + s.l_pq);

    // QRS complex
    if (curRCount > 0) {
      for (let i = 0; i < curRCount; i++) {
        times.Q = off;
        off += s.b_q;
        times.R.push(off);
        off += s.b_r;
        times.S.push(off);
        off += s.b_s;
        if (i < curRCount - 1) off += s.l_pq / 2;
      }
    }
    off += s.l_st;
    times.T = off;

    return times;
  }

  private calculateScaledParameters(params: ECGWaveParameters, sf: number): ScaledParameters {
    return {
      b_p: params.b_p * sf,
      l_pq: params.l_pq * sf,
      b_q: params.b_q * sf,
      b_r: params.b_r * sf,
      b_s: params.b_s * sf,
      l_st: params.l_st * sf,
      b_t: params.b_t * sf,
      l_tp: params.l_tp * sf
    };
  }

  generateWaveformPoints(
    waveParams: ECGWaveParameters,
    rWavePattern: DynamicPatternConfig,
    pWavePattern: DynamicPatternConfig,
    customBeats: CustomBeatParameters[],
    useCustomBeats: boolean,
    repeatInterval: number
  ): Point[] {
    const totalTime = this.svgWidth / PIXELS_PER_SECOND;
    const y0 = this.svgHeight / 2;
    const pts: Point[] = [];
    const dt = 1 / PIXELS_PER_SECOND;

    let rCycleCounterLocal = this.globalRCycleCounter;
    let pCycleCounterLocal = this.globalPCycleCounter;
    let beatCounter = this.globalBeatCounter;
    let customIdx = this.globalCustomIdx;
    let waitingNormalBeats = this.globalWaitingNormalBeats;

    let tElapsed = 0;

    while (tElapsed <= totalTime) {
      let currentParams = waveParams;

      // Handle custom beat sequence
      if (useCustomBeats && customBeats.length > 0) {
        if (waitingNormalBeats === 0) {
          currentParams = { ...waveParams, ...customBeats[customIdx] };
          customIdx++;
          if (customIdx >= customBeats.length) {
            customIdx = 0;
            waitingNormalBeats = repeatInterval;
          }
        } else if (waitingNormalBeats > 0) {
          waitingNormalBeats--;
        }
      }

      // Handle P wave pattern
      let curPCount = currentParams.n_p;
      if (pWavePattern.enabled) {
        pCycleCounterLocal++;
        if (pWavePattern.interval > 0 && pCycleCounterLocal >= pWavePattern.interval) {
          curPCount = pWavePattern.count;
          pCycleCounterLocal = 0;
        }
      }

      // Handle R wave pattern
      let curRCount = 1;
      if (rWavePattern.enabled) {
        rCycleCounterLocal++;
        if (rWavePattern.interval > 0 && rCycleCounterLocal >= rWavePattern.interval) {
          curRCount = rWavePattern.count;
          rCycleCounterLocal = 0;
        }
      }

      // Calculate cycle parameters
      const base = curPCount * (currentParams.b_p + currentParams.l_pq)
        + (currentParams.b_q + currentParams.b_r + currentParams.b_s) * (curRCount > 0 ? 1 : 0)
        + currentParams.l_st + currentParams.b_t + currentParams.l_tp;

      const heart_period = 60 / (currentParams.heart_rate || 60);
      const sf = heart_period / base;

      const s = this.calculateScaledParameters(currentParams, sf);

      const cycleDuration = curPCount * (s.b_p + s.l_pq)
        + (curRCount > 0 ? (s.b_q + s.b_r + s.b_s) : 0)
        + s.l_st + s.b_t + s.l_tp;

      const times = this.calculateWaveformTimes(tElapsed, s, curPCount, curRCount);
      const tEnd = tElapsed + cycleDuration;

      // Generate points for this cycle
      for (let t = tElapsed; t < tEnd; t += dt) {
        let v = 0;

        // P waves
        for (let start of times.P) {
          if (t >= start && t < start + s.b_p) {
            v = this.raisedCosinePulse(t, currentParams.h_p, s.b_p, start);
            break;
          }
        }

        // Q wave
        if (!v && curRCount > 0 && t >= times.Q && t < times.Q + s.b_q) {
          v = this.raisedCosinePulse(t, currentParams.h_q, s.b_q, times.Q);
        }

        // R waves
        if (!v && curRCount > 0) {
          for (let r of times.R) {
            if (t >= r && t < r + s.b_r) {
              v = this.raisedCosinePulse(t, currentParams.h_r, s.b_r, r);
              break;
            }
          }
        }

        // S waves
        if (!v && curRCount > 0) {
          for (let sWave of times.S) {
            if (t >= sWave && t < sWave + s.b_s) {
              v = this.raisedCosinePulse(t, currentParams.h_s, s.b_s, sWave);
              break;
            }
          }
        }

        // T wave
        if (!v && t >= times.T && t < times.T + s.b_t) {
          v = this.raisedCosinePulse(t, currentParams.h_t, s.b_t, times.T);
        }

        pts.push({
          x: t * PIXELS_PER_SECOND,
          y: y0 - v * this.pixelsPerMv
        });
      }

      tElapsed += cycleDuration;
      beatCounter++;
    }

    // Persist global state
    this.globalRCycleCounter = rCycleCounterLocal;
    this.globalPCycleCounter = pCycleCounterLocal;
    this.globalBeatCounter = beatCounter;
    this.globalCustomIdx = customIdx;
    this.globalWaitingNormalBeats = waitingNormalBeats;

    return pts;
  }

  pointsToPath(points: Point[]): string {
    return points.reduce((str, p, i) => str + (i ? " L" : "M") + ` ${p.x} ${p.y}`, "");
  }

  updatePixelsPerMv(newValue: number): void {
    this.pixelsPerMv = newValue;
  }

  resetCounters(): void {
    this.globalBeatCounter = 0;
    this.globalCustomIdx = 0;
    this.globalWaitingNormalBeats = 0;
    this.globalRCycleCounter = 0;
    this.globalPCycleCounter = 0;
  }
} 