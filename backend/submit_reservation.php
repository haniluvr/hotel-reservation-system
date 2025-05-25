<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$host = 'localhost';
$dbname = 'hotel_db';
$user = 'root';
$pass = '';

try {
    // Establish database connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Sanitize and retrieve form data
$first_name = $_POST['firstName'];
$last_name = $_POST['lastName'];
$email = $_POST['email'];
$arrival_date = $_POST['arrivalDate'];
$departure_date = $_POST['departureDate'];
$room_type = $_POST['roomType'];
$adults = $_POST['adults'];
$children = $_POST['children'];
$promo_code = isset($_POST['promoCode']) && !empty($_POST['promoCode']) 
    ? $_POST['promoCode'] 
    : null;

// Prepare and execute SQL query
$stmt = $pdo->prepare("
    INSERT INTO reservations (
        first_name, 
        last_name, 
        email, 
        arrival_date, 
        departure_date, 
        room_type, 
        adults, 
        children, 
        promo_code
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

// Bind parameters safely
$stmt->execute([
    $first_name,
    $last_name,
    $email,
    $arrival_date,
    $departure_date,
    $room_type,
    $adults,
    $children,
    $promo_code
]);

// Return success message with reservation ID
echo "Reservation ID: " . $pdo->lastInsertId();
?>