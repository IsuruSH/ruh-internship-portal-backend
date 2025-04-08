from fastapi import FastAPI
from pydantic import BaseModel
import spacy
from spacy.matcher import PhraseMatcher
from typing import List, Dict, Optional
import numpy as np

app = FastAPI()
nlp = spacy.load("en_core_web_md")  # Medium model for word vectors

# ================== Enhanced Career Path Definitions ==================
CAREER_PATHS = {
    "Software Developer": {
        "required_skills": {
            "programming": 0.95,
            "algorithms": 0.9,
            "debugging": 0.85,
            "software design": 0.85,
            "git": 0.8
        },
        "related_subjects": ["Programming Techniques", "Object Oriented System Development", "Computer Systems I"],
        "tools": ["vscode", "intellij", "git", "docker"],
        "boosters": ["github", "portfolio", "leetcode"]
    },
    "Full Stack Developer": {
        "required_skills": {
            "javascript": 0.95,
            "html/css": 0.85,
            "react": 0.85,
            "node.js": 0.8,
            "database": 0.85
        },
        "related_subjects": ["Internet Services and Web Development", "Internet Programming", "Database Management systems"],
        "tools": ["react", "angular", "vue", "express"],
        "boosters": ["fullstack project", "web app"]
    },
    "Web Developer": {
        "required_skills": {
            "html/css": 0.9,
            "javascript": 0.9,
            "responsive design": 0.85,
            "web standards": 0.8
        },
        "related_subjects": ["Internet Services and Web Development", "Internet Programming", "Multimedia and Video Production"],
        "tools": ["wordpress", "shopify", "bootstrap"],
        "boosters": ["live website", "web design"]
    },
    "Mobile App Developer": {
        "required_skills": {
            "mobile development": 0.95,
            "swift/kotlin": 0.9,
            "ui/ux": 0.85,
            "apis": 0.85
        },
        "related_subjects": ["Object Oriented System Development", "Rapid Application Development", "Internet Programming"],
        "tools": ["flutter", "react native", "android studio"],
        "boosters": ["app store", "mobile project"]
    },
    "DevOps Engineer": {
        "required_skills": {
            "cloud computing": 0.95,
            "docker": 0.9,
            "kubernetes": 0.85,
            "CI/CD": 0.85,
            "linux": 0.9
        },
        "related_subjects": ["System Analyst & Design", "Distributed Systems", "Project Management"],
        "tools": ["aws", "azure", "jenkins", "terraform"],
        "boosters": ["deployment pipeline", "infrastructure as code"]
    },
    "Cloud Engineer": {
        "required_skills": {
            "cloud platforms": 0.95,
            "networking": 0.85,
            "security": 0.85,
            "automation": 0.85
        },
        "related_subjects": ["Distributed Systems", "Data and Network Security", "Computer Systems I"],
        "tools": ["aws", "google cloud", "azure"],
        "boosters": ["cloud certification", "scalable architecture"]
    },
    "Data Scientist": {
        "required_skills": {
            "python": 0.95,
            "statistics": 0.9,
            "machine learning": 0.9,
            "data analysis": 0.9,
            "sql": 0.85
        },
        "related_subjects": ["Introductory Statistics", "Data Warehousing and Data mining", "Differential Equations"],
        "tools": ["pandas", "numpy", "scikit-learn", "tensorflow"],
        "boosters": ["kaggle", "jupyter notebook"]
    },
    "Data Analyst": {
        "required_skills": {
            "sql": 0.9,
            "data visualization": 0.9,
            "excel": 0.85,
            "statistics": 0.85
        },
        "related_subjects": ["Introductory Statistics", "Database Management systems", "Data Warehousing and Data mining"],
        "tools": ["tableau", "power bi", "excel"],
        "boosters": ["dashboard", "data report"]
    },
    "Machine Learning Engineer": {
        "required_skills": {
            "python": 0.95,
            "machine learning": 0.95,
            "deep learning": 0.9,
            "data pipelines": 0.85
        },
        "related_subjects": ["Data Warehousing and Data mining", "Introductory Statistics", "Differential Equations"],
        "tools": ["tensorflow", "pytorch", "keras"],
        "boosters": ["ml model", "neural network"]
    },
    "AI Engineer": {
        "required_skills": {
            "python": 0.95,
            "neural networks": 0.95,
            "nlp": 0.9,
            "computer vision": 0.9
        },
        "related_subjects": ["Data Warehousing and Data mining", "Introductory Statistics", "Computer Systems I"],
        "tools": ["tensorflow", "opencv", "nltk"],
        "boosters": ["ai project", "research paper"]
    },
    "Cybersecurity Analyst": {
        "required_skills": {
            "network security": 0.95,
            "encryption": 0.9,
            "vulnerability assessment": 0.9,
            "firewalls": 0.85
        },
        "related_subjects": ["Data and Network Security", "Network and System Administration", "Computer Systems I"],
        "tools": ["wireshark", "metasploit", "nessus"],
        "boosters": ["security certification", "pentest report"]
    },
    "Ethical Hacker / Penetration Tester": {
        "required_skills": {
            "penetration testing": 0.95,
            "vulnerability scanning": 0.9,
            "ethical hacking": 0.9,
            "security protocols": 0.85
        },
        "related_subjects": ["Data and Network Security", "Network and System Administration", "Computer Systems I"],
        "tools": ["kali linux", "burp suite", "john the ripper"],
        "boosters": ["bug bounty", "ctf competition"]
    },
    "Systems Engineer": {
        "required_skills": {
            "system architecture": 0.95,
            "networking": 0.9,
            "operating systems": 0.9,
            "virtualization": 0.85
        },
        "related_subjects": ["Computer Systems I", "Network and System Administration", "Distributed Systems"],
        "tools": ["vmware", "ansible", "linux"],
        "boosters": ["system design", "scalable infrastructure"]
    },
    "Embedded Systems Engineer": {
        "required_skills": {
            "c/c++": 0.95,
            "microcontrollers": 0.9,
            "iot": 0.85,
            "hardware design": 0.85
        },
        "related_subjects": ["Computer Systems I", "Programming Techniques", "Object Oriented System Development"],
        "tools": ["arduino", "raspberry pi", "embedded c"],
        "boosters": ["iot project", "hardware prototype"]
    },
    "Game Developer": {
        "required_skills": {
            "game engines": 0.95,
            "c#/c++": 0.9,
            "3d modeling": 0.85,
            "physics": 0.8
        },
        "related_subjects": ["Computer Graphics and Image Processing", "Object Oriented System Development", "Programming Techniques"],
        "tools": ["unity", "unreal engine", "blender"],
        "boosters": ["published game", "game jam"]
    },
    "UI/UX Designer": {
        "required_skills": {
            "user research": 0.95,
            "wireframing": 0.9,
            "prototyping": 0.9,
            "visual design": 0.85
        },
        "related_subjects": ["Internet Services and Web Development", "Multimedia and Video Production", "System Analyst & Design"],
        "tools": ["figma", "adobe xd", "sketch"],
        "boosters": ["design portfolio", "user study"]
    },
    "Business Analyst": {
        "required_skills": {
            "requirements analysis": 0.95,
            "stakeholder management": 0.9,
            "data analysis": 0.85,
            "process modeling": 0.85,
            "business acumen": 0.9
        },
        "related_subjects": ["E-commerce and Professional Practice", "Database Management Systems", "System Analyst & Design"],
        "tools": ["excel", "power bi", "sql", "jira"],
        "boosters": ["business case study", "requirements document"]
    },
    "Project Manager": {
        "required_skills": {
            "project planning": 0.95,
            "risk management": 0.9,
            "team leadership": 0.9,
            "budgeting": 0.85,
            "agile methodologies": 0.9
        },
        "related_subjects": ["Project Management", "System Analyst & Design", "Group Projects"],
        "tools": ["microsoft project", "jira", "trello", "asana"],
        "boosters": ["pmp certification", "successful project delivery"]
    },
    "Quality Assurance Engineer": {
        "required_skills": {
            "test planning": 0.95,
            "test automation": 0.9,
            "bug tracking": 0.9,
            "regression testing": 0.85,
            "performance testing": 0.85
        },
        "related_subjects": ["Software Engineering", "System Analyst & Design", "Project Management"],
        "tools": ["selenium", "jira", "postman", "testrail"],
        "boosters": ["test coverage report", "automation framework"]
    }
}

