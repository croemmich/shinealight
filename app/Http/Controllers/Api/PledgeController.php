<?php namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\PledgeStoreRequest;
use App\Pledge;

class PledgeController extends ApiController {

  public function index() {
    return Pledge::query()
      ->whereNull('hidden_at')
      ->whereNotNull('latitude')
      ->whereNotNull('longitude')
      ->orderBy('updated_at', 'desc')
      ->get(['id', 'name', 'comment', 'latitude', 'longitude', 'updated_at']);
  }

  public function store(PledgeStoreRequest $request) {
    $pledge = new Pledge($request->toArray());
    $pledge->client_ip = $request->getClientIp();
    $pledge->client_agent = $request->server('HTTP_USER_AGENT');
    $pledge->save();
    return $pledge;
  }

}