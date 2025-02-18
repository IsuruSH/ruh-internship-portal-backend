package ruh_internship_portal_backend.example.ruh_internship_portal_backend.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SelectedInternshipDetailsDTO {
    private int selection_id;

    private String sc_number;

    private String email;

    private String phone_number;

    private String company;

    private String designation;

    private String appointment_letter_pdf;

    private Date start_date;

    private Date end_date;

    private String supervisor_name;



}
