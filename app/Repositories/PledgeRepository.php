<?php namespace App\Repositories;

use App\Events\NewPledgeEvent;
use App\Http\Requests\Api\PledgeStoreRequest;
use App\Pledge;

class PledgeRepository extends Repository {

  private $publicKeys = ['id', 'name', 'comment', 'latitude', 'longitude', 'updated_at'];

  public function all() {
    return Pledge::query()
      ->whereNull('hidden_at')
      ->whereNotNull('latitude')
      ->whereNotNull('longitude')
      ->orderBy('updated_at', 'desc')
      ->get($this->publicKeys);
  }

  public function store(PledgeStoreRequest $request) {
    $pledge = new Pledge($request->toArray());
    $pledge->client_ip = $request->getClientIp();
    $pledge->client_agent = $request->server('HTTP_USER_AGENT');
    $pledge->save();

    $pledgeArray = $pledge->toArray();
    event(new NewPledgeEvent(array_only($pledgeArray, $this->publicKeys)));

    return $pledge;
  }

  public function count() {
    return Pledge::query()
      ->whereNull('hidden_at')
      ->whereNotNull('latitude')
      ->whereNotNull('longitude')
      ->count();
  }



}