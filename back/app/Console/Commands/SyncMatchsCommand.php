<?php

namespace App\Console\Commands;

use App\Services\ApiFootballService;
use Illuminate\Console\Command;

class SyncMatchsCommand extends Command
{
    protected $signature = 'matchs:sync
                            {--league=61 : ID de la ligue (61 = Ligue 1)}
                            {--season= : Saison (ex: 2024). Par défaut : saison en cours.}';

    protected $description = 'Synchronise les matchs depuis API-Football vers la base de données';

    public function handle(ApiFootballService $service): int
    {
        $league = (int) $this->option('league');
        $season = (int) ($this->option('season') ?: env('FOOTBALL_API_SEASON') ?: $this->currentSeason());

        $this->info("Synchronisation Ligue {$league} — saison {$season}...");

        try {
            $stats = $service->sync($league, $season);
        } catch (\Exception $e) {
            $this->error("Erreur : {$e->getMessage()}");
            return self::FAILURE;
        }

        $this->info("Créés  : {$stats['created']}");
        $this->info("Mis à jour : {$stats['updated']}");

        if (!empty($stats['errors'])) {
            $this->warn(count($stats['errors']) . " fixture(s) en erreur :");
            foreach ($stats['errors'] as $err) {
                $this->warn("  - {$err}");
            }
        }

        $this->info('Synchronisation terminée.');
        return self::SUCCESS;
    }

    /** Retourne l'année de début de la saison en cours (août → juillet). */
    private function currentSeason(): int
    {
        $now = now();
        return $now->month >= 8 ? $now->year : $now->year - 1;
    }
}
