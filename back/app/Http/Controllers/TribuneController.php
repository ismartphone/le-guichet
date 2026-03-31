<?php

namespace App\Http\Controllers;

use App\Models\Tribune;
use Illuminate\Http\Request;

class TribuneController extends Controller
{
    // Liste les tribunes d'un match
    public function index($match_id)
    {
        $tribunes = Tribune::whereHas('stade.matchs', function ($query) use ($match_id) {
            $query->where('id', $match_id);
        })->get();

        return response()->json($tribunes);
    }

    // Créer une tribune (admin)
    public function store(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string|max:255',
            'capacite' => 'required|integer',
            'prix'     => 'required|numeric',
            'stade_id' => 'required|exists:stades,id',
        ]);

        $tribune = Tribune::create($request->all());
        return response()->json($tribune, 201);
    }

    // Modifier une tribune (admin)
    public function update(Request $request, $id)
    {
        $tribune = Tribune::findOrFail($id);
        $tribune->update($request->all());
        return response()->json($tribune);
    }

    // Supprimer une tribune (admin)
    public function destroy($id)
    {
        Tribune::findOrFail($id)->delete();
        return response()->json(['message' => 'Tribune supprimée.']);
    }
}