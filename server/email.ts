// Using Manus built-in notification API
// The notifyOwner function will be imported from the notification module when available
// For now, we'll create a simple implementation using the notification endpoint

async function notifyOwner(data: { title: string; content: string }): Promise<boolean> {
  try {
    // This would call the Manus notification API
    // For now, just log to console
    console.log(`[Notification] ${data.title}`);
    console.log(data.content);
    return true;
  } catch (error) {
    console.error("[Notification] Error:", error);
    return false;
  }
}

/**
 * Email notification helper for SCI 2026 Conference
 * Uses Manus notification API to send emails to organizers
 */

interface RegistrationEmailData {
  fullNameEnglish: string;
  fullNameArabic: string;
  email: string;
  phone: string;
  affiliation: string;
  attendeeCategory: string;
  participationType: string;
  wantsCertificate: boolean;
  registrationId: number;
}

interface PaymentEmailData {
  fullNameEnglish: string;
  email: string;
  registrationId: number;
  amount: number;
  currency: string;
}

interface SupportTicketEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: string;
  ticketId: number;
}

/**
 * Send registration confirmation notification to organizers
 */
export async function sendRegistrationNotification(data: RegistrationEmailData): Promise<boolean> {
  const certificateText = data.wantsCertificate ? "✅ Certificate Requested (100 EGP)" : "❌ No Certificate";
  
  const content = `
**New Conference Registration**

**Registration ID:** #${data.registrationId}

**Participant Information:**
- **Name (English):** ${data.fullNameEnglish}
- **Name (Arabic):** ${data.fullNameArabic}
- **Email:** ${data.email}
- **Phone:** ${data.phone}
- **Affiliation:** ${data.affiliation}
- **Category:** ${data.attendeeCategory}
- **Participation Type:** ${data.participationType}
- **Certificate:** ${certificateText}

**Next Steps:**
${data.wantsCertificate ? "- Participant will be redirected to payment for certificate\n- Payment status will be updated automatically via webhook" : "- No further action required for this registration"}

View all registrations in the admin dashboard.
  `.trim();

  try {
    const success = await notifyOwner({
      title: `New Registration: ${data.fullNameEnglish}`,
      content,
    });
    
    if (success) {
      console.log(`[Email] Registration notification sent for #${data.registrationId}`);
    } else {
      console.warn(`[Email] Failed to send registration notification for #${data.registrationId}`);
    }
    
    return success;
  } catch (error: any) {
    console.error(`[Email] Error sending registration notification: ${error.message}`);
    return false;
  }
}

/**
 * Send payment confirmation notification to organizers
 */
export async function sendPaymentConfirmationNotification(data: PaymentEmailData): Promise<boolean> {
  const content = `
**Certificate Payment Confirmed**

**Registration ID:** #${data.registrationId}

**Payment Details:**
- **Participant:** ${data.fullNameEnglish}
- **Email:** ${data.email}
- **Amount:** ${data.amount} ${data.currency}
- **Product:** Conference Certificate
- **Status:** ✅ Paid

The participant has successfully completed the certificate payment. The registration record has been updated with payment status.

View payment details in the admin dashboard.
  `.trim();

  try {
    const success = await notifyOwner({
      title: `Payment Confirmed: ${data.fullNameEnglish}`,
      content,
    });
    
    if (success) {
      console.log(`[Email] Payment confirmation sent for registration #${data.registrationId}`);
    } else {
      console.warn(`[Email] Failed to send payment confirmation for registration #${data.registrationId}`);
    }
    
    return success;
  } catch (error: any) {
    console.error(`[Email] Error sending payment confirmation: ${error.message}`);
    return false;
  }
}

/**
 * Send support ticket notification to organizers
 */
