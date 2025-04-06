const db = require("../config/database");

exports.getStudentResultsByYear = async (student_id) => {
  // Validate student_id format
  if (!student_id || !student_id.startsWith("SC/2021/")) {
    throw new Error("Invalid student ID format");
  }

  // Execute raw SQL query
  const results = await db.query(
    `
      SELECT 
        r.student_id,
        r.grade,
        s.subject_code,
        s.subject_name,
        s.is_core
      FROM results_new r
      JOIN courses s ON r.subject_code = s.subject_code
      WHERE r.student_id = ?
      ORDER BY s.subject_code ASC
    `,
    {
      replacements: [student_id],
      type: db.QueryTypes.SELECT,
    }
  );

  if (!results || results.length === 0) {
    throw new Error("No results found for this student");
  }

  // Group results by year (extracted from subject code)
  const yearWiseResults = results.reduce((acc, result) => {
    // Extract year from subject code (first digit after CSC)
    const year = parseInt(result.subject_code.match(/CSC(\d)/)?.[1] || 1);

    if (!acc[year]) {
      acc[year] = {
        year,
        subjects: [],
      };
    }

    acc[year].subjects.push({
      subject_code: result.subject_code,
      subject_name: result.subject_name,
      is_core: result.is_core,
      grade: result.grade,
    });

    return acc;
  }, {});

  // Convert to array and sort by year
  return Object.values(yearWiseResults).sort((a, b) => a.year - b.year);
};
