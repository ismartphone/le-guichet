<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    // Liste tous les clubs
    public function index()
    {
        return response()->json(Club::all());
    }

    // Créer un club (admin)
    public function store(Request $request)
    {
        $request->validate([
            'nom'  => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'logo' => 'nullable|string',
        ]);

        $club = Club::create($request->all());

        return response()->json($club, 201);
    }

    // Modifier un club (admin)
    public function update(Request $request, $id)
    {
        $club = Club::findOrFail($id);
        $club->update($request->all());

        return response()->json($club);
    }

    // Supprimer un club (admin)
    public function destroy($id)
    {
        Club::findOrFail($id)->delete();

        return response()->json(['message' => 'Club supprimé.']);
    }
}