# ECG Waveform Animator (React + TypeScript)

A modern React application for generating and animating ECG waveforms with customizable parameters, built with Vite and TypeScript.

## Features

- **Real-time ECG Waveform Generation**: Generate realistic ECG waveforms using mathematical models
- **Customizable Parameters**: Adjust all ECG wave parameters (P, Q, R, S, T waves)
- **Dynamic Patterns**: Enable dynamic R-wave and P-wave patterns
- **Custom Beat Sequences**: Create and manage custom beat configurations
- **Real-time Animation**: Smooth animation with moving pointer and waveform drawing
- **Responsive Design**: Modern UI with responsive layout
- **TypeScript**: Full type safety and better development experience

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Custom Hooks** for state management
- **SVG** for waveform rendering
- **CSS3** for styling

## Project Structure

```
src/
├── components/
│   ├── ECGCanvas.tsx          # Main canvas component for waveform rendering
│   ├── ECGControls.tsx        # Control panel for all parameters
│   ├── ParameterInput.tsx     # Reusable input component
│   └── CustomBeatRow.tsx      # Custom beat configuration component
├── hooks/
│   └── useECGConfig.ts        # Custom hook for ECG configuration management
├── types/
│   └── ecg.ts                 # TypeScript type definitions
├── utils/
│   └── ecgGenerator.ts        # ECG waveform generation logic
└── App.tsx                    # Main application component
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecg
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

### Basic Controls

1. **Heart Rate**: Adjust the heart rate in beats per minute (20-250 bpm)
2. **Pixels per mV**: Control the vertical scaling of the waveform
3. **Wave Parameters**: Modify individual wave characteristics (height, breadth, timing)

### Advanced Features

#### Dynamic R Wave Pattern
- Enable/disable dynamic R wave patterns
- Set the number of R waves in the pattern
- Configure when to apply the pattern

#### Dynamic P Wave Pattern
- Enable/disable dynamic P wave patterns
- Set the number of P waves in the pattern
- Configure when to apply the pattern

#### Custom Beat Sequence
- Enable custom beat sequences
- Add multiple custom beat configurations
- Set the interval between normal beats and custom beats
- Remove individual custom beats

### Wave Parameters

- **P Wave**: Height and breadth of the P wave
- **Q Wave**: Height and breadth of the Q wave
- **R Wave**: Height and breadth of the R wave
- **S Wave**: Height and breadth of the S wave
- **T Wave**: Height and breadth of the T wave
- **Segments**: PQ, ST, and TP segment lengths
- **P Waves per QRS**: Number of P waves per QRS complex

## Performance Optimizations

- **useCallback**: Prevents unnecessary re-renders of callback functions
- **useMemo**: Memoizes expensive calculations
- **useRef**: Manages DOM references and animation state
- **Custom Hooks**: Encapsulates complex state logic
- **Optimized SVG Rendering**: Efficient waveform drawing and animation

## Development

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Proper separation of concerns
- Reusable components
- Performance-optimized rendering

### Adding New Features

1. Define types in `src/types/ecg.ts`
2. Create components in `src/components/`
3. Add utility functions in `src/utils/`
4. Create custom hooks in `src/hooks/`
5. Update the main App component

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Original ECG generation algorithm from the HTML version
- React and TypeScript communities for excellent tooling
- Vite for fast development experience
