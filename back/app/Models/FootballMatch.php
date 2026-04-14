<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FootballMatch extends Model
{
    protected $table = 'matchs';

    protected $fillable = [
        'club_domicile_id',
        'club_exterieur_id',
        'stade_id',
        'date_match',
        'statut'
    ];

    public function clubDomicile()
    {
        return $this->belongsTo(Club::class, 'club_domicile_id');
    }

    public function clubExterieur()
    {
        return $this->belongsTo(Club::class, 'club_exterieur_id');
    }

    public function stade()
    {
        return $this->belongsTo(Stade::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'match_id');
    }
}