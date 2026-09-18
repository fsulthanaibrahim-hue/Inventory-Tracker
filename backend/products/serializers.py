from rest_framework import serializers


class ProductSerializer(serializers.Serializer):
    name = serializers.CharField(
        required=True,
        max_length=150
    )

    description = serializers.CharField(
        required=False,
        allow_blank=True,
        default=""
    )

    category = serializers.ChoiceField(
        choices=[
            "Electronics",
            "Clothing",
            "Food",
            "Other",
        ]
    )

    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0.01
    )

    quantity = serializers.IntegerField(
        min_value=0
    )

    minimum_stock = serializers.IntegerField(
        min_value=0
    )


class StockUpdateSerializer(serializers.Serializer):
    action = serializers.ChoiceField(
        choices=["add", "remove"]
    )

    quantity = serializers.IntegerField(
        min_value=1
    )