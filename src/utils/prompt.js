const prompt =
{
    "instruction": "Generar un archivo CSV para la tabla 'generic_schedule' basado en un sistema de 6 ciclos rotativos para 7 empleados.",
    "database_schema": {
        "table_name": "generic_schedule",
        "columns": ["cycle", "date", "hora", "shift_name", "shift_role_id", "company_id"],
        "constraints": {
            "cycle": "Integer (1-6)",
            "date": "Integer (1=Lunes, 7=Domingo)",
            "hora": "Time (HH:mm:ss)",
            "company_id": "Constant (1)"
        }
    },
    "shift_definitions": {
        "morning": { "entry": "08:00:00", "exit": "16:00:00" },
        "afternoon_105_106": { "entry": "13:30:00", "exit": "21:30:00" },
        "afternoon_others": { "entry": "14:15:00", "exit": "22:15:00" }
    },
    "business_rules": {
        "min_rest_hours": 8,
        "special_rotation_rule_105_106": {
            "target_ids": [105, 106],
            "logic": "Lunes(1), Martes(2) y Miércoles(3) usan el turno del Ciclo Anterior. Jueves(4), Viernes(5), Sábado(6) y Domingo(7) usan el turno definido en el Ciclo Actual."
        }
    },
    "employee_cycle_data": [
        {
            "id": 105,
            "config": {
                "1": { "libres": [4, 7], "turno_oficial": "M" },
                "2": { "libres": [5, 6], "turno_oficial": "T" },
                "3": { "libres": [6, 7], "turno_oficial": "M" },
                "4": { "libres": [1, 2], "turno_oficial": "T" },
                "5": { "libres": [2, 7], "turno_oficial": "M" },
                "6": { "libres": [1, 7], "turno_oficial": "T" }
            }
        },
        {
            "id": 106,
            "config": {
                "1": { "libres": [1, 2], "turno_oficial": "T" },
                "2": { "libres": [2, 7], "turno_oficial": "M" },
                "3": { "libres": [3, 4], "turno_oficial": "T" },
                "4": { "libres": [3, 7], "turno_oficial": "M" },
                "5": { "libres": [5, 6], "turno_oficial": "T" },
                "6": { "libres": [6, 7], "turno_oficial": "M" }
            }
        },
        {
            "id": 107,
            "config": {
                "1": { "libres": [2, 7], "turno": "M" },
                "2": { "libres": [3, 4], "turno": "T" },
                "3": { "libres": [4, 5], "turno": "M" },
                "4": { "libres": [2, 6], "turno": "T" },
                "5": { "libres": [6, 7], "turno": "M" },
                "6": { "libres": [1, 2], "turno": "T" }
            }
        },
        {
            "id": 108,
            "config": {
                "1": { "libres": [3, 4], "turno": "T" },
                "2": { "libres": [4, 5], "turno": "M" },
                "3": { "libres": [1, 7], "turno": "T" },
                "4": { "libres": [6, 7], "turno": "M" },
                "5": { "libres": [1, 2], "turno": "T" },
                "6": { "libres": [2, 3], "turno": "M" }
            }
        },
        {
            "id": 109,
            "config": {
                "1": { "libres": [1, 7], "turno": "T" },
                "2": { "libres": [6, 7], "turno": "M" },
                "3": { "libres": [1, 2], "turno": "T" },
                "4": { "libres": [1, 4], "turno": "M" },
                "5": { "libres": [3, 4], "turno": "T" },
                "6": { "libres": [4, 5], "turno": "M" }
            }
        },
        {
            "id": 110,
            "config": {
                "1": { "libres": [5, 6], "turno": "M" },
                "2": { "libres": [1, 2], "turno": "T" },
                "3": { "libres": [2, 3], "turno": "M" },
                "4": { "libres": [4, 5], "turno": "T" },
                "5": { "libres": [6, 7], "turno": "M" },
                "6": { "libres": [1, 7], "turno": "T" }
            }
        },
        {
            "id": 111,
            "config": {
                "1": { "libres": [6, 7], "turno": "T" },
                "2": { "libres": [5, 6], "turno": "M" },
                "3": { "libres": [1, 7], "turno": "T" },
                "4": { "libres": [3, 4], "turno": "M" },
                "5": { "libres": [1, 2], "turno": "T" },
                "6": { "libres": [2, 3], "turno": "M" }
            }
        }
    ]
}