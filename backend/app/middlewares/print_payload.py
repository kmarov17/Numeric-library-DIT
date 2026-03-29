from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class PrintPayloadMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            # Lire le corps de la requête
            body_bytes = await request.body()
            if body_bytes:
                print("Payload reçu :", body_bytes.decode("utf-8"))
            else:
                print("Payload vide")
        except Exception as e:
            print("Erreur lors de la lecture du payload :", e)

        # Recréer la requête avec le même corps pour que les endpoints puissent la lire
        request = Request(request.scope, receive=lambda: {"type": "http.request", "body": body_bytes})
        
        response = await call_next(request)
        return response