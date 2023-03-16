async function createSchedule(conn, Actuator, Time_On, Time_Off, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) {
    const sql = "INSERT INTO schedule(Actuator, Turn_On, Turn_Off, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await conn.execute(sql, [Actuator, Time_On, Time_Off, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]);
    header("location: ../Scheduler.php");
  }
  
  function checkSchedule(Time_On, Time_Off) {
    return Time_On && Time_Off && Time_On < Time_Off;
  }