<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tribune extends Model
{
    protected $fillable = ['nom', 'capacite', 'prix', 'stade_id'];

    public function stade()
    {
        return $this->belongsTo(Stade::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}