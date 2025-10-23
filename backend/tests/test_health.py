from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health():
    """Test health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_app_exists():
    """Test that app is properly initialized."""
    assert app is not None
    assert app.title == "ContentGen API"
