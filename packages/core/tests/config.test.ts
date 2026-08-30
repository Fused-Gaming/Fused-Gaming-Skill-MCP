import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { loadConfig, saveConfig, getDefaultConfig } from '../src/config.js';

describe('config', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'mcp-core-config-test-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('returns the default config when no file exists', () => {
    const config = loadConfig(join(dir, 'missing.json'));
    expect(config).toEqual(getDefaultConfig());
  });

  it('round-trips a saved config through loadConfig', () => {
    const path = join(dir, '.fused-gaming-mcp.json');
    const config = getDefaultConfig();
    config.logging.level = 'debug';
    saveConfig(config, path);
    const loaded = loadConfig(path);
    expect(loaded.logging.level).toBe('debug');
  });

  it('merges a partial config file over the defaults', () => {
    const path = join(dir, 'partial.json');
    saveConfig({ logging: { level: 'warn' } } as never, path);
    const loaded = loadConfig(path);
    expect(loaded.logging.level).toBe('warn');
    expect(loaded.server.name).toBe(getDefaultConfig().server.name);
  });

  it('falls back to the default config on malformed JSON', () => {
    const path = join(dir, 'malformed.json');
    writeFileSync(path, '{ not valid json');
    const config = loadConfig(path);
    expect(config).toEqual(getDefaultConfig());
  });

  it('getDefaultConfig returns an independent copy each time', () => {
    const a = getDefaultConfig();
    const b = getDefaultConfig();
    a.logging.level = 'error';
    expect(b.logging.level).not.toBe('error');
  });
});
