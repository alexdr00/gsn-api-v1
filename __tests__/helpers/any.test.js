const any = require('../../src/helpers/any');

describe('Helper: any', () => {
  it('should return true if at least item in the array value is true.', () => {
    const booelanList = [true, false, false];
    const result = any(booelanList);
    expect(result).toBe(true);
  });

  it('should return false if all items in the array are false.', () => {
    const booelanList = [false, false, false];
    const result = any(booelanList);
    expect(result).toBe(false);
  });
});
