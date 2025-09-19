<?php

namespace App\Http\Requests\Animals;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnimalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'photo' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048' // 2MB max
            ],
            'category' => [
                'sometimes',
                'required',
                'string',
                'in:Anjing,Kucing,Kelinci,Reptil,Lainnya'
            ],
            'name_animal' => [
                'sometimes',
                'required',
                'string',
                'max:255'
            ],
            'name_owner' => [
                'sometimes',
                'required',
                'string',
                'max:255'
            ],
            'phone_owner' => [
                'sometimes',
                'required',
                'string',
                'regex:/^[\+]?[0-9\s\-\(\)]{10,15}$/',
                'max:20'
            ],
            'email_owner' => [
                'sometimes',
                'required',
                'email',
                'max:255'
            ],
            'time_registered' => [
                'sometimes',
                'nullable',
                'date',
                'before_or_equal:now'
            ],
            'time_out' => [
                'sometimes',
                'nullable',
                'date',
                'after:time_registered'
            ]
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'photo.image' => 'The uploaded file must be an image.',
            'photo.mimes' => 'The photo must be a file of type: jpeg, png, jpg, gif.',
            'photo.max' => 'The photo must not be larger than 2MB.',
            'category.required' => 'Please select a category for the animal.',
            'category.in' => 'Please select a valid category.',
            'name_animal.required' => 'Please provide the animal\'s name.',
            'name_owner.required' => 'Please provide the owner\'s name.',
            'phone_owner.required' => 'Please provide the owner\'s phone number.',
            'phone_owner.regex' => 'Please provide a valid phone number.',
            'email_owner.required' => 'Please provide the owner\'s email address.',
            'email_owner.email' => 'Please provide a valid email address.',
            'time_registered.date' => 'Please provide a valid registration date and time.',
            'time_registered.before_or_equal' => 'Registration time cannot be in the future.',
            'time_out.date' => 'Please provide a valid checkout date and time.',
            'time_out.after' => 'Checkout time must be after registration time.'
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'name_animal' => 'animal name',
            'name_owner' => 'owner name',
            'phone_owner' => 'owner phone',
            'email_owner' => 'owner email',
            'time_registered' => 'registration time',
            'time_out' => 'checkout time'
        ];
    }
}
