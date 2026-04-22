
// =====================
// SERVICE WORKER
// =====================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("SW Registered"))
    .catch(err => console.log("SW Error", err));
}

// =====================
// INSTALL BUTTON
// =====================
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn").addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt = null;
  }
});

// =====================
// LOGIN SIMULATION (JOIN concept)
// =====================
let currentUser = localStorage.getItem("user");

if (!currentUser) {
  currentUser = prompt("Enter username:");
  localStorage.setItem("user", currentUser);
}

document.getElementById("userBox").innerText =
  "Logged in as: " + currentUser;

// =====================
// DATABASE (localStorage)
// =====================
let students = JSON.parse(localStorage.getItem("students")) || [];

// =====================
// SAVE FUNCTION
// =====================
function save() {
  localStorage.setItem("students", JSON.stringify(students));
}

// =====================
// ADD STUDENT (CREATE)
// =====================
function addStudent() {
  let name = document.getElementById("name").value;
  let cls = document.getElementById("class").value;

  if (!name || !cls) {
    alert("Fill all fields");
    return;
  }

  students.push({
    name: name,
    class: cls,
    user: currentUser   // JOIN concept
  });

  save();
  showStudents();
}

// =====================
// SHOW STUDENTS (READ)
// =====================
function showStudents() {
  let output = document.getElementById("output");
  output.innerHTML = "";

  students.forEach((s, i) => {
    output.innerHTML += `
      <p>
        ${s.name} - ${s.class} | User: ${s.user}

        <button onclick="editStudent(${i})">Edit</button>
        <button onclick="deleteStudent(${i})">Delete</button>
      </p>
    `;
  });
}

// =====================
// DELETE (DELETE)
// =====================
function deleteStudent(i) {
  students.splice(i, 1);
  save();
  showStudents();
}

// =====================
// EDIT (UPDATE)
// =====================
function editStudent(i) {
  let newName = prompt("New Name", students[i].name);
  let newClass = prompt("New Class", students[i].class);

  if (newName && newClass) {
    students[i].name = newName;
    students[i].class = newClass;

    save();
    showStudents();
  }
}

// =====================
// INIT LOAD
// =====================
showStudents();
