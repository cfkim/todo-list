# This is a sample Python script.

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)  # make a flask object with name of current module

@app.route("/")
def index():
    tasks.clear()
    return render_template('index.html')

tasks = []  # create a task list that will be manipulated by add tasks and delete task

def add_task(task):

    tasks.append(task)
    return tasks

@app.route("/delete", methods=['POST'])
def delete():
    try:
        data = request.json  # add task to the list of tasks
        task_to_delete = data.get('deleteTask')
        tasks.remove(task_to_delete)

        print("Updated tasks:", tasks)

        response = {'updated list': tasks}
        return jsonify(response)

    except Exception as e:
        error_response = {'message': f'Error: {str(e)}'}
        return jsonify(error_response)

@app.route("/todo", methods=['POST'])
def todo():
    # Use a breakpoint in the code line below to debug your script.
    try:
        data = request.json  # add task to the list of tasks
        user_text = data.get('task')

        newList = add_task(user_text)  # send this new list to js to update the page

        response = {'list': newList}
        return jsonify(response)
    except Exception as e:
        error_response = {'message': f'Error: {str(e)}'}
        return jsonify(error_response)

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    app.run(debug=True)
# See PyCharm help at https://www.jetbrains.com/help/pycharm/

