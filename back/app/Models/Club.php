<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    protected $fillable = ['nom', 'ville', 'logo'];

    public function stades()
    {
        return $this->hasMany(Stade::class);
    }
}