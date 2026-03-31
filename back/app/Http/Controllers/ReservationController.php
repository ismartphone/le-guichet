<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    // Liste les réservations de l'utilisateur connecté
    public function index(Request $request)
    {
        $reservations = Reservation::with(['match.clubDomicile', 'match.clubExterieur', 'tribune'])
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($reservations);
    }

    // Créer une réservation
    public function store(Request $request)
    {
        $request->validate([
            'match_id'   => 'required|exists:matchs,id',
            'tribune_id' => 'required|exists:tribunes,id',
            'nb_places'  => 'required|integer|min:1|max:10',
        ]);

        $reservation = Reservation::create([
            'user_id'    => $request->user()->id,
            'match_id'   => $request->match_id,
            'tribune_id' => $request->tribune_id,
            'nb_places'  => $request->nb_places,
            'statut'     => 'confirmee',
        ]);

        return response()->json($reservation, 201);
    }

    // Annuler une réservation
    public function destroy(Request $request, $id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $reservation->update(['statut' => 'annulee']);

        return response()->json(['message' => 'Réservation annulée.']);
    }
}