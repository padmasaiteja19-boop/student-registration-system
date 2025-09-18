// Utility: Validate form inputs
function validateStudent({name, id, email, contact}) {
  let error = "";
  if (!name.trim().match(/^[a-zA-Z ]+$/)) error = "Name: Only letters & spaces allowed.";
  else if (!id.toString().match(/^\d+$/)) error = "ID: Only numbers allowed.";
  else if (!/.+@.+\..+/.test(email)) error = "Email: Invalid format.";
  else if (!contact.match(/^\d{10,}$/)) error = "Contact: At least 10 digits required.";
  return error;
}

function loadStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

function renderTable() {
  const tbody = document.querySelector("#students-table tbody");
  let students = loadStudents();
  tbody.innerHTML = "";
  students.forEach((stu, idx) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${stu.name}</td>
      <td>${stu.id}</td>
      <td>${stu.email}</td>
      <td>${stu.contact}</td>
      <td class="actions">
        <button class="edit-btn" onclick="editStudent(${idx})">Edit</button>
        <button class="delete-btn" onclick="deleteStudent(${idx})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function addStudent(data) {
  let students = loadStudents();
  students.push(data);
  saveStudents(students);
  renderTable();
}

document.getElementById("student-form").onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById("studentName").value;
  const id = document.getElementById("studentID").value;
  const email = document.getElementById("email").value;
  const contact = document.getElementById("contact").value;
  let error = validateStudent({name, id, email, contact});
  if (error) {
    document.getElementById("form-error").textContent = error;
    return;
  }
  document.getElementById("form-error").textContent = "";
  if (editIndex > -1) {
    updateStudent(editIndex, {name, id, email, contact});
    editIndex = -1;
    this.querySelector("button[type=submit]").textContent = "Add Student";
  } else {
    addStudent({name, id, email, contact});
  }
  this.reset();
};

let editIndex = -1;

window.editStudent = function(idx) {
  let students = loadStudents();
  const stu = students[idx];
  document.getElementById("studentName").value = stu.name;
  document.getElementById("studentID").value = stu.id;
  document.getElementById("email").value = stu.email;
  document.getElementById("contact").value = stu.contact;
  editIndex = idx;
  document.getElementById("student-form").querySelector("button[type=submit]").textContent = "Update Student";
}

window.updateStudent = function(idx, data) {
  let students = loadStudents();
  students[idx] = data;
  saveStudents(students);
  renderTable();
}

window.deleteStudent = function(idx) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  let students = loadStudents();
  students.splice(idx, 1);
  saveStudents(students);
  renderTable();
}

window.onload = function() {
  renderTable();
};
