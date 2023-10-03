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

