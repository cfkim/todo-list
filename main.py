import sqlite3

import flask
from flask import Flask, render_template, request, jsonify, flash, redirect
# creates Login Manager class
from flask_login import LoginManager, UserMixin, login_user
from flask import sessions
from urllib.parse import urlparse, urljoin
from forms import LoginForm

login_manager = LoginManager()

# app object created
app = Flask(__name__)
# configure app for login
login_manager.init_app(app)
# secret key for session
app.secret_key = b'934daf13ee4caaaa6d1aebd08013821642a95d93dabc982e36da62c3b6d9cba3'

# defines User model class
class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

# gets user id from session
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# referred to by log in. EXPLAIN
def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc

@app.route('/login', methods=['GET', 'POST'])
def login():
    # Here we use a class of some kind to represent and validate our
    # client-side form data. For example, WTForms is a library that will
    # handle this for us, and we use a custom LoginForm to validate.
    form = LoginForm()
    if form.validate_on_submit():
        # Login and validate the user.
        # user should be an instance of your `User` class

        # Check username and password, and perform authentication here
        username = form.username.data
        password = form.password.data

        # Implement your authentication logic here, e.g., check credentials in the database TODO

        if True:  # Replace with your authentication logic
            flash('Login successful', 'success')
            return redirect('/')  # Redirect to a dashboard or another page
        else:
            flash('Login failed. Check your username and password.', 'danger')

        # next = flask.request.args.get('next')
        # url_has_allowed_host_and_scheme should check if the url is safe
        # for redirects, meaning it matches the request host.
        # See Django's url_has_allowed_host_and_scheme for an example.

        # if not is_safe_url(next):
        #    return flask.abort(400)

        # return flask.redirect(next or flask.url_for('index'))

    return flask.render_template('login.html', form=form)

@app.route("/")
def index():
    tasks.clear()
    return render_template('index.html')

# list of tasks
tasks = []
counter = 0

def add_task(task):
    global counter
    # counter represents the #th task that the user adds
    counter += 1
    # appends an array (task, task.id)
    tasks.append([task, counter, 0])
    return tasks
@app.route("/complete", methods=['POST'])
def complete():
    try:
        data = request.json
        task_to_mark = int(data.get('completeTask'))
        print(task_to_mark)
        for t in tasks:
            if t[1] == task_to_mark:
                if t[2] != 1:  # mark complete if not already marked complete
                    t[2] = 1
                else:
                    t[2] = 0  # mark incomplete if already marked complete
        response = {'updated_list': tasks}
        return jsonify(response)
    except Exception as e:
        error_response = {'message': f'Error: {str(e)}'}
        return jsonify(error_response)

@app.route("/delete", methods=['POST'])
def delete():
    # receives input from client
    try:
        data = request.json
        task_to_delete = int(data.get('deleteTask'))
        print(task_to_delete)
        # searches for task with specified ID
        for t in tasks:
            if t[1] == task_to_delete:
                tasks.remove(t)

        print("Updated tasks:", tasks)

        # returns the updated list in response object
        response = {'updated_list': tasks, 'task_to_delete': task_to_delete}
        return jsonify(response)

    except Exception as e:
        error_response = {'message': f'Error: {str(e)}'}
        return jsonify(error_response)

# wrote a separate add function that accepts a whole list
@app.route("/refresh", methods=['POST'])
def refresh():
    try:
        global tasks
        global counter
        # print(counter)
        data = request.json
        loaded = data.get('loaded_tasks')
        # print(loaded)
        tasks = loaded
        # print(tasks)
        # print(counter)
        response = {'list': tasks}
        return jsonify(response)
    except Exception as e:
        error_response = {'message': f'Error: {str(e)}'}
        return jsonify(error_response)
@app.route("/todo", methods=['POST'])
def todo():
    try:
        data = request.json
        user_text = data.get('task')

        # sends this new list to js to update the page
        newList = add_task(user_text)

        response = {'list': newList}
        return jsonify(response)
    except Exception as e:
        error_response = {'message': f'Error: {str(e)}'}
        return jsonify(error_response)

if __name__ == '__main__':
    app.run(debug=True)

