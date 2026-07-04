<?php

namespace App\Notifications;

// generic notification rendered by the fallback `default-notification` component.
// use it as-is for simple title/message alerts, or copy it as a starting point for
// a custom notification type (see DemoMentionNotification).
class DemoNotification extends BaseNotification
{
    public function __construct(
        private string $title,
        private string $message,
        private ?string $url = null,
    ) {}

    public function component(): string
    {
        return 'default-notification';
    }

    protected function payload(): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'url' => $this->url,
        ];
    }
}
