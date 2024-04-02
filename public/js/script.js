// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('attendance-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const checkboxes = document.querySelectorAll('.absent-checkbox:checked');
      const absentStudentIds = Array.from(checkboxes).map(checkbox => checkbox.dataset.studentId);
      //console.log(absentStudentIds);
      try {
        const response = await fetch('/logAttendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ absentStudentIds })
        });
  
        if (response.ok) {
          alert('Attendance logged successfully');
          window.location.reload();
        } else {
          console.error('Failed to log attendance');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  