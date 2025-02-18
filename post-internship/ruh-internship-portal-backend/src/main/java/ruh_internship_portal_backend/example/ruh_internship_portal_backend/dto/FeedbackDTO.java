package ruh_internship_portal_backend.example.ruh_internship_portal_backend.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FeedbackDTO {

    private Long feedback_id;

    private String sc_number;

    private String company_name;

    private String feedback;

    private LocalDateTime submittedAt = LocalDateTime.now();
}
