<?php namespace App\Http\Requests\Api;

use App\Http\Requests\Request;
use Illuminate\Http\JsonResponse;

abstract class ApiRequest extends Request {

  public function response(array $errors) {
    return new JsonResponse($errors, 422);
  }

  public function authorize() {
    return true;
  }

}