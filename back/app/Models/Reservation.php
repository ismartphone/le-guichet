<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'match_id',
        'tribune_id',
        'nb_places',
        'statut'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function match()
    {
        return $this->belongsTo(FootballMatch::class, 'match_id');
    }

    public function tribune()
    {
        return $this->belongsTo(Tribune::class);
    }
}