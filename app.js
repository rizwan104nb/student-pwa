if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// SHOW USER (JOIN concept)
let currentUser = localStorage.getItem("user");

if(!currentUser){
  window.location.href = "login.html";
}

document.getElementById("userBox").innerText =
  "Logged in as: " + currentUser;

// DATA
let students = JSON.parse(localStorage.getItem("students")) || [];

// SAVE
function save(){
  localStorage.setItem("students", JSON.stringify(students));
}

// ADD (JOIN USER + STUDENT)
function addStudent(){
  let name = document.getElementById("name").value;
  let cls = document.getElementById("class").value;

  students.push({
    name: name,
    class: cls,
    user: currentUser   // 🔥 JOIN HERE
  });

  save();
  showStudents();
}

// SHOW
function showStudents(){
  let output = document.getElementById("output");
  output.innerHTML = "";

  students.forEach((s,i)=>{
    output.innerHTML += `
      <p>
        ${s.name} - ${s.class} | User: ${s.user}

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
