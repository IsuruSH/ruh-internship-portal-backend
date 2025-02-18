package ruh_internship_portal_backend.example.ruh_internship_portal_backend.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.dto.FeedbackDTO;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.entity.Feedback;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.repo.FeedbackRepo;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.service.FeedbackService;

@Service
public class FeedbackImpl implements FeedbackService {
    @Autowired
    private FeedbackRepo feedbackRepo;


    @Override
    public String saveFeedback(FeedbackDTO feedbackDTO) {
        Feedback feedback = new Feedback(
                feedbackDTO.getFeedback_id(),
                feedbackDTO.getSc_number(),
                feedbackDTO.getCompany_name(),
                feedbackDTO.getFeedback()
        );
        feedbackRepo.save(feedback);
        return "save";
    }
}
