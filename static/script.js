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
                var todoList = response.list; // the list returned from server
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