from django.urls import path
from .views import (
    experts_list,
    create_consultation_request,
    my_consultation_requests,
    request_messages,
    expert_consultation_requests,
    update_request_status,
    cancel_consultation_request,
    mark_messages_as_read,
)

urlpatterns = [
    path("api/communication/experts/", experts_list),
    path("api/communication/requests/", my_consultation_requests),
    path("api/communication/requests/create/", create_consultation_request),
    path("api/communication/requests/<int:request_id>/messages/", request_messages),
    path("api/communication/expert/requests/", expert_consultation_requests),
    path("api/communication/requests/<int:request_id>/status/", update_request_status),
    path("api/communication/requests/<int:request_id>/cancel/", cancel_consultation_request),

    path("api/communication/requests/<int:request_id>/read/", mark_messages_as_read),
]