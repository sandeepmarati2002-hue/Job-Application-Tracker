def test_register_success(client):
    payload = {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "password": "securepassword123",
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "jane.doe@example.com"
    assert data["user"]["name"] == "Jane Doe"


def test_register_duplicate_email(client, test_user):
    payload = {
        "name": "Another User",
        "email": test_user.email,
        "password": "somepassword123",
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_login_success(client, test_user):
    payload = {
        "email": test_user.email,
        "password": "password123",
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["id"] == test_user.id


def test_login_invalid_password(client, test_user):
    payload = {
        "email": test_user.email,
        "password": "wrongpassword",
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


def test_get_current_user_profile(client, auth_headers, test_user):
    response = client.get("/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["id"] == test_user.id
