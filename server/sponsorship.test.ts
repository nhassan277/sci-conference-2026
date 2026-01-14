import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('Sponsorship API', () => {
  const caller = appRouter.createCaller({});

  it('should create a new sponsorship inquiry', async () => {
    const testData = {
      companyName: 'Test Company Ltd',
      contactPerson: 'John Smith',
      email: 'john@testcompany.com',
      phone: '+20 123 456 7890',
      packageType: 'gold' as const,
      companyWebsite: 'https://www.testcompany.com',
      message: 'We are interested in sponsoring the conference',
    };

    const result = await caller.sponsorship.create(testData);

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.message).toBe('Sponsorship inquiry submitted successfully');
  });

  it('should create sponsorship without optional fields', async () => {
    const testData = {
      companyName: 'Minimal Company',
      contactPerson: 'Jane Doe',
      email: 'jane@minimal.com',
      phone: '+20 111 222 3333',
      packageType: 'bronze' as const,
    };

    const result = await caller.sponsorship.create(testData);

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });

  it('should list all sponsorship inquiries', async () => {
    const result = await caller.sponsorship.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get sponsorship by id', async () => {
    // First create a sponsorship
    const testData = {
      companyName: 'Get By ID Test',
      contactPerson: 'Test Person',
      email: 'test@getbyid.com',
      phone: '+20 999 888 7777',
      packageType: 'platinum' as const,
      companyWebsite: 'https://www.getbyid.com',
    };

    const created = await caller.sponsorship.create(testData);
    
    // Then retrieve it
    const result = await caller.sponsorship.getById({ id: created.id });

    expect(result).toBeDefined();
    expect(result.email).toBe(testData.email);
    expect(result.companyName).toBe(testData.companyName);
    expect(result.packageType).toBe(testData.packageType);
  });

  it('should validate required fields', async () => {
    const invalidData = {
      companyName: '',
      contactPerson: 'Test',
      email: 'invalid-email',
      phone: '',
      packageType: 'gold' as const,
    };

    await expect(caller.sponsorship.create(invalidData as any)).rejects.toThrow();
  });
});
