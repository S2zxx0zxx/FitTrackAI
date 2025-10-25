import '@testing-library/jest-dom'

// Extend expect with custom matchers
expect.extend({
  toHaveBeenCalledOnce(received) {
    const pass = received.mock.calls.length === 1
    return {
      pass,
      message: () =>
        `Expected function to be called once but it was called ${received.mock.calls.length} times`,
    }
  },
})