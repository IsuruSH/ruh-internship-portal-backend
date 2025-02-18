package ruh_internship_portal_backend.example.ruh_internship_portal_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.dto.SelectedInternshipDetailsDTO;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.service.SelectedInternshipDetailsService;

@RestController
@CrossOrigin
@RequestMapping("/api/internship-selection")
public class SelectedInternshipDetailsController {

    @Autowired
    private SelectedInternshipDetailsService selectedinternshipDetails;
    @PostMapping("/save")
    public String getSelectedInternshipDetails(@RequestBody SelectedInternshipDetailsDTO selectedInternshipDetailsDTO) {

        selectedinternshipDetails.getSelectedInternshipDetails(selectedInternshipDetailsDTO);
            return "save";
        }


    }