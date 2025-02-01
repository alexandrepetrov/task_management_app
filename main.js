const fs = require('fs');
const readline = require('readline');

// Класс для представления задачи
class Task {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.completed = false;
    }

    markAsCompleted() {
        this.completed = true;
    }

    toString() {
        return `${this.title} - ${this.description} [${this.completed ? 'Выполнено' : 'Не выполнено'}]`;
    }
}

// Класс для управления списком задач
class TaskList {
    constructor() {
        this.tasks = [];
    }

    addTask(title, description) {
        const task = new Task(title, description);
        this.tasks.push(task);
    }

    deleteTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
        } else {
            console.log('Неверный индекс задачи.');
        }
    }

    markTaskAsCompleted(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks[index].markAsCompleted();
        } else {
            console.log('Неверный индекс задачи.');
        }
    }

    showTasks(showCompleted = true) {
        this.tasks.forEach((task, index) => {
            if (showCompleted || !task.completed) {
                console.log(`${index}: ${task.toString()}`);
            }
        });
    }

    saveToFile(filename) {
        fs.writeFileSync(filename, JSON.stringify(this.tasks, null, 2));
        console.log(`Список задач сохранен в файл: ${filename}`);
    }

    loadFromFile(filename) {
        if (fs.existsSync(filename)) {
            const data = fs.readFileSync(filename, 'utf8');
            this.tasks = JSON.parse(data).map(taskData => {
                const task = new Task(taskData.title, taskData.description);
                task.completed = taskData.completed;
                return task;
            });
            console.log(`Список задач загружен из файла: ${filename}`);
        } else {
            console.log('Файл не найден.');
        }
    }
}

// Интерфейс командной строки
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const taskList = new TaskList();

function displayMenu() {
    console.log('\nМеню:');
    console.log('1. Добавить задачу');
    console.log('2. Удалить задачу');
    console.log('3. Показать все задачи');
    console.log('4. Показать выполненные задачи');
    console.log('5. Отметить задачу как выполненную');
    console.log('6. Сохранить задачи в файл');
    console.log('7. Загрузить задачи из файла');
    console.log('8. Выйти');
}

function handleUserInput() {
    displayMenu();
    rl.question('Выберите действие: ', (choice) => {
        switch (choice) {
            case '1':
                rl.question('Введите название задачи: ', (title) => {
                    rl.question('Введите описание задачи: ', (description) => {
                        taskList.addTask(title, description);
                        handleUserInput();
                    });
                });
                break;
            case '2':
                rl.question('Введите индекс задачи для удаления: ', (index) => {
                    taskList.deleteTask(parseInt(index));
                    handleUserInput();
                });
                break;
            case '3':
                taskList.showTasks();
                handleUserInput();
                break;
            case '4':
                taskList.showTasks(false);
                handleUserInput();
                break;
            case '5':
                rl.question('Введите индекс задачи для отметки как выполненной: ', (index) => {
                    taskList.markTaskAsCompleted(parseInt(index));
                    handleUserInput();
                });
                break;
            case '6':
                rl.question('Введите имя файла для сохранения: ', (filename) => {
                    taskList.saveToFile(filename);
                    handleUserInput();
                });
                break;
            case '7':
                rl.question('Введите имя файла для загрузки: ', (filename) => {
                    taskList.loadFromFile(filename);
                    handleUserInput();
                });
                break;
            case '8':
                rl.close();
                break;
            default:
                console.log('Неверный выбор. Попробуйте снова.');
                handleUserInput();
        }
    });
}

// Запуск приложения
handleUserInput();
