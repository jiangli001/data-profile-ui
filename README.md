# DBT Source YAML Generator

A React-based web application for generating DBT source YAML configurations. This tool provides an intuitive interface to define data sources, tables, columns, and tests for DBT projects.

## Features

- **Source Management**: Add and configure multiple data sources
- **Table Configuration**: Define tables within each source with metadata
- **Column Definition**: Specify columns with descriptions and data types
- **Test Configuration**: Add DBT tests (unique, not_null, accepted_values, relationships)
- **Live YAML Preview**: Real-time generated YAML output
- **Validation**: Built-in validation with error highlighting

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-profile-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
Start the development server with hot reload:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
Build the application for production:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

## Development

### Code Quality
Run ESLint to check code quality:
```bash
npm run lint
```

### Project Structure
```
src/
├── components/        # React components
├── contexts/         # React context providers
├── hooks/           # Custom React hooks
├── types.ts         # TypeScript type definitions
└── utils.ts         # Utility functions
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **js-yaml** - YAML generation
