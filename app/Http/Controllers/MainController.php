<?php

namespace App\Http\Controllers;

use App\Repositories\PledgeRepository;

class MainController extends Controller {

  public function index(PledgeRepository $repo) {
    return view('app', ['numPledges' => $repo->count()]);
  }

}
