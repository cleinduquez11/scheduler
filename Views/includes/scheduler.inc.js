if (typeof _POST["submit"] !== 'undefined') {
    Actuator = _POST["Actuator"];
    Time_On = _POST["Time_On"];
    Time_Off = _POST["Time_Off"];
    Monday = _POST["Monday"];
    Tuesday = _POST["Tuesday"];
    Wednesday = _POST["Wednesday"];
    Thursday = _POST["Thursday"];
    Friday = _POST["Friday"];
    Saturday = _POST["Saturday"];
    Sunday = _POST["Sunday"];

    const require_once = 'conn.inc.js';
    const include_once = 'functions.inc.js';

    if (checkSchedule(Time_On, Time_Off) == 'false') {
        if (checkInsertSchedule(conn, Actuator, Time_On, Time_Off, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) == 'false') {
            header("location: ../Scheduler.php?error=conflict");
            exit;
        } else {
            createSchedule(conn, Actuator, Time_On, Time_Off, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday);
        }
    } else {
        header("location: ../Scheduler.php?error=mustturnon");
        exit;
    }
}