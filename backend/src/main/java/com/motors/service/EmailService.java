package com.motors.service;

import com.motors.entity.ContactMessage;
import com.motors.entity.QuoteRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final EmailTemplateService emailTemplateService;

    @Value("${app.mail.from:noreply@motors.com}")
    private String fromEmail;

    @Value("${app.mail.admin:admin@motors.com}")
    private String adminEmail;

    public void sendContactNotification(ContactMessage message) {
        String subject = "New Contact: " + (message.getSubject() != null ? message.getSubject() : "General Inquiry");
        String html = emailTemplateService.contactNotificationHtml(
                message.getName(), message.getEmail(), message.getPhone(),
                message.getSubject(), message.getMessage());
        sendHtmlEmail(subject, html);
    }

    public void sendQuoteNotification(QuoteRequest quote) {
        String subject = "New Quote Request: " + (quote.getProductName() != null ? quote.getProductName() : "General");
        String html = emailTemplateService.quoteNotificationHtml(
                quote.getProductName(), quote.getName(), quote.getEmail(),
                quote.getPhone(), quote.getCompany(), quote.getQuantity(), quote.getMessage());
        sendHtmlEmail(subject, html);
    }

    private void sendHtmlEmail(String subject, String htmlContent) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.info("Mail not configured — skipping notification: {}", subject);
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Notification email sent: {}", subject);
        } catch (MessagingException | MailException e) {
            log.warn("Failed to send HTML email: {}", e.getMessage());
        } catch (Exception e) {
            log.warn("Unexpected error sending email: {}", e.getMessage());
        }
    }
}
