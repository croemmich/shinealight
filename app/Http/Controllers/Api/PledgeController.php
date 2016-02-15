<?php namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\PledgeStoreRequest;
use App\Repositories\PledgeRepository;

class PledgeController extends ApiController {

  private $repo;

  public function __construct(PledgeRepository $repo) {
    $this->repo = $repo;
  }

  public function index() {
    return $this->repo->all();
  }

  public function store(PledgeStoreRequest $request) {
    return $this->repo->store($request);
  }

}