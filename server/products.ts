/**
 * Stripe Products Configuration
 * 
 * Define conference products and prices here for centralized management.
 * These IDs should match the products created in your Stripe Dashboard.
 */

export const PRODUCTS = {
  CERTIFICATE: {
    name: "Conference Certificate",
    nameAr: "شهادة المؤتمر",
    description: "Official SCI 2026 Conference Participation Certificate",
    descriptionAr: "شهادة مشاركة رسمية في مؤتمر SCI 2026",
    price: 100, // EGP
    currency: "EGP",
  },
} as const;

/**
 * Helper function to format price for display
 */
export function formatPrice(amount: number, currency: string): string {
  if (currency === "EGP") {
    return `${amount} جنيه مصري`;
  }
  return `${currency} ${amount}`;
}
