FROM python:3.10-slim-buster

WORKDIR /flask-todo-list-app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY src .

CMD ["python3", "-m", "flask", "run"]
