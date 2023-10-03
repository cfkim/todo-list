// --------NEW VANILLA JAVASCRIPT CODE--------- //
document.addEventListener('DOMContentLoaded', function() {
    var addButton = document.getElementById('addButton');
    var deleteButton = document.getElementById('deleteButton');
    var doneButton = document.getElementById('doneButton');
    var taskInput = document.getElementById('taskInput');
    // var responseMessage = document.getElementById('responseMessage');
    var todo_list = document.getElementById('todo_list');
    var displayLength = 0;

    // add event listener to add button
    addButton.addEventListener('click', function() {
        var userInput = taskInput.value;

        // javascript object
        var dataToSend = {
            'task': userInput
        };

        if (userInput !== undefined && userInput.trim().length != 0) {
            taskInput.value = "";
            // using native browser API with fetch command
            fetch('/todo', {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(dataToSend)
            }) // returns a promise object, ensures that asynchronous actions can be performed
            .then(function(response){
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(response){
                var todoList = response.list; // the updated list returned from server
                console.log("HERE")
                console.log(todoList)
                for(var i = displayLength; i < todoList.length; i++){
                    var task = todoList[i]
                    var listItem = document.createElement('li');
                    listItem.setAttribute('task-id', task[1]);
                    listItem.classList.add('taskItem'); // adds class to list item element
                    listItem.textContent = task[0];

                    listItem.addEventListener('click', function(){
                        console.log('task clicked');
                        console.log(this.getAttribute('task-id'));
                        if (this.classList.contains('selected')){
                            this.classList.remove('selected');
                        }else{
                            var selectedTasks = document.querySelectorAll('.taskItem.selected')
                            for(var i = 0; i < selectedTasks.length; i++){
                                selectedTasks[i].classList.remove('selected');
                            }
                            this.classList.add('selected');

                        }

                        console.log(this.classList)
                    });

                    // add the dynamically created listItem to the todo_list element in HTML
                    todo_list.appendChild(listItem);
                    console.log(todo_list);
                    // saves the updated list of tasks to local storage
                    console.log('locally adding:')
                    // console.log(todoList)
                    tasks = todoList;
                    // console.log(tasks)
                    saveTasks(tasks);
                }

                displayLength = todoList.length;

            })
            .catch(function(error){
                console.error('Error: ', error);
            });
        }
    });

    deleteButton.addEventListener('click', function() {
        // grabs the currently highlighted task
        selectedTask = document.querySelector('.taskItem.selected');
        console.log(selectedTask)
        taskId = selectedTask.getAttribute('task-id')

        if(taskId !== undefined) {
            console.log("delete");
            console.log(taskId);

            // deletes the task w specified ID. Handles duplicate task name cases.
            var dataToSend = {
                'deleteTask': taskId
            };

            fetch('/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(response) {
                console.log(response);
                displayLength--;
                // remove task from local storage
                console.log('removed tasks');
                // console.log(taskId);
                var new_tasks = response.updated_list;
                // console.log(new_tasks);
                saveTasks(new_tasks);
            })
            .catch(function(error){
                console.error("Error: ", error);
            });

            selectedTask.remove();
        }
    });

    doneButton.addEventListener('click', function() {
        var selectedTask = document.querySelector('.taskItem.selected');
        var taskId = selectedTask.getAttribute('task-id');

        if(taskId != undefined) {
            if(selectedTask.classList.contains('complete')){
                console.log("undo complete");
                selectedTask.classList.remove('complete');
            }else{
                console.log('task done');
                console.log(taskId);
                selectedTask.classList.add('complete');
            }

            // update backend
            var dataToSend = {
                'completeTask': taskId
            };

            fetch('/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(response) {
                console.log('marked task complete. Updated list, below')
                console.log(response)
                var new_tasks = response.updated_list;
                // update task list in the local storage. Don't know if this is necessary.
                saveTasks(new_tasks);
            })
            .catch(function(error){
                console.error("Error: ", error);
            });
        }
    });

    // --------ADDING PERSISTENCE--------- //
    // Function to load tasks from Local Storage
    function loadTasks() {
        console.log('loaded tasks')
        const tasksJSON = localStorage.getItem('tasks');
        if (tasksJSON) {
            return JSON.parse(tasksJSON);
        }
        return;
    }

    // Function to save tasks to Local Storage
    function saveTasks(tasks) {
        console.log('saved Task')
        console.log(tasks)
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Handle Page Refresh
    // arrow function used for brevity
    window.addEventListener('load', () => {
        tasks = loadTasks();
        console.log(tasks)
        console.log('refresh')
        if(tasks != undefined){
            if(tasks.length != 0){
                displayLength = tasks.length;
                console.log('here')
                // send loaded tasks back to backend
                var dataToSend = {
                    'loaded_tasks': tasks
                };

                // using native browser API with fetch command
                fetch('/refresh', {
                    method: 'POST',
                    headers:{
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                }) // returns a promise object, ensures that asynchronous actions can be performed
                .then(function(response){
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(function(response){
                    // Populate your task list UI with the tasks from 'tasks' array
                    console.log(response.list)
                    for(var i = 0; i < tasks.length; i++){
                        var task = tasks[i];
                        var listItem = document.createElement('li');
                        listItem.setAttribute('task-id', task[1]);
                        listItem.classList.add('taskItem'); // adds class to list item element
                        listItem.textContent = task[0];
                        // persistence with completion marking
                        if(task[2] == 1){
                            listItem.classList.add('complete');
                        }

                        listItem.addEventListener('click', function(){
                            console.log('task clicked');
                            console.log(this.getAttribute('task-id'));
                            if (this.classList.contains('selected')){
                                this.classList.remove('selected');
                            }else{
                                var selectedTasks = document.querySelectorAll('.taskItem.selected')
                                for(var i = 0; i < selectedTasks.length; i++){
                                    selectedTasks[i].classList.remove('selected');
                                }
                                this.classList.add('selected');

                            }

                            // console.log(this.classList)
                        });

                        todo_list.append(listItem);
                    }
                })
                .catch(function(error){
                    console.error('Error: ', error);
                });
            }
        }

    });
});


// --------OLD JQUERY CODE--------- //
/**
var displayLength = 0;
$(document).ready(function() {
    $('#addButton').click(function() {
        var userInput = $('#taskInput').val();

        var dataToSend = {
            'task': userInput
        };

        if (userInput !== undefined && userInput.trim().length != 0) {
            document.getElementById("taskInput").value = "";

            $.ajax({
                url: '/todo',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataToSend),

                success: function(response) {
                    $('#responseMessage').text(response.message);

                    console.log(response);

                    var todoList = response.list;
                    var targetList = $('#todo_list');

                    for (var i = displayLength; i < todoList.length; i++) {
                        var task = todoList[i];

                        var listItem = $('<li>')
                            .attr('data-task-id', task[1])
                            .addClass('taskItem')
                            .text(task[0]);
                        targetList.append(listItem);

                        listItem.click(function() {
                            console.log('Task clicked');
                            if ($(this).hasClass('selected')){
                                $(this).removeClass('selected');
                            }else{

                                $('.taskItem').removeClass('selected');
                                console.log(this);
                                $(this).addClass('selected');

                            }
                        });
                    }

                    displayLength = todoList.length;

                },

                error: function(error) {
                    console.error('Error:', error);
                }
            });
        }
    });

    $('#deleteButton').click(function() {
        var selectedTask = $('.taskItem.selected');
        var taskId = selectedTask.data('task-id');
        if (taskId !== undefined) {
            console.log("delete");
            console.log(taskId);

            var dataToSend = {
                'deleteTask': taskId
            };

            $.ajax({
                url: '/delete',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataToSend),

                success: function(response) {
                    console.log(response);
                    displayLength--;
                },

                error: function(error) {
                    console.error('Error:', error);
                }
            });

            selectedTask.remove();
        }
    });

    $('#doneButton').click(function() {

        var selectedTask = $('.taskItem.selected');
        var taskId = selectedTask.data('task-id');

        if (taskId !== undefined) {
            if (selectedTask.hasClass('complete')) {
                console.log('undo marked complete');
                selectedTask.removeClass('complete');
            }else{
                console.log('task done');
                console.log(taskId);
                selectedTask.addClass('complete');
            }

        }
    });
});

**/