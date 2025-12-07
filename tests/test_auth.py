import pytest
from fastapi.testclient import TestClient
from app.core.config import settings


def test_user_login_success(client: TestClient, test_user):
    """Test successful user login"""
    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_user_login_wrong_password(client: TestClient, test_user):
    """Test login with wrong password"""
    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={"username": test_user.email, "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_user_login_wrong_email(client: TestClient):
    """Test login with non-existent email"""
    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={"username": "nonexistent@example.com", "password": "password123"}
    )
    assert response.status_code == 401


def test_admin_login_success(client: TestClient, test_admin):
    """Test successful admin login"""
    response = client.post(
        f"{settings.API_V1_STR}/auth/admin/login",
        data={"username": test_admin.email, "password": "adminpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_admin_login_non_admin_user(client: TestClient, test_user):
    """Test admin login with regular user credentials"""
    response = client.post(
        f"{settings.API_V1_STR}/auth/admin/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    assert response.status_code == 403
    assert "Not enough permissions" in response.json()["detail"]


def test_refresh_token(client: TestClient, test_user):
    """Test token refresh"""
    # First login
    login_response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    refresh_token = login_response.json()["refresh_token"]

    # Refresh token
    response = client.post(
        f"{settings.API_V1_STR}/auth/refresh",
        json={"refresh_token": refresh_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_get_current_user(client: TestClient, test_user, user_token):
    """Test getting current user info"""
    response = client.get(
        f"{settings.API_V1_STR}/auth/me",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["username"] == test_user.username


def test_get_current_user_no_token(client: TestClient):
    """Test accessing protected endpoint without token"""
    response = client.get(f"{settings.API_V1_STR}/auth/me")
    assert response.status_code == 401


def test_get_current_user_invalid_token(client: TestClient):
    """Test accessing protected endpoint with invalid token"""
    response = client.get(
        f"{settings.API_V1_STR}/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
