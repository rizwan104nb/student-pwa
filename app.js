// SW
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// INSTALL
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn").onclick = () => {
  deferredPrompt.prompt();
};

// USER DISPLAY (LOGIN SIMULATION)
document.getElementById("userBox").innerText =
  "Logged in as: " + localStorage.getItem("user");

// DATA
let students = JSON.parse(localStorage.getItem("students")) || [];

// SAVE
function save(){
  localStorage.setItem("students", JSON.stringify(students));
}

// ADD
function addStudent(){
  students.push({
    name: name.value,
    class: class.value,
    user: localStorage.getItem("user")
  });

  save();
  showStudents();
}

// SHOW
function showStudents(){
  output.innerHTML = "";

  students.forEach((s,i)=>{
    output.innerHTML += `
      <p>
        ${s.name} - ${s.class} (User: ${s.user})

        <button onclick="editStudent(${i})">Edit</button>
        <button onclick="deleteStudent(${i})">Delete</button>
      </p>
    `;
  });
}

// DELETE
function deleteStudent(i){
  students.splice(i,1);
  save();
  showStudents();
}

// EDIT
function editStudent(i){
  let n = prompt("Name", students[i].name);
  let c = prompt("Class", students[i].class);

  students[i].name = n;
  students[i].class = c;

  save();
  showStudents();
}

// INIT
showStudents();
