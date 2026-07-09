package com.motors.service;

import com.motors.entity.Product;
import com.motors.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SitemapService {

    private final ProductRepository productRepository;

    @Value("${app.site.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${app.site.api-url:http://localhost:8080/api}")
    private String apiUrl;

    public String generateSitemap() {
        String base = trimTrailingSlash(frontendUrl);
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
        appendUrl(xml, base + "/", "daily", "1.0");
        appendUrl(xml, base + "/products", "weekly", "0.9");

        List<Product> products = productRepository.findByActiveTrueOrderBySortOrderAsc();
        for (Product product : products) {
            appendUrl(xml, base + "/products/" + product.getSlug(), "weekly", "0.8");
        }

        xml.append("</urlset>");
        return xml.toString();
    }

    public String generateRobotsTxt() {
        String api = trimTrailingSlash(apiUrl);
        return """
                User-agent: *
                Allow: /
                Disallow: /admin/

                Sitemap: %s/v1/public/sitemap.xml
                """.formatted(api).trim();
    }

    private void appendUrl(StringBuilder xml, String loc, String changefreq, String priority) {
        xml.append("<url>");
        xml.append("<loc>").append(escapeXml(loc)).append("</loc>");
        xml.append("<changefreq>").append(changefreq).append("</changefreq>");
        xml.append("<priority>").append(priority).append("</priority>");
        xml.append("</url>");
    }

    private String trimTrailingSlash(String url) {
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    private String escapeXml(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
