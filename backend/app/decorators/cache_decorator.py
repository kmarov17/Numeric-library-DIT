import json
import functools
from fastapi import Request

from redis.asyncio import Redis
from app.configs.settings import REDIS_HOST, REDIS_PORT


redis = Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

def cache(ttl: int = 60):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Chercher l'objet Request dans args ou kwargs
            request: Request = kwargs.get("request")
            if request is None:
                print("No req")
                # Si pas trouvé dans kwargs, essayer de le trouver dans args
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break

            if request is None:
                print("No req 2")
                # On ne peut pas construire de clé sans request
                return await func(*args, **kwargs)

            # Construire une clé unique à partir du chemin + query
            cache_key = f"cache:{request.url.path}?{request.url.query}"
            print(cache_key)

            # Vérifier si la réponse est déjà en cache
            cached = await redis.get(cache_key)
            if cached:
                return json.loads(cached)

            # Sinon exécuter le endpoint
            response = await func(*args, **kwargs)

            # Mettre la réponse en cache (en JSON)
            await redis.set(cache_key, json.dumps(response), ex=ttl)
            return response

        return wrapper
    return decorator