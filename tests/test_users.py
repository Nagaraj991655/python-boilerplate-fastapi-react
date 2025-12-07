import pytest
from fastapi.testclient import TestClient
from app.core.config import settings


def test_register_user(client: TestClient):
    """Test user registration"""
    response = client.post(
        f"{settings.API_V1_STR}/users/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert data["role"] == "user"


def test_register_duplicate_email(client: TestClient, test_user):
    """Test registration with existing email"""
    response = client.post(
        f"{settings.API_V1_STR}/users/register",
        json={
            "username": "differentuser",
            "email": test_user.email,
            "password": "password123"
        }
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_register_duplicate_username(client: TestClient, test_user):
    """Test registration with existing username"""
    response = client.post(
        f"{settings.API_V1_STR}/users/register",
        json={
            "username": test_user.username,
            "email": "different@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 400
    assert "Username already taken" in response.json()["detail"]


def test_get_user_profile(client: TestClient, test_user, user_token):
    """Test getting user profile"""
    response = client.get(
        f"{settings.API_V1_STR}/users/profile",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["username"] == test_user.username


def test_update_user_profile(client: TestClient, test_user, user_token):
    """Test updating user profile"""
    response = client.put(
        f"{settings.API_V1_STR}/users/profile",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"username": "updatedusername"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "updatedusername"


def test_create_post(client: TestClient, test_user, user_token):
    """Test creating a post"""
    response = client.post(
        f"{settings.API_V1_STR}/users/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "title": "Test Post",
            "content": "This is a test post"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Post"
    assert data["content"] == "This is a test post"
    assert data["user_id"] == test_user.id


def test_get_user_posts(client: TestClient, test_user, user_token):
    """Test getting user's posts"""
    # Create a post first
    client.post(
        f"{settings.API_V1_STR}/users/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "Test Post", "content": "Content"}
    )

    # Get posts
    response = client.get(
        f"{settings.API_V1_STR}/users/posts",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["title"] == "Test Post"


def test_update_post(client: TestClient, test_user, user_token):
    """Test updating a post"""
    # Create a post
    create_response = client.post(
        f"{settings.API_V1_STR}/users/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "Original Title", "content": "Original Content"}
    )
    post_id = create_response.json()["id"]

    # Update the post
    response = client.put(
        f"{settings.API_V1_STR}/users/posts/{post_id}",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "Updated Title"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"


def test_delete_post(client: TestClient, test_user, user_token):
    """Test deleting a post"""
    # Create a post
    create_response = client.post(
        f"{settings.API_V1_STR}/users/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "To Delete", "content": "Delete me"}
    )
    post_id = create_response.json()["id"]

    # Delete the post
    response = client.delete(
        f"{settings.API_V1_STR}/users/posts/{post_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(
        f"{settings.API_V1_STR}/users/posts/{post_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert get_response.status_code == 404
