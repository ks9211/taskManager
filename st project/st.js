
document.addEventListener("DOMContentLoaded", () => {
    
    const taskInput = document.querySelector(".task-input");
    const taskDueDate = document.querySelector(".task-due-date");
    const taskCategory = document.querySelector(".task-category-select");
    const taskList = document.querySelector(".task-list");
    const filterTask = document.querySelector(".filter-task");
    const dateInput = document.querySelector(".date-input");
    const dateFilterButton = document.querySelector(".date-filter-button");
    const sortButton = document.querySelector(".sort-button");


    const sortCategoryButton = document.querySelector(".sort-category-button");

sortCategoryButton.addEventListener("click", () => {
    sortTasksByCategory();
});

    sortButton.addEventListener("click", () => {
        sortTasksByDueDate();
    });
    
    let tasks = [];

    // Check local storage for saved tasks
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
        displayTasks();
    }

    // Add task to list
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const dueDate = taskDueDate.value;
        const category = taskCategory.value;

        if (taskText !== "") {
            tasks.push({ text: taskText, completed: false, dueDate, category });
            updateLocalStorage();
            taskInput.value = "";
            taskDueDate.value = "";
            taskCategory.value = "work";
            displayTasks();
        }
    });


    function searchTasks(searchText) {
        const filteredTasks = tasks.filter(task => {
            const taskText = task.text.toLowerCase();
            return taskText.includes(searchText.toLowerCase());
        });
        displayFilteredTasks(filteredTasks);
    }

    // Display tasks
    function displayTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskElement = createTaskElement(task, index);
            taskList.appendChild(taskElement);
        });
    }

    // Create task element
    function createTaskElement(task, index) {
        const taskElement = document.createElement("li");
        taskElement.classList.add("task");
        if (task.completed) {
            taskElement.classList.add("completed");
        }
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        const timeDifference = dueDate.getTime() - today.getTime();
        const daysLeft = Math.max(Math.ceil(timeDifference / (1000 * 3600 * 24)),0);    
    const formattedDueDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, "0")}-${dueDate.getDate().toString().padStart(2, "0")}`;


    const taskItemHTML = `
            <div class="task-item">
                <span class="task-text">${task.text}</span>
                <span class="task-date">Due Date: ${formattedDueDate}</span>
                <span class="task-days-left">${daysLeft} days left</span>
                <span class="task-category">${task.category}</span>
            </div>
        `;
        taskElement.innerHTML = `
            <div class="task-item">
                <span class="task-text">${task.text}</span>
                <span class="task-date">Due Date: ${formattedDueDate}</span>
                <span class="task-days-left">${daysLeft} days left</span>
                <span class="task-category">Category: ${task.category}</span>
            </div>
            <div class="task-buttons">
                <button class="complete-btn" data-index="${index}">
                    <i class="fas fa-check-circle"></i>
                </button>
                <button class="edit-btn" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="trash-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return taskElement;
    }

    function sortTasksByDueDate() {
        tasks.sort((a, b) => {
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
            return dateA - dateB;
        });

        updateLocalStorage();
        displayTasks();
    }



    function sortTasksByCategory() {
        tasks.sort((a, b) => {
            return b.category.localeCompare(a.category);
        });
    
        updateLocalStorage();
        displayTasks();
    }

    


    document.querySelector(".task-list").addEventListener("click", (e) => {
        if (e.target.classList.contains("complete-btn")) {
            const index = e.target.getAttribute("data-index");
            tasks[index].completed = !tasks[index].completed;
            updateLocalStorage();
            displayTasks();
        } else if (e.target.classList.contains("trash-btn")) {
            const index = e.target.getAttribute("data-index");
            tasks.splice(index, 1);
            updateLocalStorage();
            displayTasks();
        } 
    });
    

    document.querySelector(".task-list").addEventListener("click", (e) => {
        const editButton = e.target.closest(".edit-btn");
    
        if (editButton) {
            const index = editButton.getAttribute("data-index");
            const taskElement = editButton.closest(".task");
            const taskTextElement = taskElement.querySelector(".task-text");
            const taskDateElement = taskElement.querySelector(".task-date");
            const taskCategoryElement = taskElement.querySelector(".task-category");
    
            const originalText = taskTextElement.textContent;
            const originalDate = taskDateElement.textContent;
            const originalCategory = taskCategoryElement.value;
    
            taskTextElement.setAttribute("contenteditable", "true");
            taskDateElement.setAttribute("contenteditable", "true");
            taskCategoryElement.disabled = false;
            taskTextElement.focus();
    
            editButton.style.display = "none";
    
            const saveButton = document.createElement("button");
            saveButton.innerHTML = '<i class="fas fa-save"></i>';
            saveButton.classList.add("save-btn");
            taskElement.querySelector(".task-buttons").appendChild(saveButton);
    
            saveButton.addEventListener("click", () => {
                const editedText = taskTextElement.textContent.trim();
                const editedDate = taskDateElement.textContent.trim();
                const editedCategory = taskCategoryElement.value;
    
                if (
                    editedText !== originalText ||
                    editedDate !== originalDate ||
                    editedCategory !== originalCategory
                ) {
                    tasks[index].text = editedText;
                    tasks[index].dueDate = editedDate;
                    if (editedCategory !== originalCategory) {
                        tasks[index].category = editedCategory;
                    }
                    updateLocalStorage();
                }
    
                taskTextElement.removeAttribute("contenteditable");
                taskDateElement.removeAttribute("contenteditable");
                taskCategoryElement.disabled = true;
                editButton.style.display = "block";
                saveButton.remove();
    
                displayTasks();
            });
        }
    });
    

    const searchBar = document.querySelector(".todo-input");

