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
            console.log('task done');
            console.log(taskId);
            selectedTask.addClass('complete');
        }
    });
});

