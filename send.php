<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

function clean(string $key): string {
    $value = trim((string)($_POST[$key] ?? ''));
    return str_replace(["\r", "\0"], '', $value);
}

$type = clean('formulaire');
$name = clean('nom');
$email = filter_var(clean('email'), FILTER_VALIDATE_EMAIL);

if (!in_array($type, ['contact', 'candidature'], true) || $name === '' || !$email) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Informations obligatoires manquantes.']);
    exit;
}

$fields = $type === 'candidature'
    ? ['nom', 'metier', 'ville', 'site', 'email', 'telephone', 'savoirFaire', 'motivation', 'consentementDonnees', 'participation']
    : ['nom', 'email', 'objet', 'message', 'consentement'];
$required = $type === 'candidature'
    ? ['nom', 'metier', 'ville', 'email', 'telephone', 'savoirFaire', 'motivation', 'consentementDonnees', 'participation']
    : ['nom', 'email', 'objet', 'message', 'consentement'];

foreach ($required as $field) {
    if (clean($field) === '') {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs obligatoires.']);
        exit;
    }
}

$labels = [
    'nom' => 'Nom', 'metier' => 'Métier', 'ville' => 'Ville', 'site' => 'Instagram / site web',
    'email' => 'E-mail', 'telephone' => 'Téléphone', 'savoirFaire' => 'Description du savoir-faire',
    'motivation' => 'Pourquoi ce métier mérite d’être transmis ?', 'consentementDonnees' => 'Consentement données',
    'participation' => 'Participation', 'objet' => 'Objet', 'message' => 'Message', 'consentement' => 'Consentement'
];

$lines = [];
foreach ($fields as $field) {
    $value = clean($field);
    if ($value !== '') $lines[] = ($labels[$field] ?? $field) . " :\n" . $value;
}

$subject = ($type === 'candidature' ? 'Nouvelle candidature Mains & Outils - ' : 'Nouveau message Mains & Outils - ') . $name;
$headers = [
    'From: Mains & Outils <contact@mainsetoutils.com>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit'
];

$sent = mail('contact@mainsetoutils.com', $subject, implode("\n\n", $lines), implode("\r\n", $headers));
if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Le serveur n’a pas pu transmettre le message.']);
    exit;
}

echo json_encode(['success' => true]);
