const order_column = ['Actuator', 'Turn_On', 'Turn_Off', 'Repeat', 'Option'];

if (typeof window !== 'undefined' && window.document) {
  const fetchScheduleData = () => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('action', 'fetch');
    xhr.open('POST', 'conn.inc.php', true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const { recordsTotal, recordsFiltered, data, draw } = response;
        // your code for handling the fetched data goes here
      }
    };
    xhr.send(formData);
  };
}
