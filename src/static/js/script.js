const task_input_text = document.getElementById("task-input-text");
const task_input_button = document.getElementById("task-input-button");
const task_list = document.getElementById('task-list');

const generate_task_item = (id, title, done) => {
    const outer_div = document.createElement('div');
    outer_div.classList.add('input-group', 'mb-3');

    const inner_div = document.createElement('div');
    inner_div.classList.add('input-group-text');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('form-check-input', 'mt-0');

    const text = document.createElement('input');
    text.type = 'text';
    text.classList.add('form-control');
    text.id = id;


    text.value = title;
    if (done) {
        checkbox.checked = true;
    }

    text.addEventListener('input', ev => {
        fetch(`/api/v1/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                title: document.getElementById(id).value,
            }),
        });
    });

    checkbox.addEventListener('change', ev => {
        fetch(`/api/v1/tasks/${id}?toggle_done`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        })
        .then(response => {
            if (response.ok) {
                document.getElementById(id).checked = !document.getElementById(id).checked;
            }
        })
    });

    inner_div.appendChild(checkbox);
    outer_div.appendChild(inner_div);
    outer_div.appendChild(text);

    return outer_div;
}

window.onload = () => {
    task_input_button.disabled = true;
    task_input_text.focus();
    task_input_text.addEventListener('input', ev => task_input_button.disabled = task_input_text.value === '');

    fetch('/api/v1/tasks')
    .then(response => response.json())
    .then(tasks => {
        for (const task of tasks) {
            task_list.appendChild(generate_task_item(task.id, task.title, task.done));
        }
    });
}

task_input_button.addEventListener('click', ev => {
    fetch('/api/v1/tasks', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            title: task_input_text.value,
        }),
    })
    .then(response => response.json())
    .then(task => task_list.appendChild(generate_task_item(task.id, task.title, task.done)));

    task_input_text.value = '';
    task_input_button.disabled = true;
});
