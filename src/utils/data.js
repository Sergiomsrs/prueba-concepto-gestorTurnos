

export const hours = 
[   "10:00-10:15", "10:15-10:30", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45",
    "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", 
    "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", 
    "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", 
    "22:45", "23:00", "23:15", "23:30", "23:45"
]

export const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const employees = ['Ross Geller', 'Marta Geller', 'Chandler Bing'];

export const employess = [
    {
        nombre: 'Ross',
        apellidos: 'Geller',
        email: 'Ross@correo.com',
        fechaAlta: '2021-01-01',
        fechaBaja: '2021-02-01',
        jornada: [
            {
                fechaInicio: '2021-01-01',
                fechaFin: '2021-01-31',
                horas: 18
            }
        ]
    },
    {
        nombre: 'Marta',
        apellidos: 'Geller',
        email: 'Marta@correo.com',
        fechaAlta: '2021-01-01',
        fechaBaja: '2021-02-01',
        jornada: [
            {
                fechaInicio: '2021-01-01',
                fechaFin: '2021-01-31',
                horas: 24
            }
        ]
    },
    {
        nombre: 'Chandler',
        apellidos: 'Bing',
        email: 'Chandler@correo.com',
        fechaAlta: '2021-01-01',
        fechaBaja: '2021-02-01',
        jornada: [
            {
                fechaInicio: '2021-01-01',
                fechaFin: '2021-01-31',
                horas: 36
            }
        ]
    }
]