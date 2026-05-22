<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Неверный метод запроса."));
    exit;
}

$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$serviceType = isset($_POST['serviceType']) ? strip_tags(trim($_POST['serviceType'])) : 'Не указан';
$personalDataConsent = isset($_POST['personalDataConsent']) ? trim($_POST['personalDataConsent']) : '';

if ($name === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Заполните все обязательные поля."));
    exit;
}

if ($personalDataConsent !== '1') {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Необходимо согласиться с обработкой персональных данных."));
    exit;
}

if (!preg_match('/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/', $phone)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Введите корректный номер телефона."));
    exit;
}

$to = 'arkhipov_valera@inbox.ru';
$subject = "Новая заявка на уборку: $serviceType";
$message = "Новая заявка с сайта ООО «КлинМастер»\n\n";
$message .= "Имя: $name\n";
$message .= "Телефон: $phone\n";
$message .= "Тип услуги: $serviceType\n";
$message .= "Согласие на обработку персональных данных: получено\n";
$message .= "Дата заявки: " . date('d.m.Y H:i') . "\n";

$headers = array(
    'From: noreply@klin-master-rostov.ru',
    'Reply-To: noreply@klin-master-rostov.ru',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
);

$mailSuccess = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, implode("\r\n", $headers));

if ($mailSuccess) {
    http_response_code(200);
    echo json_encode(array("success" => true, "message" => "Заявка успешно отправлена."));
} else {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Не удалось отправить заявку. Попробуйте связаться с нами по телефону."));
}
?>
