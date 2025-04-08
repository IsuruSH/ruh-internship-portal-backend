// utils/statusCalculator.js
exports.calculateStatusPercentages = (students) => {
  const statusCounts = {
    application_submitted: 0,
    interview_invitation: 0,
    interview_completed: 0,
    selection_decision: 0,
    internship_started: 0,
    internship_completed: 0,
    no_status: 0, // For students with no status
  };

  students.forEach((student) => {
    const latestStatus = student.InternshipStatuses?.[0]?.status;
    if (latestStatus && statusCounts.hasOwnProperty(latestStatus)) {
      statusCounts[latestStatus]++;
    } else {
      statusCounts.no_status++;
    }
  });

  const totalStudents = students.length;
  const percentages = {};

  Object.entries(statusCounts).forEach(([status, count]) => {
    percentages[status] =
      totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
  });

  return percentages;
};
