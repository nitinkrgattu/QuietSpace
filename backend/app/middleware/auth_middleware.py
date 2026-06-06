# ============================================
# auth_middleware.py
# JWT verification for local app authentication
# ============================================

import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.config import settings

security = HTTPBearer()


def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """Verify the app JWT and return the user_id from the sub claim."""
    token = credentials.credentials
    try:
      payload = jwt.decode(
          token,
          settings.SECRET_KEY,
          algorithms=["HS256"],
          options={"verify_aud": False},
      )
      user_id: str = payload.get("sub")
      if not user_id:
          raise HTTPException(
              status_code=status.HTTP_401_UNAUTHORIZED,
              detail="Invalid token: missing user ID",
          )
      return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )
