import pytest
from fastapi.testclient import TestClient
from app.core.config import settings


def test_get_dashboard_stats(client: TestClient, test_admin, admin_token):
    """Test getting dashboard statistics"""
    response = client.get(
        f"{settings.API_V1_STR}/admin/dashboard",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert "active_users" in data
    assert "admin_users" in data
    assert "total_posts" in data


def test_get_dashboard_stats_no_admin(client: TestClient, test_user, user_token):
    """Test accessing dashboard without admin rights"""
    response = client.get(
        f"{settings.API_V1_STR}/admin/dashboard",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 403


def test_list_all_users(client: TestClient, test_admin, admin_token):
    """Test listing all users"""
    response = client.get(
        f"{settings.API_V1_STR}/admin/users",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_user_by_id(client: TestClient, test_user, test_admin, admin_token):
    """Test getting specific user by ID"""
    response = client.get(
        f"{settings.API_V1_STR}/admin/users/{test_user.id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email


def test_update_user_role(client: TestClient, test_user, test_admin, admin_token):
    """Test updating user role"""
    response = client.put(
        f"{settings.API_V1_STR}/admin/users/{test_user.id}/role",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"role": "admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "admin"


def test_deactivate_user(client: TestClient, test_user, test_admin, admin_token):
    """Test deactivating user"""
    response = client.put(
        f"{settings.API_V1_STR}/admin/users/{test_user.id}/deactivate",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_active"] is False


def test_activate_user(client: TestClient, test_user, test_admin, admin_token, db):
    """Test activating user"""
    # First deactivate
    test_user.is_active = False
    db.commit()

    # Then activate
    response = client.put(
        f"{settings.API_V1_STR}/admin/users/{test_user.id}/activate",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_active"] is True


def test_delete_user(client: TestClient, test_admin, admin_token, db):
    """Test deleting user"""
    # Create a user to delete
    from app.models.user import User
    from app.core.security import get_password_hash

    user_to_delete = User(
        username="deleteme",
        email="delete@example.com",
        hashed_password=get_password_hash("password123"),
    )
    db.add(user_to_delete)
    db.commit()
    db.refresh(user_to_delete)

    response = client.delete(
        f"{settings.API_V1_STR}/admin/users/{user_to_delete.id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 204


def test_admin_cannot_delete_self(client: TestClient, test_admin, admin_token):
    """Test that admin cannot delete their own account"""
    response = client.delete(
        f"{settings.API_V1_STR}/admin/users/{test_admin.id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 400
    assert "Cannot delete your own account" in response.json()["detail"]


def test_list_all_posts(client: TestClient, test_admin, admin_token):
    """Test listing all posts"""
    response = client.get(
        f"{settings.API_V1_STR}/admin/posts",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_any_post(client: TestClient, test_user, user_token, test_admin, admin_token):
    """Test admin deleting any user's post"""
    # Create a post as regular user
    create_response = client.post(
        f"{settings.API_V1_STR}/users/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "User Post", "content": "Content"}
    )
    post_id = create_response.json()["id"]

    # Admin deletes the post
    response = client.delete(
        f"{settings.API_V1_STR}/admin/posts/{post_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 204
