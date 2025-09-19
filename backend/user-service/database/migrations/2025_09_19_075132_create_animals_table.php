<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('animals', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('photo');
            $table->enum('category', ['Anjing', 'Kucing', 'Kelinci', 'Reptil', 'Lainnya']);
            $table->string('name_animal');
            $table->string('name_owner');
            $table->string('phone_owner');
            $table->string('email_owner');
            $table->dateTime('time_registered');
            $table->dateTime('time_out')->nullable();
            $table->decimal('cost_total', 10, 2)->nullable();
            $table->timestamps();

            $table->foreign('category')->references('type')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};
