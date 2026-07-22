import { useState, useEffect } from "react";
import StudentAuth from "./StudentAuth";
import StudentDashboard from "./StudentDashboard";

export default function StudentPortal({ onBack }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("student_token");
    const user = localStorage.getItem("student_user");
    if (token && user) {
      setStudent(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const handleLogin = (studentData) => {
    setStudent(studentData);
  };

  const handleLogout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_user");
    setStudent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return <StudentAuth onLogin={handleLogin} onBack={onBack} />;
  }

  return <StudentDashboard student={student} onLogout={handleLogout} />;
}
