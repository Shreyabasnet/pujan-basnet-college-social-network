describe('Basic Math Tests', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should multiply numbers correctly', () => {
    expect(2 * 3).toBe(6);
  });

  it('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid.email')).toBe(false);
  });

  it('should validate password strength', () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    expect(passwordRegex.test('SecurePass123')).toBe(true);
    expect(passwordRegex.test('weak')).toBe(false);
  });

  it('should handle string operations', () => {
    const text = 'Hello World';
    expect(text.toLowerCase()).toBe('hello world');
    expect(text.split(' ')).toHaveLength(2);
  });

  it('should handle array operations', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should handle object operations', () => {
    const obj = { name: 'test', age: 25 };
    expect(obj.name).toBe('test');
    expect(obj).toHaveProperty('age');
  });
});
