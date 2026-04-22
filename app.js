// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// INSTALL BUTTON
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn").addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt = null;
  }
});

// LOAD DATA
let students = JSON.parse(localStorage.getItem("students")) || [];

// SAVE DATA
function save() {
  localStorage.setItem("students", JSON.stringify(students));
}

// ADD STUDENT
function addStudent() {
  let name = document.getElementById("name").value;
  let cls = document.getElementById("class").value;

  if (!name || !cls) {
    alert("Please fill all fields");
    return;
  }

  students.push({
    name: name,
    class: cls,
    user_id: 1
  });

  save();
  showStudents();
}

// SHOW STUDENTS
function showStudents() {
  let output = document.getElementById("output");
  output.innerHTML = "";

  students = JSON.parse(localStorage.getItem("students")) || [];

  students.forEach((s, i) => {
    output.innerHTML += `
      <p>
        ${s.name} - ${s.class}

        <button onclick="editStudent(${i})">Edit</button>
        <button onclick="deleteStudent(${i})">Delete</button>
      </p>
    `;
  });
}

// DELETE
function deleteStudent(i) {
  students.splice(i, 1);
  save();
  showStudents();
}

// EDIT
function editStudent(i) {
  let newName = prompt("Enter new name", students[i].name);
  let newClass = prompt("Enter new class", students[i].class);

  if (newName && newClass) {
    students[i].name = newName;
    students[i].class = newClass;

    save();
    showStudents();
  }
}

// AUTO LOAD
showStudents();
