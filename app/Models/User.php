<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory;
    use HasApiTokens, HasFactory, Notifiable;

    //protected $primaryKey = 'user_id';
    protected $fillable = [
        'username',
        'lname',
        'fname',
        'mname',
        'sex',
        'email',
        'password',
        'role',
        'last_login'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'is_ojt',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */

    public function getJWTCustomClaims()
    {
        return [];
    }


    public function role(){
        return $this->belongsTo(Role::class);
    }
}
