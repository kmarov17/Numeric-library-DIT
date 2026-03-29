from fastapi import HTTPException
from minio import Minio
from datetime import timedelta
import base64
import io
import uuid
import imghdr
import requests

from app.configs.settings import MINIO_SERVER_URL, MINIO_USER, MINIO_PASSWORD, MINIO_BUCKET_NAME


client = Minio(
    f"{MINIO_SERVER_URL}",
    access_key=MINIO_USER,
    secret_key=MINIO_PASSWORD,
    secure=True
)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB en octets

def get_extension_from_base64(base64_str: str) -> str:
    file_data = base64.b64decode(base64_str)
    ext = imghdr.what(None, h=file_data)
    return ext if ext else "jpg"

def generate_object_key(pro_id: str, file_type: str, extension: str, service_id: str = None) -> str:
    if file_type not in ["profile_pic", "id_recto", "id_verso", "gallery"]:
        raise ValueError("Invalid file type. Must be 'profile_pic' or 'id_recto', 'id_verso', 'gallery'.")
    
    if file_type == "profile_pic":
        return f"users/pros/{pro_id}/profile_pic/profile_picture.{extension}"
    elif file_type == "id_recto":
        return f"users/pros/{pro_id}/ID/recto/identity.{extension}"
    elif file_type == "id_verso":
        return f"users/pros/{pro_id}/ID/verso/identity.{extension}"
    elif file_type == "gallery":
        if not service_id:
            raise ValueError("service_id is required for gallery files.")
        return f"users/pros/{pro_id}/gallery/{service_id}/{uuid.uuid4()}.{extension}"

def store_file_by_type(pro_id: str, file_type: str, base64_str: str, service_id: str = None) -> str:
    """
    Stocke une file en base64 dans Minio selon le type (profile_pic, pieces_identite, etc.)
    et retourne l'URL de l'objet.

    :param pro_id: ID du professionnel
    :param file_type: Type d'file ('profile_pic', 'pieces_identite', etc.)
    :param base64_str: file encodée en base64
    :return: URL de l'file stockée
    """
    try:
        extension = get_extension_from_base64(base64_str)
        file_data = base64.b64decode(base64_str)
        # Vérification taille max
        if len(file_data) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Max allowed size is {MAX_FILE_SIZE // (1024*1024)} MB"
            )

        object_name = generate_object_key(pro_id, file_type, extension, service_id)
        client.put_object(
            MINIO_BUCKET_NAME,
            object_name,
            data=io.BytesIO(file_data),
            length=len(file_data),
        )
        object_url = f"{MINIO_SERVER_URL}/{MINIO_BUCKET_NAME}/{object_name}"
        print(f"***[INFO]*** file uploaded successfully. Object URL: {object_url}")
        return object_url
    except Exception as e:
        print(f"Error uploading file to MinIO: {e}")
        raise

def get_presigned_url(object_name: str) -> str:
    """
    Génère une URL pré-signée pour accéder à un objet privé Minio.
    :param object_name: Chemin de l'objet dans le bucket
    :param expires: Durée de validité en secondes (par défaut 1h)
    """
    try:
        expires = timedelta(hours=1)
        url = client.presigned_get_object(MINIO_BUCKET_NAME, object_name, expires=expires)
        return url
    except Exception as e:
        print(f"Error generating presigned URL: {e}")
        raise

def get_file_url(image_type: str, pro_id: str = None, service_id: str = None) -> list:
    """
    Récupère l'URL du ou des fichiers stockés dans Minio selon le type et le dossier.

    :param pro_id: ID du professionnel
    :param image_type: Type d'image ('profile_pic', 'id_recto', 'id_verso', 'gallery')
    :param extension: Extension de l'image (jpg, png, etc.)
    :param service_name: Nom du service (pour 'gallery')
    :return: Liste des URLs des images trouvées
    """
    try:
        if image_type == "profile_pic":
            prefix = f"users/pros/{pro_id}/profile_pic/"
        elif image_type == "id_recto":
            prefix = f"users/pros/{pro_id}/ID/recto/"
        elif image_type == "id_verso":
            prefix = f"users/pros/{pro_id}/ID/verso/"
        elif image_type == "service_account":
            prefix = "service_account/"
        elif image_type == "gallery":
            if not service_id:
                raise ValueError("service_id is required for gallery images.")
            prefix = f"users/pros/{pro_id}/gallery/{service_id}/"
        else:
            raise ValueError("Invalid image type.")

        # Liste tous les objets sous ce préfixe
        objects = client.list_objects(MINIO_BUCKET_NAME, prefix=prefix, recursive=True)
        urls = []
        for obj in objects:
            # On ne filtre pas sur l'extension ici, mais tu peux le faire si besoin
            presigned_url = get_presigned_url(obj.object_name)
            urls.append(presigned_url)
        return urls
    except Exception as e:
        print(f"Error listing images in Minio: {e}")
        raise

def image_url_to_base64(url):
    response = requests.get(url)
    response.raise_for_status()
    image_bytes = response.content
    base64_str = base64.b64encode(image_bytes).decode('utf-8')
    return base64_str

def delete_files_in_folder(folder_prefix: str) -> int:
    """
    Supprime tous les fichiers d'un dossier (préfixe) sur Minio.
    :param folder_prefix: Le chemin du dossier (préfixe) à nettoyer, ex: 'users/pros/{pro_id}/gallery/{service_id}/'
    :return: Le nombre de fichiers supprimés
    """
    try:
        objects_to_delete = [obj.object_name for obj in client.list_objects(MINIO_BUCKET_NAME, prefix=folder_prefix, recursive=True)]
        deleted_count = 0
        for object_name in objects_to_delete:
            client.remove_object(MINIO_BUCKET_NAME, object_name)
            deleted_count += 1
        print(f"{deleted_count} fichiers supprimés dans {folder_prefix}")
        return deleted_count
    except Exception as e:
        print(f"Erreur lors de la suppression des fichiers dans {folder_prefix}: {e}")
        raise
