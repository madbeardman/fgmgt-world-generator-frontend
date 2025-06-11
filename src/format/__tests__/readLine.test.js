// src/format/__tests__/readLine.test.js
import { describe, it, expect } from 'vitest';
import { readLine } from '../readLine.js';

const sector = 'Spinward Marches';
const subsector = 'Trin';
const subsectorIndex = 0;

describe('readLine', () => {
  it('parses Traltha correctly', () => {
    const line = 'Traltha       2834 B590630-6    De He Ni An        410 Im F5 V           ';
    const result = readLine(sector, subsector, line, subsectorIndex);

    expect(result).not.toBeNull();
    expect(result.name).toBe('Traltha');
    expect(result.hex).toBe('2834');
    expect(result.uwp).toBe('B590630-6');
    expect(result.allegiance).toBe('Imperium');
    expect(result.tradeCodes).toBe('De Ni');
    expect(result.bases).toBe('');
    expect(result.gasGiant).toBe('');
    expect(result.stellar).toBe('F5 V');
  });

  it('parses Hammermium correctly (with base and DA)', () => {
    const line = 'Hammermium    2936 A5525AB-B    Ni Po Da        A  535 Im M3 V           ';
    const result = readLine(sector, subsector, line, subsectorIndex);

    expect(result).not.toBeNull();
    expect(result.name).toBe('Hammermium');
    expect(result.hex).toBe('2936');
    expect(result.uwp).toBe('A5525AB-B');
    expect(result.tradeCodes).toBe('Ni Po');
    expect(result.gasGiant).toBe('G');
    expect(result.stellar).toBe('M3 V');
  });

  it('parses Trin correctly (multiple trade codes, base)', () => {
    const line = 'Trin          3235 A894A96-F  A Hi In Cp Ht        101 Im G0 V           ';
    const result = readLine(sector, subsector, line, subsectorIndex);

    expect(result).not.toBeNull();
    expect(result.name).toBe('Trin');
    expect(result.hex).toBe('3235');
    expect(result.uwp).toBe('A894A96-F');
    expect(result.tradeCodes).toBe('Hi In Ht');
    expect(result.gasGiant).toBe('G');
    expect(result.stellar).toBe('G0 V');
  });

  it('handles gas giants present vs absent', () => {
    const withGas = 'Chamois       3139 B544642-5  S Ag Ni Lt           723 Im F9 V           ';
    const noGas = 'NoGasWorld    3333 C786430-8    Ag Ni              430 Im K4 V           ';

    const result1 = readLine(sector, subsector, withGas, subsectorIndex);
    const result2 = readLine(sector, subsector, noGas, subsectorIndex);

    expect(result1.gasGiant).toBe('G');
    expect(result2.gasGiant).toBe('');
  });

  it('returns null for short/invalid lines', () => {
    const shortLine = 'Oops';
    const result = readLine(sector, subsector, shortLine, subsectorIndex);
    expect(result).toBeNull();
  });

  it('filters out unknown trade codes from the comments field', () => {
    const line = 'Obscuria      4001 D878565-7    De He An Ni        413 Im K1 V           ';
    const result = readLine(sector, subsector, line, subsectorIndex);

    expect(result).not.toBeNull();
    expect(result.tradeCodes).toBe('De Ni'); // He and An are not valid, only De and Ni remain
  });
});