package ruh_internship_portal_backend.example.ruh_internship_portal_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.dto.DiaryUpdateDTO;
import ruh_internship_portal_backend.example.ruh_internship_portal_backend.service.DiaryUpdateService;


@RestController
@CrossOrigin
@RequestMapping("/api/diaryupdate")

public class DiaryUpdateController {
    @Autowired
    private DiaryUpdateService diaryUpdateService;
    @PostMapping("/save")
    public String getDiaryUpdate(@RequestBody DiaryUpdateDTO diaryUpdateDTO) {
        diaryUpdateService.getDiaryUpdate(diaryUpdateDTO);
        return "save";
    }

    }


