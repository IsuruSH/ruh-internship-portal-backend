package ruh_internship_portal_backend.example.ruh_internship_portal_backend.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.dto.DiaryUpdateDTO;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.entity.DiaryUpdate;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.repo.DiaryUpdateRepo;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.repo.SelectedInternshipDetailsRepo;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.service.DiaryUpdateService;
@Service
public class DiaryUpdateImpl implements DiaryUpdateService {
@Autowired
private DiaryUpdateRepo diaryUpdateRepo;

    @Override
    public String getDiaryUpdate(DiaryUpdateDTO diaryUpdateDTO) {
        DiaryUpdate diaryUpdate = new DiaryUpdate(
                diaryUpdateDTO.getDiary_id(),
                diaryUpdateDTO.getEntryType(),
                diaryUpdateDTO.getDate(),
                diaryUpdateDTO.getWeekNumber(),
                diaryUpdateDTO.getNotes()
        );
        diaryUpdateRepo.save(diaryUpdate);
        return "save";
    }
}