# ================== Data Models ==================
class SubjectResult(BaseModel):
    subject_code: str
    subject_name: str
    is_core: int
    grade: str

class YearResult(BaseModel):
    year: int
    subjects: List[SubjectResult]

class StudentData(BaseModel):
    resultsByYear: List[YearResult]
    cv_text: str

# ================== Helper Functions ==================
def get_credit(subject_code: str) -> float:
    """Extract credit from subject code"""
    last_char = subject_code[-1].lower()
    if last_char == 'a': return 1.5
    elif last_char == 'b': return 2.5
    elif last_char == 'c': return 1.25
    try:
        return float(last_char)  # If numeric
    except:
        return 1.0  # Default

def grade_to_score(grade: str) -> float:
    grade_map = {'A+': 4.0, 'A': 4.0, 'A-': 3.7,
                 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                 'C+': 2.3, 'C': 2.0, 'C-': 1.7,
                 'D+': 1.3, 'D': 1.0, 'F': 0.0}
    return grade_map.get(grade.upper(), 0)

# ================== Core Recommendation Logic ==================
def extract_skills(text: str) -> List[str]:
    """Extract skills from CV text"""
    doc = nlp(text.lower())
    matcher = PhraseMatcher(nlp.vocab)
    
    # Add all career skills to matcher
    all_skills = []
    for path in CAREER_PATHS.values():
        all_skills.extend(list(path["required_skills"].keys()) + path["tools"])
    patterns = [nlp(skill) for skill in set(all_skills)]
    matcher.add("SKILLS", patterns)
    
    matches = matcher(doc)
    return list(set(doc[start:end].text for _, start, end in matches))

