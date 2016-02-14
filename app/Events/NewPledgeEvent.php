<?php

namespace App\Events;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NewPledgeEvent extends Event implements ShouldBroadcast {
  use SerializesModels;

  public $pledge;

  /**
   * Create a new event instance.
   */
  public function __construct($pledge) {
    $this->pledge = $pledge;
  }

  /**
   * Get the channels the event should be broadcast on.
   *
   * @return array
   */
  public function broadcastOn() {
    return ['pledges'];
  }
}