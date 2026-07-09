package com.motors.service;

import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    public String contactNotificationHtml(String name, String email, String phone, String subject, String message) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f8fa; margin: 0; padding: 24px;">
              <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(10,43,94,0.12);">
                <div style="background: #0A2B5E; padding: 24px; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 20px;">New Contact Message</h1>
                  <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Motors Industries Website</p>
                </div>
                <div style="padding: 24px; color: #1a1a2e; line-height: 1.6;">
                  <p><strong>Name:</strong> %s</p>
                  <p><strong>Email:</strong> <a href="mailto:%s">%s</a></p>
                  <p><strong>Phone:</strong> %s</p>
                  <p><strong>Subject:</strong> %s</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                  <p style="white-space: pre-wrap;">%s</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                escape(name), escape(email), escape(email),
                escape(phone != null ? phone : "N/A"),
                escape(subject != null ? subject : "General Inquiry"),
                escape(message));
    }

    public String quoteNotificationHtml(String productName, String name, String email,
                                        String phone, String company, Integer quantity, String message) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f8fa; margin: 0; padding: 24px;">
              <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(10,43,94,0.12);">
                <div style="background: #FF6B00; padding: 24px; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 20px;">New Quote Request</h1>
                  <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">%s</p>
                </div>
                <div style="padding: 24px; color: #1a1a2e; line-height: 1.6;">
                  <p><strong>Client:</strong> %s</p>
                  <p><strong>Email:</strong> <a href="mailto:%s">%s</a></p>
                  <p><strong>Phone:</strong> %s</p>
                  <p><strong>Company:</strong> %s</p>
                  <p><strong>Quantity:</strong> %s</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                  <p style="white-space: pre-wrap;">%s</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                escape(productName != null ? productName : "General Inquiry"),
                escape(name), escape(email), escape(email),
                escape(phone != null ? phone : "N/A"),
                escape(company != null ? company : "N/A"),
                quantity != null ? quantity.toString() : "N/A",
                escape(message != null ? message : "No additional message"));
    }

    private String escape(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
