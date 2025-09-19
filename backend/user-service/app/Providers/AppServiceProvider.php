<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\AnimalRepository;
use App\Repositories\CategoryRepository;
use App\Services\AnimalService;
use App\Services\CategoryService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register Repository bindings
        $this->app->bind(AnimalRepository::class, function ($app) {
            return new AnimalRepository($app->make(\App\Models\Animal::class));
        });

        $this->app->bind(CategoryRepository::class, function ($app) {
            return new CategoryRepository($app->make(\App\Models\Category::class));
        });

        // Register Service bindings
        $this->app->bind(AnimalService::class, function ($app) {
            return new AnimalService(
                $app->make(AnimalRepository::class),
                $app->make(CategoryRepository::class)
            );
        });

        $this->app->bind(CategoryService::class, function ($app) {
            return new CategoryService($app->make(CategoryRepository::class));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
