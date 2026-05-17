// Version manifest loader
// Reads from VERSION.json at build time and provides type-safe version data

export interface VersionManifest {
  version: string;
  releaseDate: string;
  status: 'stable' | 'beta' | 'alpha' | 'rc';
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  prerelease: string | null;
  metadata: {
    nodeMinimum: string;
    npmMinimum: string;
    typescriptVersion: string;
    buildNumber: number;
  };
}

// This will be loaded at build time from VERSION.json
// For client-side, we provide a minimal version object
export const getVersionManifest = (): VersionManifest => {
  // In a real scenario, this would be injected from VERSION.json at build time
  // For now, we return a default that will be hydrated from the server
  return {
    version: '1.1.2',
    releaseDate: '2026-05-16',
    status: 'stable',
    majorVersion: 1,
    minorVersion: 1,
    patchVersion: 2,
    prerelease: null,
    metadata: {
      nodeMinimum: '20.0.0',
      npmMinimum: '8.0.0',
      typescriptVersion: '5.3.2',
      buildNumber: 1012,
    },
  };
};

export const versionManifest = getVersionManifest();