def identify_strengths(career: str, cv_skills: List[str]) -> List[str]:
    """Identify top 3 strongest matching skills for a career"""
    career_data = CAREER_PATHS[career]
    skill_scores = []
    
    for skill in cv_skills:
        for req_skill, weight in career_data["required_skills"].items():
            similarity = nlp(skill).similarity(nlp(req_skill))
            if similarity > 0.7:  # Only consider significant matches
                skill_scores.append((req_skill, similarity * weight))
    
    # Get top 3 unique skills by match score
    unique_skills = {}
    for skill, score in skill_scores:
        if skill not in unique_skills or score > unique_skills[skill]:
            unique_skills[skill] = score
    
    return sorted(unique_skills.keys(), key=lambda x: unique_skills[x], reverse=True)[:3]

def generate_improvements(career: str, cv_skills: List[str]) -> List[str]:
    """Generate personalized improvement suggestions"""
    career_data = CAREER_PATHS[career]
    improvements = []
    
    # Missing core skills
    missing_core = [
        skill for skill, weight in career_data["required_skills"].items() 
        if weight >= 0.8 and not any(
            nlp(skill).similarity(nlp(cv_skill)) > 0.7 
            for cv_skill in cv_skills
        )
    ]
    
    for skill in missing_core[:2]:  # Suggest for top 2 missing core skills
        related_courses = [
            subj for subj in career_data["related_subjects"]
            if skill.lower() in subj.lower()
        ]
        if related_courses:
            improvements.append(
                f"Develop {skill} through: {', '.join(related_courses[:2])} courses"
            )
        else:
            improvements.append(
                f"Develop {skill} through online courses or projects"
            )
    
    # Industry tools
    missing_tools = [
        tool for tool in career_data["tools"]
        if not any(nlp(tool).similarity(nlp(cv_skill)) > 0.7 for cv_skill in cv_skills)
    ]
    if missing_tools:
        improvements.append(
            f"Learn industry tools: {', '.join(missing_tools[:3])}"
        )
    
    return improvements[:3]  # Return top 3 suggestions

def calculate_career_scores(student_data: StudentData, cv_skills: List[str]) -> Dict[str, float]:
    """Calculate scores for all career paths"""
    # Flatten all subjects with grades and credits
    all_subjects = []
    for year in student_data.resultsByYear:
        for subject in year.subjects:
            all_subjects.append({
                "name": subject.subject_name,
                "grade": subject.grade,
                "credit": get_credit(subject.subject_code)
            })
    
    career_scores = {}
    
    for career, data in CAREER_PATHS.items():
        # Academic Score (weighted by credit)
        academic_score = 0
        total_credit = 0
        
        for subject in data["related_subjects"]:
            for s in all_subjects:
                if subject.lower() in s["name"].lower():
                    academic_score += grade_to_score(s["grade"]) * s["credit"]
                    total_credit += s["credit"]
        
        academic_score = (academic_score / (total_credit * 4)) if total_credit > 0 else 0  # Normalize to 0-1
        
        # Skill Match Score
        career_skills = " ".join(data["required_skills"].keys())
        cv_text = " ".join(cv_skills)
        
        if not cv_text:
            skill_score = 0
        else:
            doc1 = nlp(career_skills)
            doc2 = nlp(cv_text)
            skill_score = doc1.similarity(doc2)
        
        # Combined Score (60% academic, 40% skills)
        combined_score = 0.6 * academic_score + 0.4 * skill_score
        career_scores[career] = round(combined_score * 100, 2)  # Convert to percentage
    
    return career_scores

# ================== API Endpoint ==================
@app.post("/recommend")
async def get_recommendations(student_data: StudentData):
    cv_skills = extract_skills(student_data.cv_text)
    scores = calculate_career_scores(student_data, cv_skills)
    
    # Get top 5 careers with additional data
    top_careers = []
    for career, score in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:5]:
        top_careers.append({
            "career": career,
            "score": score,
            "strengths": identify_strengths(career, cv_skills),
            "suggested_improvements": generate_improvements(career, cv_skills),
            "academic_fit": f"{score * 0.6:.1f}%",  # 60% of score comes from academics
            "skill_fit": f"{score * 0.4:.1f}%"     # 40% from skills
        })
    
    return {
        "top_recommendations": top_careers,
        "skill_analysis": {
            "identified_skills": cv_skills,
            "strongest_skills": sorted(
                cv_skills,
                key=lambda x: max(
                    nlp(x).similarity(nlp(skill))
                    for career in CAREER_PATHS.values()
                    for skill in career["required_skills"]
                ),
                reverse=True
            )[:5]  # Top 5 most valuable skills across all careers
        }
    }