/**
 * TESTING GUIDE FOR COLLEGESOCIAL BACKEND
 * 
 * This guide explains how to effectively test your backend application
 */

# Testing Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run in watch mode (re-runs on changes)
npm run test:watch

# See coverage report
npm run test:coverage
```

## Test Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── __tests__/
│   │   │   ├── message.controller.test.js
│   │   │   ├── user.controller.test.js
│   │   │   ├── post.controller.test.js
│   │   │   └── auth.controller.test.js
│   ├── models/
│   │   ├── __tests__/
│   │   │   └── Message.test.js
│   ├── routes/
│   │   ├── __tests__/
│   │   │   └── message.routes.test.js
│   └── __tests__/
│       ├── testSetup.js
│       ├── testDB.setup.js
│       ├── integration.test.js
│       └── README.md
```

## Types of Tests

### 1. Unit Tests
Test individual functions/methods in isolation

**Example:**
```javascript
describe('JWT Utils', () => {
  it('should generate valid token', () => {
    const token = generateToken('userId');
    expect(token).toBeDefined();
  });
});
```

**When to write:**
- Testing utility functions
- Testing controller business logic
- Testing model methods

### 2. Integration Tests
Test how multiple components work together

**Example:**
```javascript
it('should create and retrieve message', async () => {
  const msg = await Message.create({...});
  const retrieved = await Message.findById(msg._id);
  expect(retrieved).toBeDefined();
});
```

**When to write:**
- Testing database interactions
- Testing API endpoints
- Testing complex workflows

### 3. Mock vs Real Database

**Mocking (Unit Tests):**
```javascript
jest.mock('../../models/Message.js');
Message.findById = jest.fn().mockResolvedValue(mockData);
```

**Real Database (Integration Tests):**
```javascript
beforeAll(() => mongoose.connect(testDbUrl));
afterEach(() => clearDatabase());
afterAll(() => mongoose.disconnect());
```

## Common Testing Patterns

### Testing Async Functions
```javascript
// Using async/await
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Using .resolves
it('should resolve promise', () => {
  return expect(promise()).resolves.toEqual(value);
});
```

### Testing Error Handling
```javascript
it('should throw on invalid input', async () => {
  await expect(async () => {
    await functionThatThrows(invalidInput);
  }).rejects.toThrow();
});
```

### Testing Object Methods
```javascript
it('should call save method', async () => {
  const mockDoc = { save: jest.fn() };
  await mockDoc.save();
  expect(mockDoc.save).toHaveBeenCalled();
});
```

### Testing Array Operations
```javascript
it('should add item to array', () => {
  const arr = [1, 2];
  arr.push(3);
  expect(arr).toHaveLength(3);
  expect(arr).toContain(3);
});
```

## Running Specific Tests

```bash
# Run single file
npm test -- message.controller.test.js

# Run by description
npm test -- --testNamePattern="JWT"

# Run in specific folder
npm test -- controllers/

# Run with coverage for specific file
npm test -- --coverage message.controller
```

## Coverage Reports

The coverage report shows:
- **Statements**: % of code executed
- **Branches**: % of conditionals tested
- **Functions**: % of functions called
- **Lines**: % of lines executed

Minimum coverage thresholds are set in jest.config.js:
```javascript
coverageThresholds: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
```

To increase thresholds, update jest.config.js and work toward better coverage.

## Best Practices

### DO:
✅ Test edge cases and error scenarios
✅ Use descriptive test names
✅ Keep tests small and focused
✅ Mock external dependencies
✅ Clean up after each test
✅ Test both positive and negative cases
✅ Use beforeEach/afterEach for setup
✅ Test behavior, not implementation

### DON'T:
❌ Make tests depend on each other
❌ Write tests that modify files/database without cleanup
❌ Use real external APIs in tests
❌ Make tests too complex
❌ Skip error testing
❌ Sleep/timeout excessively in tests
❌ Test implementation details
❌ Leave skipped tests (xit, xdescribe)

## Debugging Tests

### Run single test in debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand message.controller.test.js
```

### Add console output
```javascript
it('should work', () => {
  console.log('Debug info:', variable);
  expect(result).toBe(true);
});
```

### Run tests verbose
```bash
npm test -- --verbose
```

## Test Data Helpers

Use the testSetup.js file for common test data:

```javascript
import { 
  createMockUser, 
  createMockMessage,
  testData 
} from '../testSetup.js';

it('should work', () => {
  const user = createMockUser({ username: 'john' });
  expect(user.username).toBe('john');
});
```

## Next Steps

1. Run `npm test` to see current test results
2. Check coverage with `npm run test:coverage`
3. Fix any failing tests
4. Add tests for uncovered code
5. Increase coverage thresholds gradually
6. Integrate with CI/CD pipeline

## Helpful Resources

- Jest Documentation: https://jestjs.io/
- Testing Library: https://testing-library.com/
- Mongoose Testing: https://mongoosejs.com/docs/api.html
- Node.js Testing Guide: https://nodejs.org/en/docs/guides/testing/
