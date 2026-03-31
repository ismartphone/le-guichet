<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stade extends Model
{
    protected $fillable = ['nom', 'ville', 'capacite', 'club_id'];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function tribunes()
    {
        return $this->hasMany(Tribune::class);
    }

    public function matchs()
    {
        return $this->hasMany(FootballMatch::class);
    }
}