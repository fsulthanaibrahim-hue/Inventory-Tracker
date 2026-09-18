from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    ProductSerializer,
    StockUpdateSerializer,
)
from .services import (
    create_product,
    delete_product,
    get_inventory_stats,
    get_product,
    get_products,
    update_product,
    update_stock,
)


class ProductListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get("search")
        category = request.query_params.get("category")

        products = get_products(
            search=search,
            category=category,
        )

        return Response({
            "success": True,
            "products": products,
        })

    def post(self, request):
        serializer = ProductSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        product = create_product(
            serializer.validated_data
        )

        return Response(
            {
                "success": True,
                "message": "Product created successfully!",
                "product": product,
            },
            status=status.HTTP_201_CREATED,
        )


class ProductDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        product = get_product(product_id)

        if not product:
            return Response(
                {
                    "success": False,
                    "message": "Product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({
            "success": True,
            "product": product,
        })

    def put(self, request, product_id):
        serializer = ProductSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        product = update_product(
            product_id,
            serializer.validated_data,
        )

        if not product:
            return Response(
                {
                    "success": False,
                    "message": "Product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({
            "success": True,
            "message": "Product updated successfully!",
            "product": product,
        })

    def delete(self, request, product_id):
        deleted = delete_product(product_id)

        if not deleted:
            return Response(
                {
                    "success": False,
                    "message": "Product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({
            "success": True,
            "message": "Product deleted successfully!",
        })


class StockUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, product_id):
        serializer = StockUpdateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        product = update_stock(
            product_id,
            serializer.validated_data["action"],
            serializer.validated_data["quantity"],
        )

        if not product:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Product not found or "
                        "insufficient stock."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({
            "success": True,
            "message": "Stock updated successfully!",
            "product": product,
        })


class InventoryStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = get_inventory_stats()

        return Response({
            "success": True,
            "stats": stats,
        })