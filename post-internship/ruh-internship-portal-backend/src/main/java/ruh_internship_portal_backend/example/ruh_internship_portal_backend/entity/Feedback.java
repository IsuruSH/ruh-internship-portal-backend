package ruh_internship_portal_backend.example.ruh_internship_portal_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table
@Entity(name = "Feedback_from_student")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Feedback {
    @Id
    @Column(name = "feedback_id",length = 46)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedback_id;
    @Column(name = "sc_number",nullable = false)
    private String sc_number;
    @Column(name = "company_name")
    private String company_name;
    @Column(name = "feedback_notes",columnDefinition = "TEXT", nullable = false)
    private String feedback;
    @Column(name = "submit_at")
    private LocalDateTime submittedAt = LocalDateTime.now();

    public Feedback(Long feedbackId, String scNumber, String companyName, String feedback) {
        this.feedback_id = feedbackId;
        this.sc_number = scNumber;
        this.company_name = companyName;
        this.feedback = feedback;
        this.submittedAt = LocalDateTime.now();
    }

}
