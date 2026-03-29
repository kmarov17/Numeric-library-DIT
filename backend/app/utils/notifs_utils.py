from google.oauth2 import service_account
import google.auth.transport.requests
import requests

from app.configs.settings import FIREBASE_APP_ID
from ..utils import minio_utils as minio


def get_access_token():
    # Get and load service account json file
    file_url = minio.get_file_url(image_type="service_account")[0]

    response = requests.get(file_url)
    response.raise_for_status()  # Vérifie si le téléchargement a échoué
    service_account_info = response.json()

    # Créer les credentials depuis le dictionnaire
    SCOPES = ['https://www.googleapis.com/auth/firebase.messaging']
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=SCOPES
    )

    # Générer le token d'accès
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)

    return credentials.token

def send_notif(token: str, title: str, body: str, priority: str = "high", sound: str = "default"):
    access_token = get_access_token()

    url = f"https://fcm.googleapis.com/v1/projects/{FIREBASE_APP_ID}/messages:send"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    data = {
        "message": {
            "token": token,
            "notification": {
                "title": title,
                "body": body
            },
            "android": {
                "priority": priority
            },
            "apns": {
                "payload": {
                    "aps": {
                        "sound": sound
                    }
                }
            }
        }
    }
    requests.post(url, headers=headers, json=data)
    
    return "Nofitication sent successfully"