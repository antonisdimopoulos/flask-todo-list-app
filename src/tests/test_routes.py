from api import app

client = app.test_client()

def test_get_tasks():
    response = client.get('/api/v1/tasks')

    assert response.status_code == 200

def test_patch_inexistent():
    response = client.patch('/api/v1/tasks/invalid-uuid', json={})

    assert response.status_code == 404
