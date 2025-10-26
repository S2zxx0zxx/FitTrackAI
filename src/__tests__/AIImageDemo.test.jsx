import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AIImageDemo from '../components/AIImageDemo';

// Mock the imageClassifier module to avoid loading real TFJS in tests
vi.mock('../utils/ai/imageClassifier', () => ({
  loadMobileNet: async () => ({ model: { mock: true } }),
  classifyImage: async (img, model) => [{ className: 'test-object', probability: 0.87 }]
}));

describe('AIImageDemo', () => {
  test('loads model and shows mock predictions', async () => {
    render(<AIImageDemo />);
    const loadBtn = screen.getByText(/Load model/i);
    fireEvent.click(loadBtn);
    // wait for model loaded button text
    const loaded = await screen.findByText(/Model loaded/i, {}, { timeout: 3000 });
    expect(loaded).toBeInTheDocument();

    // mock selecting a file by setting img src directly
    const img = screen.getByAltText('preview');
    // simulate image loaded
    Object.defineProperty(img, 'complete', { value: true });

    const classifyBtn = screen.getByText(/Classify image/i);
    fireEvent.click(classifyBtn);

    const pred = await screen.findByText(/test-object/i);
    expect(pred).toBeInTheDocument();
  });
});
