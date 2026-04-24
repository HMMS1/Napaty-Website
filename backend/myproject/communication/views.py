from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ConsultationRequest, Message
from .serializers import (
    ExpertListSerializer,
    ConsultationRequestCreateSerializer,
    ConsultationRequestListSerializer,
    ConsultationRequestListForExpertSerializer,
    MessageSerializer,
)


def add_unread_counts(data, user):
    for item in data:
        request_id = item.get("id")
        if request_id:
            item["unread_count"] = Message.objects.filter(
                request_id=request_id,
                is_read=False
            ).exclude(sender=user).count()
    return data


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_request_status(request, request_id):
    if not hasattr(request.user, "profile") or request.user.profile.user_type != "expert":
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    try:
        req_obj = ConsultationRequest.objects.get(id=request_id)
    except ConsultationRequest.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if req_obj.expert != request.user:
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    action = request.data.get("action", "").strip().lower()

    if action in ["accept", "reject"]:
        if req_obj.status != "pending":
            return Response(
                {"detail": f"Cannot '{action}' when status is '{req_obj.status}'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        req_obj.status = "accepted" if action == "accept" else "rejected"
        req_obj.save()

        return Response(
            {"message": "updated", "id": req_obj.id, "status": req_obj.status},
            status=status.HTTP_200_OK
        )

    if action == "close":
        if req_obj.status != "accepted":
            return Response(
                {"detail": f"Cannot 'close' when status is '{req_obj.status}'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        req_obj.status = "closed"
        req_obj.save()

        return Response(
            {"message": "updated", "id": req_obj.id, "status": req_obj.status},
            status=status.HTTP_200_OK
        )

    return Response(
        {"detail": "Invalid action. Use: accept | reject | close"},
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST", "PATCH"])
@permission_classes([IsAuthenticated])
def cancel_consultation_request(request, request_id):
    try:
        req_obj = ConsultationRequest.objects.get(id=request_id)
    except ConsultationRequest.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if req_obj.user != request.user:
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    if req_obj.status != "pending":
        return Response(
            {"detail": f"Cannot cancel when status is '{req_obj.status}'"},
            status=status.HTTP_400_BAD_REQUEST
        )

    req_obj.status = "cancelled"
    req_obj.save()

    return Response(
        {"message": "cancelled", "id": req_obj.id, "status": req_obj.status},
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def experts_list(request):
    experts = User.objects.filter(
        profile__user_type="expert"
    ).select_related("profile").order_by("-id")

    return Response(ExpertListSerializer(experts, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_consultation_request(request):
    serializer = ConsultationRequestCreateSerializer(
        data=request.data,
        context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    req_obj = serializer.save()
    return Response(
        ConsultationRequestListSerializer(req_obj).data,
        status=status.HTTP_201_CREATED
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_consultation_requests(request):
    qs = ConsultationRequest.objects.filter(
        user=request.user
    ).exclude(
        status="cancelled"
    ).select_related("expert", "expert__profile").order_by("-id")

    data = ConsultationRequestListSerializer(qs, many=True).data
    data = add_unread_counts(data, request.user)

    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def expert_consultation_requests(request):
    if not hasattr(request.user, "profile") or request.user.profile.user_type != "expert":
        return Response({"detail": "Forbidden"}, status=403)

    qs = ConsultationRequest.objects.filter(
        expert=request.user
    ).exclude(
        status="cancelled"
    ).select_related("user", "user__profile").order_by("-id")

    data = ConsultationRequestListForExpertSerializer(qs, many=True).data
    data = add_unread_counts(data, request.user)

    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def request_messages(request, request_id):
    try:
        req_obj = ConsultationRequest.objects.get(id=request_id)
    except ConsultationRequest.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if request.user != req_obj.user and request.user != req_obj.expert:
        return Response({"detail": "Forbidden"}, status=403)

    if request.method == "GET":
        Message.objects.filter(
            request=req_obj,
            is_read=False
        ).exclude(sender=request.user).update(is_read=True)

        msgs = Message.objects.filter(
            request=req_obj
        ).select_related("sender").order_by("created_at")

        return Response(MessageSerializer(msgs, many=True).data)

    serializer = MessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    msg = Message.objects.create(
        request=req_obj,
        sender=request.user,
        text=serializer.validated_data["text"],
        is_read=False,
    )

    return Response(MessageSerializer(msg).data, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_messages_as_read(request, request_id):
    try:
        req_obj = ConsultationRequest.objects.get(id=request_id)
    except ConsultationRequest.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if request.user != req_obj.user and request.user != req_obj.expert:
        return Response({"detail": "Forbidden"}, status=403)

    Message.objects.filter(
        request=req_obj,
        is_read=False
    ).exclude(sender=request.user).update(is_read=True)

    return Response({"message": "marked_as_read"})