document.addEventListener('DOMContentLoaded', function() {
    var addButton = document.getElementById('addButton');
    var deleteButton = document.getElementById('deleteButton');
    var doneButton = document.getElementById('doneButton');
    var taskInput = document.getElementById('taskInput');
    var dateInput = document.getElementById('dateInput');
    // var responseMessage = document.getElementById('responseMessage');
    var todo_list = document.getElementById('todo_list');

    // timer related buttons
    var timerButton = document.getElementById('timer');
    var pauseButton = document.getElementById('pause');
    var resetButton = document.getElementById('reset');

    var displayLength = 0;

    // timer variables
    var timerInterval = null; // Initialize a variable to store the timer interval
    var timer = 5; // Initial timer value in seconds
    var isPaused = false; // Flag to track whether the timer is paused
    var pausedTime = timer; // the time when it was paused TODO did not finish trying to fix this

    // pauses the timer
    pauseButton.addEventListener('click', function() {
        if (timerInterval !== null){
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            pausedTime = timer;
            console.log('timer paused');
        }
    });

    function reset(){
        console.log(timerInterval);
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = false;
        timer = 5; // Reset the timer to the initial value (1500 seconds)
        updateTimerDisplay();
    }

    // resets timer
    resetButton.addEventListener('click', reset);

    // separate function so that multiple functions can update the time without redundant code
    function updateTimerDisplay(){
        const timerDisplay = document.getElementById('time-left');
        const minutes = parseInt(timer / 60, 10);
        const seconds = parseInt(timer % 60, 10);
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
        timerDisplay.textContent = formattedMinutes + ":" + formattedSeconds;
    }

    // timer function
    timerButton.addEventListener('click', function() {
            isPaused = false; // Resume the timer
            console.log(timerInterval);
            console.log(isPaused);

            // will not run the function if the clock is ticking down already
            if (timerInterval == null && !isPaused) {
                // console.log("here")
                updateTimerDisplay(); // Update the display immediately
                timerInterval = setInterval(function () {
                    console.log(timerInterval);
                    updateTimerDisplay();
                    if (--timer < 0) {
                        reset();
                        var audio = new Audio("static/success-1-6297.mp3"); // add this to repo
                        audio.play();
                        const timerDisplay = document.getElementById('time-left');
                        timerDisplay.textContent = "Timer Expired!";
                    }
                }, 1000); // Update the timer every 1 second

            }
        }
    );

    // add event listener to add button
    addButton.addEventListener('click', function() {
        var userInput = taskInput.value;
        var date = dateInput.value;
        // javascript object
        var dataToSend = {
            'task': userInput,
            'date': date
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
                    listItem.setAttribute('due-date', task[3]);
                    listItem.classList.add('taskItem'); // adds class to list item element
                    listItem.textContent = task[0] + " " + task[3];


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

                    // mark if the task is past due date
                    var curr_date = new Date();
                    // get it in YYYY-MM-DD format
                    const year = curr_date.getFullYear();
                    const month = (curr_date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's zero-based
                    const day = curr_date.getDate().toString().padStart(2, '0');

                    curr_date = `${year}-${month}-${day}`;

                    console.log(curr_date)
                    if (listItem.getAttribute('due-date') != ""){
                        if (listItem.getAttribute('due-date') < curr_date){
                            listItem.classList.add('expired');
                        }
                    }

                    // add the dynamically created listItem to the todo_list element in HTML
                    todo_list.appendChild(listItem);
                    console.log(todo_list);
                    // saves the updated list of tasks to local storage
                    console.log('locally adding:')
                    // console.log(todoList)
                    // update the local window storage
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
        // console.log(selectedTask)
        taskId = selectedTask.getAttribute('task-id');

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
                // update task list in the local storage.
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
                    // Populates the webpage with the old tasks
                    console.log(response.list)
                    for(var i = 0; i < tasks.length; i++){
                        var task = tasks[i];
                        var listItem = document.createElement('li');
                        listItem.setAttribute('task-id', task[1]);
                        listItem.classList.add('taskItem'); // adds class to list item element
                        listItem.textContent = task[0] + " " + task[3];
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