searchBar.addEventListener("input", () => {
    const searchText = searchBar.value;
    searchTasks(searchText);
});
    
    
    


    // Update local storage
    function updateLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Filter tasks
    filterTask.addEventListener("change", () => {
        const filterValue = filterTask.value;
        if (filterValue === "date") {
            dateInput.style.display = "inline-block";
            dateFilterButton.style.display = "inline-block";
        } else {
            dateInput.style.display = "none";
            dateFilterButton.style.display = "none";
            filterTasks();
        }
    });

    dateFilterButton.addEventListener("click", () => {
        filterTasks();
    });

    function filterTasks() {
        const filterValue = filterTask.value;
        const dateValue = dateInput.value;
        
        let filteredTasks = tasks;

        if (filterValue === "completed") {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filterValue === "incompleted") {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        if (dateValue !== "") {
            filteredTasks = filteredTasks.filter(task => task.dueDate === dateValue);
        }

        displayFilteredTasks(filteredTasks);
    }

    function displayFilteredTasks(filteredTasks) {
    taskList.innerHTML = "";
    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement("li");
        taskElement.classList.add("task");
        if (task.completed) {
            taskElement.classList.add("completed");
        }
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        const timeDifference = dueDate.getTime() - today.getTime();
        const daysLeft = Math.max(Math.ceil(timeDifference / (1000 * 3600 * 24)), 0);
        const formattedDueDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, "0")}-${dueDate.getDate().toString().padStart(2, "0")}`;
        taskElement.innerHTML = `
            <div class="task-item">
                <span class="task-text">${task.text}</span>
                <span class="task-date">Due Date: ${formattedDueDate}</span>
                <span class="task-days-left">${daysLeft} days left</span>
                <span class="task-category">Category: ${task.category}</span>
            </div>
            <div class="task-buttons">
                <button class="complete-btn" data-index="${index}">
                    <i class="fas fa-check-circle"></i>
                </button>
                <button class="edit-btn" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="trash-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}




});


function updateDigitalClock() {
    const clockElement = document.getElementById("digital-clock");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the clock every second
setInterval(updateDigitalClock, 1000);

// Call the function initially to display the clock immediately
updateDigitalClock();
