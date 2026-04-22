// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// Open IndexedDB
let db;
let request = indexedDB.open("studentDB", 1);

request.onupgradeneeded = function(e) {
  db = e.target.result;

  let users = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
  let students = db.createObjectStore("students", { keyPath: "id", autoIncrement: true });

  students.createIndex("user_id", "user_id");
};

request.onsuccess = function(e) {
  db = e.target.result;

  // Default user (for JOIN)
  let tx = db.transaction("users", "readwrite");
  let store = tx.objectStore("users");
  store.add({ name: "Admin" });
};

// INSERT
function addStudent() {
  let name = document.getElementById("name").value;
  let cls = document.getElementById("class").value;

  let tx = db.transaction("students", "readwrite");
  let store = tx.objectStore("students");

  store.add({
    name: name,
    class: cls,
    user_id: 1
  });

  alert("Student Added!");
}

// SELECT + JOIN
function showData() {
  let output = document.getElementById("output");
  output.innerHTML = "";

  let tx = db.transaction(["students", "users"], "readonly");

  let studentStore = tx.objectStore("students");
  let userStore = tx.objectStore("users");

  studentStore.openCursor().onsuccess = function(e) {
    let cursor = e.target.result;

    if (cursor) {
      let student = cursor.value;

      // JOIN
      let userReq = userStore.get(student.user_id);

      userReq.onsuccess = function() {
        let user = userReq.result;

        output.innerHTML += `
          <p>${student.name} (${student.class}) - User: ${user.name}</p>
        `;
      };

      cursor.continue();
    }
  };
}