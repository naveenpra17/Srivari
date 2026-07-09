package com.motors.mapper;

import com.motors.dto.response.*;
import com.motors.entity.*;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EntityMapper {

    IndustryResponse toResponse(Industry industry);

    List<IndustryResponse> toIndustryList(List<Industry> industries);

    HeroSliderResponse toResponse(HeroSlider heroSlider);

    List<HeroSliderResponse> toHeroSliderList(List<HeroSlider> sliders);

    TestimonialResponse toResponse(Testimonial testimonial);

    List<TestimonialResponse> toTestimonialList(List<Testimonial> testimonials);

    GalleryResponse toResponse(Gallery gallery);

    List<GalleryResponse> toGalleryList(List<Gallery> galleries);

    ContactMessageResponse toResponse(ContactMessage message);

    List<ContactMessageResponse> toContactMessageList(List<ContactMessage> messages);
}
