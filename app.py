from flask import Flask, render_template, request, redirect, session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'secret123'

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="student_pwa"
    )

# 🔐 REGISTER
@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
        conn.commit()
        conn.close()

        return redirect('/login')

    return render_template('register.html')


# 🔐 LOGIN
@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()
        conn.close()

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            return redirect('/')
        else:
            return "Login Failed"

    return render_template('login.html')


# 🚪 LOGOUT
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')


# 🏠 HOME (SELECT + JOIN)
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect('/login')

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT students.id, students.name, students.class, users.username
    FROM students
    JOIN users ON students.user_id = users.id
    """)

    data = cursor.fetchall()
    conn.close()
    return render_template('index.html', data=data)


# ➕ ADD
@app.route('/add', methods=['GET','POST'])
def add():
    if 'user_id' not in session:
        return redirect('/login')

    if request.method == 'POST':
        name = request.form['name']
        student_class = request.form['class']
        user_id = session.get('user_id')

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO students (name, class, user_id) VALUES (%s, %s, %s)",
            (name, student_class, user_id)
        )
        conn.commit()
        conn.close()

        return redirect('/')

    return render_template('add.html')


# ❌ DELETE
@app.route('/delete/<int:id>')
def delete(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM students WHERE id=%s", (id,))
    conn.commit()
    conn.close()
    return redirect('/')


# ✏️ UPDATE
@app.route('/edit/<int:id>', methods=['GET','POST'])
def edit(id):
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'POST':
        name = request.form['name']
        student_class = request.form['class']

        cursor.execute("UPDATE students SET name=%s, class=%s WHERE id=%s", (name, student_class, id))
        conn.commit()
        conn.close()
        return redirect('/')

    cursor.execute("SELECT * FROM students WHERE id=%s", (id,))
    student = cursor.fetchone()
    conn.close()

    return render_template('edit.html', student=student)


if __name__ == '__main__':
    app.run(debug=True)