import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import type { Point, ECGConfig } from '../types/ecg';
import { ECGGenerator } from '../utils/ecgGenerator';

interface ECGCanvasProps {
  config: ECGConfig;
  width: number;
  height: number;
}

const POINTER_RADIUS = 6;


export const ECGCanvas: React.FC<ECGCanvasProps> = ({ config, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimestampRef = useRef<number>(0);
  const pointerXRef = useRef<number>(0);
  const firstSweepRef = useRef<boolean>(true);
  const pathPointsRef = useRef<Point[]>([]);
  const drawnPointsRef = useRef<(Point | null)[]>([]);

  const ecgGenerator = useMemo(() => {
    return new ECGGenerator(width, height, config.pixelsPerMv);
  }, [width, height, config.pixelsPerMv]);

  const drawGrid = useCallback(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const gridGroup = svg.querySelector('.grid-group') as SVGGElement;
    
    if (gridGroup) {
      gridGroup.innerHTML = '';
    }

    const small = 8;

    // Vertical lines
    for (let x = 0; x <= width; x += small) {
      const line = document.createElementNS(svg.namespaceURI, 'line');
      line.setAttribute('x1', x.toString());
      line.setAttribute('y1', '0');
      line.setAttribute('x2', x.toString());
      line.setAttribute('y2', height.toString());
      line.setAttribute('stroke', '#eee');
      gridGroup?.appendChild(line);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += small) {
      const line = document.createElementNS(svg.namespaceURI, 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', y.toString());
      line.setAttribute('x2', width.toString());
      line.setAttribute('y2', y.toString());
      line.setAttribute('stroke', '#eee');
      gridGroup?.appendChild(line);
    }
  }, [width, height]);

  const generateWaveformPoints = useCallback(() => {
    return ecgGenerator.generateWaveformPoints(
      config.waveParameters,
      config.rWavePattern,
      config.pWavePattern,
      config.customBeatSequence.beats,
      config.customBeatSequence.enabled,
      config.customBeatSequence.repeatInterval
    );
  }, [ecgGenerator, config]);

  const animationLoop = useCallback((timestamp: number) => {
    const dt = lastTimestampRef.current ? (timestamp - lastTimestampRef.current) / 1000 : 0;
    lastTimestampRef.current = timestamp;
    pointerXRef.current += 150 * dt; // PIXELS_PER_SECOND

    let idx = pathPointsRef.current.findIndex(pt => pt.x >= pointerXRef.current);
    if (idx < 0) idx = pathPointsRef.current.length - 1;

    if (firstSweepRef.current) {
      drawnPointsRef.current = pathPointsRef.current.slice(0, idx + 1);
      const waveformPath = svgRef.current?.querySelector('.waveform-path') as SVGPathElement;
      if (waveformPath) {
        const validPoints = drawnPointsRef.current.filter((pt): pt is Point => pt !== null);
        waveformPath.setAttribute('d', ecgGenerator.pointsToPath(validPoints));
      }
      if (pointerXRef.current > width) firstSweepRef.current = false;
    } else {
      if (pointerXRef.current > width) {
        pointerXRef.current = 0;
        pathPointsRef.current = generateWaveformPoints();
      }
      const es = pointerXRef.current - 12 / 2;
      const ee = pointerXRef.current + 12 / 2;
      const si = drawnPointsRef.current.findIndex(pt => pt && pt.x >= es);
      const ei = drawnPointsRef.current.findIndex(pt => pt && pt.x > ee);
      
      for (let i = (si < 0 ? 0 : si); i < (ei < 0 ? drawnPointsRef.current.length : ei); i++) {
        drawnPointsRef.current[i] = pathPointsRef.current[i];
      }
      
      const waveformPath = svgRef.current?.querySelector('.waveform-path') as SVGPathElement;
      if (waveformPath) {
        const validPoints = drawnPointsRef.current.filter((pt): pt is Point => pt !== null);
        waveformPath.setAttribute('d', ecgGenerator.pointsToPath(validPoints));
      }
    }

    const cur = pathPointsRef.current[idx];
    if (cur) {
      const pointerHead = svgRef.current?.querySelector('.pointer-head') as SVGCircleElement;
      if (pointerHead) {
        pointerHead.setAttribute('cx', cur.x.toString());
        pointerHead.setAttribute('cy', cur.y.toString());
      }
    }

    animationFrameRef.current = requestAnimationFrame(animationLoop);
  }, [width, ecgGenerator, generateWaveformPoints]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  useEffect(() => {
    ecgGenerator.updatePixelsPerMv(config.pixelsPerMv);
    pathPointsRef.current = generateWaveformPoints();
    drawnPointsRef.current = Array(pathPointsRef.current.length).fill(null);
  }, [ecgGenerator, config, generateWaveformPoints]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animationLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationLoop]);

  return (
    <div className="canvas-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          border: '1px solid #ccc',
          background: '#fff',
          borderRadius: '8px',
          maxWidth: '100%',
          height: 'auto'
        }}
      >
        <g className="grid-group" />
        <path
          className="waveform-path"
          stroke="#2c3e50"
          fill="none"
          strokeWidth="2"
        />
        <circle
          className="pointer-head"
          r={POINTER_RADIUS}
          fill="#fff"
          stroke="#fff"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}; 