from django.urls import path

from .views import ( InventoryStatsView, ProductDetailView, ProductListCreateView, StockUpdateView )


urlpatterns = [
    path("products/", ProductListCreateView.as_view(), name="product-list-create"),
    path("products/stats/", InventoryStatsView.as_view(), name="inventory-stats"),
    path("products/<str:product_id>/stock/", StockUpdateView.as_view(), name="product-stock"),
    path("products/<str:product_id>/", ProductDetailView.as_view(), name="product-detail"),
]