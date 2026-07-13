package com.motors.config;

import com.motors.entity.Product;
import com.motors.entity.ProductImage;
import com.motors.repository.ProductImageRepository;
import com.motors.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.cache.CacheManager;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
public class ProductCatalogInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CacheManager cacheManager;

    @Override
    @Transactional
    public void run(String... args) {
        boolean updated = seedProductDetails();
        if (updated) {
            clearProductCaches();
        }
    }

    private void clearProductCaches() {
        if (cacheManager.getCache("featuredProducts") != null) {
            cacheManager.getCache("featuredProducts").clear();
        }
        if (cacheManager.getCache("homePageData") != null) {
            cacheManager.getCache("homePageData").clear();
        }
    }

    private boolean seedProductDetails() {
        boolean updated = false;
        updated |= upsertProduct(
                "industrial-ac-motor",
                "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=85",
                "Our industrial AC motors deliver exceptional performance, energy efficiency, and reliability for demanding manufacturing environments. Built with precision engineering and premium materials, these motors are ideal for compressors, conveyors, machine tools, and process equipment.",
                specs(
                        "Motor Type", "Three Phase Induction Motor",
                        "Power Range", "1 HP to 50 HP",
                        "Voltage", "415V AC, 3 Phase",
                        "Frequency", "50 Hz",
                        "Speed", "1440 RPM (4 Pole)",
                        "Efficiency Class", "IE2 / IE3",
                        "Enclosure", "TEFC (Totally Enclosed Fan Cooled)",
                        "Mounting", "Foot / Flange (B3 / B5)",
                        "Insulation Class", "Class F",
                        "Protection", "IP55",
                        "Ambient Temperature", "Up to 45°C",
                        "Application", "Compressors, conveyors, machine tools, industrial drives"
                ),
                List.of(
                        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=85",
                        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=85"
                )
        );

        updated |= upsertProduct(
                "centrifugal-pump",
                "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=85",
                "Engineered for maximum flow rate and minimal maintenance in industrial fluid handling systems. Suitable for water supply, irrigation, HVAC circulation, and general industrial transfer applications.",
                specs(
                        "Pump Type", "Centrifugal End Suction Pump",
                        "Flow Rate", "Up to 120 m³/hr",
                        "Head", "Up to 60 meters",
                        "Power", "1 HP to 15 HP",
                        "Inlet/Outlet", "1.5\" to 4\"",
                        "Material", "Cast Iron with SS Impeller option",
                        "Seal Type", "Mechanical Seal",
                        "Application", "Water transfer, irrigation, HVAC, industrial circulation"
                ),
                List.of("https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=85")
        );

        updated |= upsertProduct(
                "stainless-steel-pipes",
                "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=85",
                "Premium grade stainless steel pipes designed for chemical, marine, and industrial applications with excellent corrosion resistance and long service life.",
                specs(
                        "Material Grade", "SS 304 / SS 316",
                        "Diameter Range", "1/2\" to 8\"",
                        "Wall Thickness", "Schedule 10 / 40 / 80",
                        "Standard", "ASTM A312",
                        "Finish", "Pickled & Annealed",
                        "Application", "Chemical processing, marine, food grade, industrial piping"
                ),
                List.of("https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=85")
        );

        updated |= upsertProduct(
                "motor-couplings",
                "https://images.unsplash.com/photo-1581092162384-89889c1a33f0?w=1200&q=85",
                "High-torque couplings ensuring smooth and efficient power transfer between motors and driven equipment with minimal vibration and extended component life.",
                specs(
                        "Type", "Flexible Jaw / Gear Coupling",
                        "Torque Range", "10 Nm to 5000 Nm",
                        "Bore Range", "10 mm to 120 mm",
                        "Material", "Aluminium / Steel Hub with PU Spider",
                        "Max RPM", "Up to 6000 RPM",
                        "Application", "Motor to pump, gearbox, and compressor connections"
                ),
                List.of("https://images.unsplash.com/photo-1581092162384-89889c1a33f0?w=1200&q=85")
        );

        return updated;
    }

    private boolean upsertProduct(
            String slug,
            String imageUrl,
            String description,
            Map<String, String> specifications,
            List<String> galleryUrls) {

        return productRepository.findBySlug(slug).map(product -> {
            boolean changed = false;

            if (isBlank(product.getImageUrl())) {
                product.setImageUrl(imageUrl);
                changed = true;
            }
            if (isBlank(product.getDescription()) || product.getDescription().length() < 120) {
                product.setDescription(description);
                changed = true;
            }
            if (product.getSpecifications() == null || product.getSpecifications().isEmpty()) {
                product.setSpecifications(new LinkedHashMap<>(specifications));
                changed = true;
            }

            if (changed) {
                productRepository.save(product);
                log.info("Updated catalog details for product: {}", slug);
            }

            if (productImageRepository.countByProductId(product.getId()) == 0) {
                addGalleryImages(product, galleryUrls);
                log.info("Added gallery images for product: {}", slug);
                changed = true;
            }

            return changed;
        }).orElseGet(() -> {
            log.debug("Product not found for catalog seeding: {}", slug);
            return false;
        });
    }

    private void addGalleryImages(Product product, List<String> galleryUrls) {
        for (int i = 0; i < galleryUrls.size(); i++) {
            productImageRepository.save(ProductImage.builder()
                    .product(product)
                    .imageUrl(galleryUrls.get(i))
                    .altText(product.getName())
                    .sortOrder(i)
                    .isPrimary(i == 0)
                    .build());
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static Map<String, String> specs(String... keyValuePairs) {
        Map<String, String> specifications = new LinkedHashMap<>();
        for (int i = 0; i < keyValuePairs.length; i += 2) {
            specifications.put(keyValuePairs[i], keyValuePairs[i + 1]);
        }
        return specifications;
    }
}
