import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "./db";
import { galleryPhotos } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Gallery System", () => {
  const testPhotoData = {
    title: "Test Conference Photo",
    titleAr: "صورة المؤتمر التجريبية",
    description: "A test photo from the conference",
    descriptionAr: "صورة تجريبية من المؤتمر",
    imageUrl: "https://example.com/test-photo.jpg",
    imageKey: "gallery/test/test-photo.jpg",
    thumbnailUrl: "https://example.com/test-photo-thumb.jpg",
    category: "general",
    uploadedBy: "test_user_123",
    uploaderName: "Test User",
  };

  let testPhotoId: number;

  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(galleryPhotos).where(eq(galleryPhotos.uploadedBy, "test_user_123"));
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(galleryPhotos).where(eq(galleryPhotos.uploadedBy, "test_user_123"));
  });

  it("should insert a new gallery photo", async () => {
    const [result] = await db.insert(galleryPhotos).values(testPhotoData);
    testPhotoId = result.insertId;

    expect(testPhotoId).toBeGreaterThan(0);
  });

  it("should retrieve the inserted photo", async () => {
    const [photo] = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.id, testPhotoId));

    expect(photo).toBeDefined();
    expect(photo.title).toBe(testPhotoData.title);
    expect(photo.titleAr).toBe(testPhotoData.titleAr);
    expect(photo.category).toBe(testPhotoData.category);
    expect(photo.uploadedBy).toBe(testPhotoData.uploadedBy);
    expect(photo.isVisible).toBe(true);
  });

  it("should retrieve photos by category", async () => {
    // Insert another photo with different category
    await db.insert(galleryPhotos).values({
      ...testPhotoData,
      title: "Workshop Photo",
      category: "workshops",
    });

    const generalPhotos = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.category, "general"));

    const workshopPhotos = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.category, "workshops"));

    expect(generalPhotos.length).toBeGreaterThanOrEqual(1);
    expect(workshopPhotos.length).toBeGreaterThanOrEqual(1);
  });

  it("should toggle photo visibility", async () => {
    // Get current visibility
    const [photo] = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.id, testPhotoId));

    const currentVisibility = photo.isVisible;

    // Toggle visibility
    await db
      .update(galleryPhotos)
      .set({ isVisible: !currentVisibility })
      .where(eq(galleryPhotos.id, testPhotoId));

    // Verify toggle
    const [updatedPhoto] = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.id, testPhotoId));

    expect(updatedPhoto.isVisible).toBe(!currentVisibility);
  });

  it("should retrieve only visible photos", async () => {
    // Ensure test photo is visible
    await db
      .update(galleryPhotos)
      .set({ isVisible: true })
      .where(eq(galleryPhotos.id, testPhotoId));

    const visiblePhotos = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.isVisible, true));

    expect(visiblePhotos.length).toBeGreaterThan(0);
    expect(visiblePhotos.every((p) => p.isVisible)).toBe(true);
  });

  it("should delete a photo", async () => {
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, testPhotoId));

    const [deletedPhoto] = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.id, testPhotoId));

    expect(deletedPhoto).toBeUndefined();
  });

  it("should handle bilingual content correctly", async () => {
    const [result] = await db.insert(galleryPhotos).values({
      ...testPhotoData,
      title: "English Title",
      titleAr: "العنوان العربي",
      description: "English description",
      descriptionAr: "الوصف العربي",
    });

    const [photo] = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.id, result.insertId));

    expect(photo.title).toBe("English Title");
    expect(photo.titleAr).toBe("العنوان العربي");
    expect(photo.description).toBe("English description");
    expect(photo.descriptionAr).toBe("الوصف العربي");

    // Clean up
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, result.insertId));
  });
});
