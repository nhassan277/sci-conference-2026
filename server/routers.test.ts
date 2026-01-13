import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { db } from './db';
import { registrations } from '../drizzle/schema';

describe('Registration API', () => {
  const caller = appRouter.createCaller({});

  it('should create a new registration', async () => {
    const testData = {
      fullNameEnglish: 'Test User',
      fullNameArabic: 'مستخدم تجريبي',
      email: 'test@example.com',
      phone: '+20 123 456 7890',
      affiliation: 'Test University',
      attendeeCategory: 'student' as const,
      participationType: 'attendee' as const,
    };

    const result = await caller.registration.create(testData);

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.message).toBe('Registration submitted successfully');
  });

  it('should create registration with research details', async () => {
    const testData = {
      fullNameEnglish: 'Research Presenter',
      fullNameArabic: 'عارض بحث',
      email: 'presenter@example.com',
      phone: '+20 111 222 3333',
      affiliation: 'Research Institute',
      attendeeCategory: 'researcher' as const,
      participationType: 'presenter' as const,
      researchTitle: 'AI in Science',
      researchAbstract: 'This research explores AI applications in scientific research.',
    };

    const result = await caller.registration.create(testData);

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });

  it('should list all registrations', async () => {
    const result = await caller.registration.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get registration by id', async () => {
    // First create a registration
    const testData = {
      fullNameEnglish: 'Get By ID Test',
      fullNameArabic: 'اختبار الحصول بالمعرف',
      email: 'getbyid@example.com',
      phone: '+20 999 888 7777',
      affiliation: 'Test Org',
      attendeeCategory: 'faculty' as const,
      participationType: 'workshop' as const,
    };

    const created = await caller.registration.create(testData);
    
    // Then retrieve it
    const result = await caller.registration.getById({ id: created.id });

    expect(result).toBeDefined();
    expect(result.email).toBe(testData.email);
    expect(result.fullNameEnglish).toBe(testData.fullNameEnglish);
  });
});
