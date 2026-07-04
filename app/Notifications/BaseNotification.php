<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

// base for every app notification. children declare the frontend component slug
// and their payload; the data shape is shared by the database and broadcast
// channels so the client renders the same way live or on reload.
//
// realtime broadcast is off by default (works without a websocket server). enable
// it per-notification by returning ['database', 'broadcast'] from channels(), or
// globally by overriding this method here. see docs/notifications.md.
abstract class BaseNotification extends Notification
{
    use Queueable;

    // frontend component slug, mapped in resources/js/components/notifications/registry.ts
    abstract public function component(): string;

    // notification-specific data merged into the payload
    abstract protected function payload(): array;

    // delivery channels. add 'broadcast' to push live over websockets (needs reverb).
    protected function channels(): array
    {
        return ['database'];
    }

    public function via(object $notifiable): array
    {
        return $this->channels();
    }

    public function toArray(object $notifiable): array
    {
        return [
            'component' => $this->component(),
            ...$this->payload(),
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    // event name the client listens for on the private channel
    public function broadcastType(): string
    {
        return 'notification';
    }
}
