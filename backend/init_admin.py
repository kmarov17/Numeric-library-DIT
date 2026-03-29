import asyncio
import uuid
from datetime import datetime
from app.configs.db import async_session
from app.configs.tables import Users
from app.utils.users_utils import hash_pass


SUPERADMIN_EMAIL = "admin@gmail.com"
SUPERADMIN_FIRST_NAME = "Super"
SUPERADMIN_LAST_NAME = "Admin"
SUPERADMIN_PASSWORD = "password"
SUPERADMIN_TYPE = "PERSONNEL ADMINISTRATIF"
SUPERADMIN_PROGRAM = "Administration"

async def main():
    async with async_session() as db:
        # Vérifier si le super admin existe déjà
        result = await db.execute(
            Users.__table__.select().where(Users.email == SUPERADMIN_EMAIL)
        )
        existing = result.first()
        if existing:
            print("Super admin déjà existant.")
            return

        # Créer l'utilisateur associé
        user_id = uuid.uuid4()
        db.add(Users(
            id=user_id,
            first_name=SUPERADMIN_FIRST_NAME,
            last_name=SUPERADMIN_LAST_NAME,
            email=SUPERADMIN_EMAIL,
            type=SUPERADMIN_TYPE,
            program=SUPERADMIN_PROGRAM,
            password=hash_pass(SUPERADMIN_PASSWORD),  # À remplacer par un hash sécurisé !
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        ))
        await db.commit()
        print(f"Utilisateur super admin créé avec ID: {user_id}")

if __name__ == "__main__":
    asyncio.run(main())
