package ruh_internship_portal_backend.example.ruh_internship_portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.entity.EntryType;

import java.time.LocalDate;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiaryUpdateDTO {
    private Long  diary_id;
    private EntryType entryType;
    private LocalDate date;
    private Integer weekNumber;
    private String notes;
}
