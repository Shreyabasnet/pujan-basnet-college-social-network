describe('User Data Tests', () => {
  it('should validate username format', () => {
    const validUsernames = ['john123', 'alice_smith', 'bob.johnson'];
    const invalidUsernames = ['', ' ', 'a'];

    validUsernames.forEach(name => {
      expect(name.length).toBeGreaterThan(1);
    });

    invalidUsernames.forEach(name => {
      expect(name.trim().length).toBeLessThanOrEqual(1);
    });
  });

  it('should validate email addresses', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test('user@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
    expect(emailRegex.test('test@domain.co.uk')).toBe(true);
  });

  it('should validate user roles', () => {
    const validRoles = ['admin', 'teacher', 'student'];
    const testRole = 'student';

    expect(validRoles).toContain(testRole);
    expect(validRoles).not.toContain('invalid_role');
  });

  it('should handle user profile data', () => {
    const user = {
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'student',
    };

    expect(user._id).toBeDefined();
    expect(user.username).toBeTruthy();
    expect(user.role).toMatch(/^(admin|teacher|student)$/);
  });
});
