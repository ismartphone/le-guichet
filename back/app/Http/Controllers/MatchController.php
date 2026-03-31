<?php

namespace App\Http\Controllers;

use App\Models\Match as FootballMatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MatchController extends Controller
{
    // Liste tous les matchs
    public function index()
    {
        $matchs = FootballMatch::with(['clubDomicile', 'clubExterieur', 'stade'])->get();
        return response()->json($matchs);
    }

    // Détail d'un match
    public function show($id)
    {
        $match = FootballMatch::with(['clubDomicile', 'clubExterieur', 'stade', 'stade.tribunes'])->findOrFail($id);
        return response()->json($match);
    }

    // Créer un match (admin)
    public function store(Request $request)
    {
        $request->validate([
            'club_domicile_id'  => 'required|exists:clubs,id',
            'club_exterieur_id' => 'required|exists:clubs,id',
            'stade_id'          => 'required|exists:stades,id',
            'date_match'        => 'required|date',
        ]);

        $match = FootballMatch::create($request->all());
        return response()->json($match, 201);
    }

    // Modifier un match (admin)
    public function update(Request $request, $id)
    {
        $match = FootballMatch::findOrFail($id);
        $match->update($request->all());
        return response()->json($match);
    }

    // Supprimer un match (admin)
    public function destroy($id)
    {
        FootballMatch::findOrFail($id)->delete();
        return response()->json(['message' => 'Match supprimé.']);
    }

    // Synchroniser depuis API-Football
    public function syncFromApi()
    {
        $response = Http::withHeaders([
            'x-apisports-key' => env('FOOTBALL_API_KEY')
        ])->get('https://v3.football.api-sports.io/fixtures', [
            'league' => 61,
            'season' => 2024
        ]);

        return response()->json($response->json());
    }
}