import logging
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from api.models import Notification, User

logger = logging.getLogger(__name__)


def create_and_send_notification(
    recipient,
    title,
    message,
    notification_type=Notification.NotificationType.INFO,
    action_url="",
    data=None,
):
    """
    Creates a Notification record in the DB and pushes it in real-time
    via WebSockets to the recipient's personal channel group.
    """
    if data is None:
        data = {}

    try:
        notification = Notification.objects.create(
            recipient=recipient,
            title=title,
            message=message,
            notification_type=notification_type,
            action_url=action_url,
            data=data,
        )

        payload = {
            "notification_id": str(notification.notification_id),
            "recipient_id": str(recipient.id),
            "title": notification.title,
            "message": notification.message,
            "notification_type": notification.notification_type,
            "action_url": notification.action_url,
            "is_read": notification.is_read,
            "data": notification.data,
            "created_at": notification.created_at.isoformat(),
        }

        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"user_{recipient.id}",
                {
                    "type": "notification_message",
                    "payload": payload,
                },
            )

        return notification
    except Exception as exc:
        logger.error(f"Failed to create and dispatch notification: {exc}")
        return None


def broadcast_role_notification(
    role,
    title,
    message,
    notification_type=Notification.NotificationType.INFO,
    action_url="",
    data=None,
    persist_for_users=True,
):
    """
    Dispatches a real-time notification to all connected users of a given role
    (e.g. role="admin" for document approval alerts), and optionally persists
    a Notification row for each active user with that role.
    """
    if data is None:
        data = {}

    channel_layer = get_channel_layer()
    group_name = f"role_{role}"

    payload = {
        "title": title,
        "message": message,
        "notification_type": notification_type,
        "action_url": action_url,
        "data": data,
        "is_read": False,
    }

    if channel_layer:
        try:
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    "type": "notification_message",
                    "payload": payload,
                },
            )
        except Exception as exc:
            logger.error(f"Failed to broadcast to {group_name}: {exc}")

    if persist_for_users:
        if role == "admin":
            users = User.objects.filter(role=User.Role.ADMIN) | User.objects.filter(is_staff=True)
            users = users.distinct()
        else:
            users = User.objects.filter(role=role)

        for u in users:
            try:
                Notification.objects.create(
                    recipient=u,
                    title=title,
                    message=message,
                    notification_type=notification_type,
                    action_url=action_url,
                    data=data,
                )
            except Exception:
                pass
