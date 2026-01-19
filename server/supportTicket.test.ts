import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers.js";
import { db } from "./db.js";
import { supportTickets } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

describe("Support Ticket API", () => {
  const caller = appRouter.createCaller({});
  let createdTicketId: number;

  // Clean up test data after all tests
  afterAll(async () => {
    if (createdTicketId) {
      await db.delete(supportTickets).where(eq(supportTickets.id, createdTicketId));
    }
  });

  it("should create a new support ticket", async () => {
    const result = await caller.supportTicket.create({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Support Issue",
      message: "This is a test support ticket message for automated testing",
      priority: "normal",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.message).toBe("Support ticket submitted successfully");
    
    createdTicketId = result.id;
  });

  it("should list all support tickets", async () => {
    const tickets = await caller.supportTicket.list();
    
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBeGreaterThan(0);
    
    const testTicket = tickets.find((t) => t.id === createdTicketId);
    expect(testTicket).toBeDefined();
    expect(testTicket?.name).toBe("Test User");
    expect(testTicket?.status).toBe("open"); // Default status
  });

  it("should get a ticket by ID", async () => {
    const ticket = await caller.supportTicket.getById({ id: createdTicketId });
    
    expect(ticket).toBeDefined();
    expect(ticket.id).toBe(createdTicketId);
    expect(ticket.subject).toBe("Test Support Issue");
    expect(ticket.priority).toBe("normal");
  });

  it("should update ticket status", async () => {
    const result = await caller.supportTicket.updateStatus({
      id: createdTicketId,
      status: "in-progress",
      response: "We are looking into your issue",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Ticket updated successfully");

    const updatedTicket = await caller.supportTicket.getById({ id: createdTicketId });
    expect(updatedTicket.status).toBe("in-progress");
    expect(updatedTicket.response).toBe("We are looking into your issue");
  });

  it("should mark ticket as resolved", async () => {
    const result = await caller.supportTicket.updateStatus({
      id: createdTicketId,
      status: "resolved",
    });

    expect(result.success).toBe(true);

    const resolvedTicket = await caller.supportTicket.getById({ id: createdTicketId });
    expect(resolvedTicket.status).toBe("resolved");
  });

  it("should validate required fields", async () => {
    await expect(
      caller.supportTicket.create({
        name: "",
        email: "test@example.com",
        subject: "Test",
        message: "Test message",
      })
    ).rejects.toThrow();
  });

  it("should validate email format", async () => {
    await expect(
      caller.supportTicket.create({
        name: "Test User",
        email: "invalid-email",
        subject: "Test",
        message: "Test message",
      })
    ).rejects.toThrow();
  });
});