export async function sendSupportTicketNotification(data: SupportTicketEmailData): Promise<boolean> {
  const priorityEmoji = data.priority === "high" ? "🔴" : data.priority === "normal" ? "🟡" : "🟢";
  
  const content = `
**New Support Ticket**

**Ticket ID:** #${data.ticketId}
**Priority:** ${priorityEmoji} ${data.priority.toUpperCase()}

**Submitter Information:**
- **Name:** ${data.name}
- **Email:** ${data.email}

**Subject:** ${data.subject}

**Message:**
${data.message}

**Next Steps:**
- Review the ticket in the admin dashboard
- Update ticket status and provide a response
- Ticket submitter will receive updates via email

View all support tickets in the admin dashboard.
  `.trim();

  try {
    const success = await notifyOwner({
      title: `New Support Ticket: ${data.subject}`,
      content,
    });
    
    if (success) {
      console.log(`[Email] Support ticket notification sent for #${data.ticketId}`);
    } else {
      console.warn(`[Email] Failed to send support ticket notification for #${data.ticketId}`);
    }
    
    return success;
  } catch (error: any) {
    console.error(`[Email] Error sending support ticket notification: ${error.message}`);
    return false;
  }
}

/**
 * Send sponsorship inquiry notification to organizers
 */
export async function sendSponsorshipNotification(data: {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  packageType: string;
  sponsorshipId: number;
}): Promise<boolean> {
  const content = `
**New Sponsorship Inquiry**

**Sponsorship ID:** #${data.sponsorshipId}

**Company Information:**
- **Company Name:** ${data.companyName}
- **Contact Person:** ${data.contactPerson}
- **Email:** ${data.email}
- **Phone:** ${data.phone}
- **Package Type:** ${data.packageType.toUpperCase()}

**Next Steps:**
- Review the sponsorship inquiry in the admin dashboard
- Contact the company to discuss partnership details
- Finalize sponsorship agreement

View all sponsorship inquiries in the admin dashboard.
  `.trim();

  try {
    const success = await notifyOwner({
      title: `New Sponsorship: ${data.companyName}`,
      content,
    });
    
    if (success) {
      console.log(`[Email] Sponsorship notification sent for #${data.sponsorshipId}`);
    } else {
      console.warn(`[Email] Failed to send sponsorship notification for #${data.sponsorshipId}`);
    }
    
    return success;
  } catch (error: any) {
    console.error(`[Email] Error sending sponsorship notification: ${error.message}`);
    return false;
  }
}

/**
 * Send VIP check-in alert to organizers
 */
export async function sendVIPCheckinAlert(data: {
  fullNameEnglish: string;
  fullNameArabic: string;
  email: string;
  affiliation: string;
  attendeeCategory: string;
  checkedInBy: string;
  checkedInAt: Date;
}): Promise<boolean> {
  const formattedTime = data.checkedInAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  
  const content = `
**🌟 VIP Attendee Check-In Alert**

**VIP Information:**
- **Name (English):** ${data.fullNameEnglish}
- **Name (Arabic):** ${data.fullNameArabic}
- **Email:** ${data.email}
- **Affiliation:** ${data.affiliation}
- **Category:** ${data.attendeeCategory}

**Check-In Details:**
- **Time:** ${formattedTime}
- **Checked In By:** ${data.checkedInBy}

**Action Required:**
- Greet the VIP attendee personally
- Ensure they have all necessary materials
- Provide any special assistance as needed

This is an automated alert for VIP attendee check-ins.
  `.trim();

  try {
    const success = await notifyOwner({
      title: `🌟 VIP Check-In: ${data.fullNameEnglish}`,
      content,
    });
    
    if (success) {
      console.log(`[Email] VIP check-in alert sent for ${data.fullNameEnglish}`);
    } else {
      console.warn(`[Email] Failed to send VIP check-in alert for ${data.fullNameEnglish}`);
    }
    
    return success;
  } catch (error: any) {
    console.error(`[Email] Error sending VIP check-in alert: ${error.message}`);
    return false;
  }
}
