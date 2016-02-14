<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePledgesTable extends Migration {
  const TABLE_NAME = 'pledges';

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create(self::TABLE_NAME, function(Blueprint $table) {
      $table->increments('id');
      $table->string('name');
      $table->string('addr_street_number')->nullable();
      $table->string('addr_route')->nullable(); // street
      $table->string('addr_locality')->nullable(); // city
      $table->string('addr_admin_2')->nullable(); // county
      $table->string('addr_admin_1')->nullable(); // state
      $table->string('addr_country')->nullable();
      $table->string('addr_postal')->nullable();
      $table->double('latitude')->nullable();
      $table->double('longitude')->nullable();
      $table->text('comment')->nullable();
      $table->string('client_ip', 40);
      $table->text('client_agent')->nullable();
      $table->timestamp('hidden_at')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::drop(self::TABLE_NAME);
  }
}
