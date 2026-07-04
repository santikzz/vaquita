<?php

namespace App\Notifications;

use App\Models\User;

// example of a custom notification type: it carries its own payload (the actor who
// mentioned the recipient) and renders through a dedicated `mention-notification`
// component. copy this shape when adding a real notification to your app.
class DemoMentionNotification extends BaseNotification
{
    public function __construct(
        private User $actor,
        private string $message,
        private string $url = '/dashboard',
    ) {}

    public function component(): string
    {
        return 'mention-notification';
    }

    protected function payload(): array
    {
        return [
            'actor' => $this->actor->name,
            'avatar' => $this->actor->avatar,
            'message' => $this->message,
            'url' => $this->url,
        ];
    }
}
