<?php

return [

    /*
     * Chemins sur lesquels le middleware CORS s'applique.
     */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
     * Origines autorisées — ajouter l'URL du front React si elle diffère.
     * Vite : 5173 | CRA : 3000
     */
    'allowed_origins' => [
        '*'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
