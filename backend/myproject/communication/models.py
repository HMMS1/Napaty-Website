from django.db import models
from django.contrib.auth.models import User


class ConsultationRequest(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("closed", "Closed"),
        ("cancelled", "Cancelled"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consultation_requests")
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expert_requests")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request #{self.id} ({self.status})"


class Message(models.Model):
    request = models.ForeignKey(ConsultationRequest, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    text = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Msg #{self.id} in Req #{self.request_id}"