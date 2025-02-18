package ruh_internship_portal_backend.example.ruh_internship_portal_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Table
@Entity(name = "selected_internship_details")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SelectedInternshipDetails {
    @Id
    @Column(name = "selection_id",length = 46)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int selection_id;
    @Column(name = "sc_number")
    private String sc_number;
    @Column(name = "email")
    private String email;
    @Column(name = "Contact_number")
    private String phone_number;
    @Column(name = "company_name")
    private String company;
    @Column(name = "designation")
    private String designation;
    @Column(name = "appointment_letter_pdf")
    private String appointment_letter_pdf;
    @Column(name = "start_date")
    private Date start_date;
    @Column(name = "end_date")
    private Date end_date;
    @Column(name = "supervisor_name")
    private String supervisor_name;


}
