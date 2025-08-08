const { getCenterOfPoints, drawFrame } = require('../app');

describe('getCenterOfPoints', () => {
  test('averages multiple points', () => {
    const points = [{ x: 0, y: 0 }, { x: 2, y: 2 }];
    expect(getCenterOfPoints(points)).toEqual({ x: 1, y: 1 });
  });

  test('handles single point', () => {
    const points = [{ x: 5, y: 7 }];
    expect(getCenterOfPoints(points)).toEqual({ x: 5, y: 7 });
  });
});

describe('drawFrame', () => {
  test('draws when coordinates are zero', () => {
    global.canvas = { width: 100, height: 100 };
    const mockCtx = {
      clearRect: jest.fn(),
      save: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      drawImage: jest.fn(),
      restore: jest.fn(),
    };
    global.ctx = mockCtx;
    const img = {};
    drawFrame(img, 0, 0, 10, 10, 0);
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(1);
  });
});
