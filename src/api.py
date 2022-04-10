from flask import Flask, request, jsonify, render_template
import uuid
import json
import errno

app = Flask(__name__)

# Global in-memory task list
tasks = []

# Task model
class Task:
    def __init__(self, title, _id=None, done=False):
        if _id is None:
            self.id = str(uuid.uuid4())
        else:
            self.id = _id
        self.title = title
        self.done = done

    def to_json(self):
        task = {
            'id': self.id,
            'title': self.title,
            'done': self.done
        }

        return task

# Util funtions
def find_task(_id):
    for task in tasks:
        if task.id == _id:
            return task

    return None

def tasks_to_json():
    tasks_json = []
    for task in tasks:
        tasks_json.append(task.to_json())

    return tasks_json


# Database funtions
def load_tasks():
    try:
        with open('tasks.json') as f:
            tasks_json = json.load(f)
            for task_json in tasks_json:
                tasks.append(Task(task_json['title'], task_json['id'], task_json['done']))

    except OSError as e:
        if e.errno == errno.ENOENT:
            pass
        else:
            raise(e)

def save_tasks():
    with open('tasks.json', 'w') as f:
        json.dump(tasks_to_json(), f, indent=4)


# Routes
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/v1/tasks')
def get_tasks():
    return jsonify(tasks_to_json())


@app.route('/api/v1/tasks', methods=['POST'])
def create_task():
    req_json = request.get_json()
    task = Task(req_json['title'])
    tasks.append(task)
    save_tasks()

    return task.to_json(), 201


@app.route('/api/v1/tasks/<string:_id>', methods=['PATCH'])
def edit_task(_id):
    req_json = request.get_json()
    task = find_task(_id)

    if task is None:
        return {}, 404

    if 'title' in req_json:
        task.title = req_json['title']

    if 'toggle_done' in request.args:
        task.done = not task.done

    save_tasks()

    return task.to_json()


# Entrypoint
def main():
    load_tasks()

    app.url_map.strict_slashes = False
    app.run()


if __name__ == '__main__':
    main()
