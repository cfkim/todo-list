from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

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
    # appends a tuple(task, task.id)
    tasks.append((task, counter))
    return tasks

@app.route("/delete", methods=['POST'])
def delete():
    # receives input from client
    try:
        data = request.json
        task_to_delete = data.get('deleteTask')

        # searches for task with specified ID
        for t in tasks:
            if t[1] == task_to_delete:
                tasks.remove(t)

        print("Updated tasks:", tasks)

        # returns the updated list in response object
        response = {'updated list': tasks}
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

