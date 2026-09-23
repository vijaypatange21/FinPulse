import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket consumer for streaming real-time notifications to authenticated users.
    Rooms joined:
    - "user_{user.id}": User-specific notifications (loan status, document verification, alerts)
    - "role_{user.role}": Role-wide announcements (e.g. "role_admin" receives doc upload alerts)
    """

    async def connect(self):
        user = self.scope.get("user")

        if not user or user.is_anonymous:
            # Reject unauthenticated connections
            logger.warning("Unauthenticated WebSocket connection attempt rejected.")
            await self.close(code=4001)
            return

        self.user_group = f"user_{user.id}"
        self.role_group = f"role_{user.role}"

        # Join individual user room
        await self.channel_layer.group_add(self.user_group, self.channel_name)

        # Join role group
        await self.channel_layer.group_add(self.role_group, self.channel_name)

        # If staff/superuser, also ensure joined to role_admin
        if (user.is_staff or user.is_superuser) and self.role_group != "role_admin":
            await self.channel_layer.group_add("role_admin", self.channel_name)

        await self.accept()

        # Send welcome / connection confirmation
        await self.send_json({
            "type": "connection_established",
            "message": f"WebSocket connected for {user.username} ({user.role})",
            "user_id": str(user.id),
            "role": user.role,
        })

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        if user and not user.is_anonymous:
            if hasattr(self, "user_group"):
                await self.channel_layer.group_discard(self.user_group, self.channel_name)
            if hasattr(self, "role_group"):
                await self.channel_layer.group_discard(self.role_group, self.channel_name)
            if (user.is_staff or user.is_superuser) and getattr(self, "role_group", None) != "role_admin":
                await self.channel_layer.group_discard("role_admin", self.channel_name)

    async def receive_json(self, content, **kwargs):
        """
        Handle incoming messages from client (e.g. heartbeat ping)
        """
        action = content.get("action")
        if action == "ping":
            await self.send_json({"type": "pong", "timestamp": content.get("timestamp")})

    async def notification_message(self, event):
        """
        Handler for messages pushed from channel layer with type="notification_message"
        """
        await self.send_json({
            "type": "notification",
            "data": event.get("payload", {}),
        })
