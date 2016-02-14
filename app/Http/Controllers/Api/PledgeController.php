<?php namespace App\Http\Controllers\Api;

use App\Events\NewPledgeEvent;
use App\Http\Requests\Api\PledgeStoreRequest;
use App\Pledge;

class PledgeController extends ApiController {

  private $publicKeys = ['id', 'name', 'comment', 'latitude', 'longitude', 'updated_at'];

  public function index() {
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

}