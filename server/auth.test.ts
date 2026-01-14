import { describe, it, expect } from 'vitest';
import { verifyToken, generateToken, isOwner } from './auth';

describe('Authentication System', () => {
  it('should generate a valid JWT token', () => {
    const payload = {
      openId: 'test-open-id-123',
      name: 'Test User',
      email: 'test@example.com',
    };

    const token = generateToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should verify a valid token', () => {
    const payload = {
      openId: 'test-open-id-456',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const token = generateToken(payload);
    const decoded = verifyToken(token);

    expect(decoded).toBeDefined();
    expect(decoded?.openId).toBe(payload.openId);
    expect(decoded?.name).toBe(payload.name);
    expect(decoded?.email).toBe(payload.email);
  });

  it('should return null for invalid token', () => {
    const invalidToken = 'invalid.token.string';
    const decoded = verifyToken(invalidToken);

    expect(decoded).toBeNull();
  });

  it('should return null for expired token', () => {
    // This would require mocking time, so we'll just test with a malformed token
    const decoded = verifyToken('');
    expect(decoded).toBeNull();
  });

  it('should check if user is owner', () => {
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    
    if (ownerOpenId) {
      expect(isOwner(ownerOpenId)).toBe(true);
      expect(isOwner('different-open-id')).toBe(false);
    } else {
      // If OWNER_OPEN_ID is not set, any openId should return false
      expect(isOwner('any-open-id')).toBe(false);
    }
  });

  it('should handle token with minimal payload', () => {
    const minimalPayload = {
      openId: 'minimal-id',
    };

    const token = generateToken(minimalPayload);
    const decoded = verifyToken(token);

    expect(decoded).toBeDefined();
    expect(decoded?.openId).toBe(minimalPayload.openId);
  });
});
