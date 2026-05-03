<?php
/**
 * Обработчик заявок с сайта
 * Имитирует отправку на почту
 */

header('Content-Type: application/json');

// В реальном проекте необходимо настраивать CORS
header("Access-Control-Allow-Origin: *");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Получение и очистка данных
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $serviceType = isset($_POST['serviceType']) ? strip_tags(trim($_POST['serviceType'])) : 'Не указан';
    
    // Простейшая серверная валидация
    if (empty($name) OR empty($phone)) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Заполните все обязательные поля."));
        exit;
    }

    // Параметры для email
    $to = 'arkhipov_valera@inbox.ru'; // Замените на реальный email менеджера
    $subject = "Новая заявка на уборку: $serviceType";
    $email_content = "Имя: $name\n";
    $email_content .= "Телефон: $phone\n\n";
    $email_content .= "Тип услуги: $serviceType\n";
    
    $email_headers = "From: noreply@klinmaster.ru";

    // Попытка отправки email (в локальной среде без настроенного сервера mail() вернет false)
    // Но для тестирования мы можем симулировать успех
    $mail_success = @mail($to, $subject, $email_content, $email_headers);
    
    // Так как это локальная дипломная работа без SMTP-сервера, мы захардкодим success
    $isLocalDevelopment = true; 
    
    if ($mail_success || $isLocalDevelopment) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Заявка успешно отправлена."));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Внутренняя ошибка сервера при отправке письма."));
    }
} else {
    // Не POST запрос
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Неверный метод запроса."));
}
?>
