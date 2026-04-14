<?php

namespace App\Services;

use App\Models\Club;
use App\Models\FootballMatch;
use App\Models\Stade;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApiFootballService
{
    private string $baseUrl = 'https://v3.football.api-sports.io';

    // ─── Appel HTTP ──────────────────────────────────────────────────────────

    /**
     * Récupère les fixtures d'une ligue / saison depuis API-Football.
     *
     * @throws \Exception si l'API répond avec une erreur HTTP
     */
    public function fetchFixtures(int $league, int $season): array
    {
        $response = Http::withHeaders([
            'x-apisports-key' => config('services.football_api.key'),
        ])->get("{$this->baseUrl}/fixtures", [
            'league' => $league,
            'season' => $season,
        ]);

        if ($response->failed()) {
            throw new \Exception("API-Football HTTP error {$response->status()}");
        }

        $body = $response->json();

        if (!empty($body['errors'])) {
            $error = is_array($body['errors']) ? implode(', ', $body['errors']) : $body['errors'];
            throw new \Exception("API-Football error: {$error}");
        }

        return $body['response'] ?? [];
    }

    // ─── Synchronisation BDD ─────────────────────────────────────────────────

    /**
     * Synchronise les matchs de Ligue 1 depuis l'API vers la base de données.
     *
     * @return array{created: int, updated: int, errors: string[]}
     */
    public function sync(int $league = 61, int $season = 2024): array
    {
        $fixtures = $this->fetchFixtures($league, $season);

        $created = 0;
        $updated = 0;
        $errors  = [];

        foreach ($fixtures as $fixture) {
            try {
                [$wasCreated] = $this->syncFixture($fixture);
                $wasCreated ? $created++ : $updated++;
            } catch (\Throwable $e) {
                $fixtureId = $fixture['fixture']['id'] ?? '?';
                $msg = "Fixture {$fixtureId} : {$e->getMessage()}";
                Log::warning("[ApiFootball] {$msg}");
                $errors[] = $msg;
            }
        }

        return compact('created', 'updated', 'errors');
    }

    // ─── Logique interne ─────────────────────────────────────────────────────

    /**
     * Persiste un fixture (club domicile, club extérieur, stade, match).
     *
     * @return array{bool} [wasCreated]
     */
    private function syncFixture(array $fixture): array
    {
        $fixtureData = $fixture['fixture'];
        $homeData    = $fixture['teams']['home'];
        $awayData    = $fixture['teams']['away'];
        $goals       = $fixture['goals'] ?? [];

        // ── Clubs ────────────────────────────────────────────────────────────
        $homeClub = Club::updateOrCreate(
            ['api_football_id' => $homeData['id']],
            [
                'nom'  => $homeData['name'],
                'ville' => $fixtureData['venue']['city'] ?? $homeData['name'],
                'logo' => $homeData['logo'] ?? null,
            ]
        );

        $awayClub = Club::updateOrCreate(
            ['api_football_id' => $awayData['id']],
            [
                'nom'  => $awayData['name'],
                'ville' => $awayData['name'], // ville inconnue pour l'extérieur
                'logo' => $awayData['logo'] ?? null,
            ]
        );

        // ── Stade (club domicile uniquement, on ne remplace pas la capacité existante) ──
        $stade = Stade::firstOrCreate(
            ['club_id' => $homeClub->id],
            [
                'nom'      => $fixtureData['venue']['name'] ?? "{$homeClub->nom} Stadium",
                'ville'    => $fixtureData['venue']['city'] ?? $homeClub->ville,
                'capacite' => 40000,
            ]
        );

        // Si le nom du stade a changé côté API, on le met à jour
        if (
            !empty($fixtureData['venue']['name']) &&
            $stade->nom !== $fixtureData['venue']['name']
        ) {
            $stade->update([
                'nom'   => $fixtureData['venue']['name'],
                'ville' => $fixtureData['venue']['city'] ?? $stade->ville,
            ]);
        }

        // ── Match ─────────────────────────────────────────────────────────────
        $statut = $this->mapStatut($fixtureData['status']['short'] ?? 'NS');

        $matchData = [
            'club_domicile_id'  => $homeClub->id,
            'club_exterieur_id' => $awayClub->id,
            'stade_id'          => $stade->id,
            'date_match'        => $fixtureData['date'],
            'statut'            => $statut,
            'score_domicile'    => $goals['home'] ?? null,
            'score_exterieur'   => $goals['away'] ?? null,
        ];

        $match = FootballMatch::updateOrCreate(
            ['api_football_id' => $fixtureData['id']],
            $matchData
        );

        return [$match->wasRecentlyCreated];
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function mapStatut(string $short): string
    {
        if (in_array($short, ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'])) {
            return 'en_cours';
        }

        if (in_array($short, ['FT', 'AET', 'PEN', 'AWD', 'WO'])) {
            return 'termine';
        }

        return 'a_venir';
    }
}
