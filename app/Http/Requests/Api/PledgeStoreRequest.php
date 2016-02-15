<?php

namespace App\Http\Requests\Api;

class PledgeStoreRequest extends ApiRequest {

  public function rules() {
    return [
      'name' => 'required',
      'latitude' => 'required|numeric|between:-90,90',
      'longitude' => 'required|numeric|between:-180,180'
    ];
  }

}
