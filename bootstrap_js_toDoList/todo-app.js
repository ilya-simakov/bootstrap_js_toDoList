(function () {
    let listArr = [];
    let userName = "list";

    function createAppTitle(title) {
        let appTitle = document.createElement("h2");
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement("form");
        let input = document.createElement("input");
        let buttonWrapper = document.createElement("div");
        let button = document.createElement("button");

        form.classList.add("input-group", "mb-3");
        input.classList.add("form-control");
        input.placeholder = "New Task";
        buttonWrapper.classList.add("input-group-append");
        button.classList.add("btn", "btn-primary");
        button.textContent = "Add Task";

        button.disabled = true;

        input.addEventListener('input', () => {
            if (input.value !== "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement("ul");
        list.classList.add("list-group");
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement("li");
        let buttonGroup = document.createElement("div");
        let doneButton = document.createElement("button");
        let deleteButton = document.createElement("button");

        item.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        );
        item.textContent = obj.name;

        buttonGroup.classList.add("btn-group", "btn-group-sm");
        doneButton.classList.add("btn", "btn-success");
        doneButton.textContent = "Done";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.textContent = "Delete";

        if (obj.done) {
            item.classList.add("list-group-item-success");
        }

        doneButton.addEventListener("click", function () {
            obj.done = !obj.done;
            saveList(listArr, userName);
            item.classList.toggle("list-group-item-success");
        });
        deleteButton.addEventListener("click", function () {
            if (confirm("Are you sure?")) {
                for (let i = 0; i < listArr.length; i++) {
                    if (listArr[i].id == obj.id) {
                        listArr.splice(i, 1);
                        break;
                    }
                }

                saveList(listArr, userName);

                item.remove();
            }
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function getNewId(arr) {
        let max = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id > max) {
                max = arr[i].id;
            }
        }
        return max + 1
    }

    function createTodoApp(container, title = "To Do List", user) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        userName = user;

        let localData = localStorage.getItem(userName);

        if (localData !== "" && localData !== null) {
            listArr = JSON.parse(localData);
        }

        for (const newItem of listArr) {
            let todoItem = createTodoItem(newItem);
            todoList.append(todoItem.item);
        }

        todoItemForm.form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let newItem = {
                id: getNewId(listArr),
                name: todoItemForm.input.value,
                done: false
            }

            listArr.push(newItem);

            let todoItem = createTodoItem(newItem);

            todoList.append(todoItem.item);

            saveList(listArr, userName);

            todoItemForm.input.value = "";
            todoItemForm.button.disabled = true;
        });
    }

    function saveList(arr, listName) {
        localStorage.setItem(listName, JSON.stringify(arr));
    }

    window.createTodoApp = createTodoApp;
})();
