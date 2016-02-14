<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pledge extends Model {

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'name', 'addr_street_number', 'addr_route', 'addr_locality', 'addr_admin_2',
    'addr_admin_1', 'addr_country', 'addr_postal', 'latitude', 'longitude', 'comment',
  ];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [
    'client_ip', 'client_agent'
  ];

}
