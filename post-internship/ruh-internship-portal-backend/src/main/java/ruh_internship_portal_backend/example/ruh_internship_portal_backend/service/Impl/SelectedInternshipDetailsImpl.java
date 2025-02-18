package ruh_internship_portal_backend.example.ruh_internship_portal_backend.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.dto.SelectedInternshipDetailsDTO;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.entity.SelectedInternshipDetails;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.repo.SelectedInternshipDetailsRepo;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.service.SelectedInternshipDetailsService;
@Service
public class SelectedInternshipDetailsImpl implements SelectedInternshipDetailsService {
@Autowired
private SelectedInternshipDetailsRepo selectedInternshipDetailsRepo;
    @Override
    public String getSelectedInternshipDetails(SelectedInternshipDetailsDTO selectedInternshipDetailsDTO) {
        SelectedInternshipDetails selectedInternshipDetails = new SelectedInternshipDetails(
                selectedInternshipDetailsDTO.getSelection_id(),
                selectedInternshipDetailsDTO.getSc_number(),
                selectedInternshipDetailsDTO.getEmail(),
                selectedInternshipDetailsDTO.getPhone_number(),
                selectedInternshipDetailsDTO.getCompany(),
                selectedInternshipDetailsDTO.getDesignation(),
                selectedInternshipDetailsDTO.getAppointment_letter_pdf(),
                selectedInternshipDetailsDTO.getStart_date(),
                selectedInternshipDetailsDTO.getEnd_date(),
                selectedInternshipDetailsDTO.getSupervisor_name()
        );

        selectedInternshipDetailsRepo.save(selectedInternshipDetails);
        return "save";
    }
}
