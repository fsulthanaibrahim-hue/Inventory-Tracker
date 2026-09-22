from datetime import datetime, timezone

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from products.mongodb import users_collection


# ============================================
# LOGIN SERIALIZER
# ============================================

class LoginSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username

        return token


# ============================================
# REGISTER SERIALIZER
# ============================================

class RegisterSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        required=True,
        max_length=150
    )

    email = serializers.EmailField(
        required=True
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password_confirm = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password_confirm",
        ]

    # ========================================
    # VALIDATE USERNAME
    # ========================================

    def validate_username(self, value):

        value = value.strip()

        # Check Django database
        if User.objects.filter(
            username=value
        ).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        # Check MongoDB
        if users_collection.find_one(
            {"username": value}
        ):
            raise serializers.ValidationError(
                "Username already exists."
            )

        return value

    # ========================================
    # VALIDATE EMAIL
    # ========================================

    def validate_email(self, value):

        value = value.strip().lower()

        # Check Django database
        if User.objects.filter(
            email=value
        ).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        # Check MongoDB
        if users_collection.find_one(
            {"email": value}
        ):
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    # ========================================
    # VALIDATE PASSWORDS
    # ========================================

    def validate(self, attrs):

        if (
            attrs["password"]
            != attrs["password_confirm"]
        ):
            raise serializers.ValidationError({
                "password_confirm":
                    "Passwords do not match."
            })

        return attrs

    # ========================================
    # CREATE USER
    # ========================================

    def create(self, validated_data):

        # Remove confirmation password
        validated_data.pop(
            "password_confirm"
        )

        username = validated_data["username"]
        email = validated_data["email"]
        password = validated_data["password"]

        # ------------------------------------
        # 1. CREATE DJANGO USER
        # ------------------------------------

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        # ------------------------------------
        # 2. STORE USER PROFILE IN MONGODB
        # ------------------------------------

        try:

            users_collection.insert_one({
                "django_user_id": user.id,
                "username": username,
                "email": email,
                "is_active": user.is_active,
                "created_at": datetime.now(
                    timezone.utc
                ),
            })

        except Exception as error:

            # If MongoDB fails, remove the
            # Django user that was just created.
            user.delete()

            raise serializers.ValidationError({
                "detail":
                    "Failed to save user data."
            }) from error

        return user