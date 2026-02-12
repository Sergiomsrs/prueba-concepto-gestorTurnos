import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const ConfirmButton = ({
    triggerText,
    title,
    description,
    onConfirm,
    variant = "default", // Puedes pasarle 'destructive', 'outline', etc.
    className = ""
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant} className={className}>
                    {triggerText}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title || "¿Estás seguro?"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description || "Esta acción no se puede deshacer."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex items-center gap-2"> {/* Agregamos items-center */}
                    <AlertDialogCancel className="h-10 mt-0"> {/* Forzamos altura y quitamos margen superior si lo hay */}
                        Cancelar
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onConfirm}
                        // Usamos h-10 para que coincida exactamente con el botón de cancelar
                        className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white mt-0"
                    >
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmButton


/**
 * GUÍA DE USO - ConfirmButton
 * * @param {string} triggerText - El texto que aparece en el botón principal.
 * @param {string} title - Título del modal (Ej: "¿Estás seguro?").
 * @param {string} description - Texto de apoyo debajo del título.
 * @param {function} onConfirm - Función que se ejecuta al darle a "Continuar".
 * @param {string} variant - Estilo de shadcn para el botón:
 * - "default": El color primario (generalmente negro o azul).
 * - "destructive": Rojo (ideal para borrar/eliminar).
 * - "outline": Solo borde, fondo transparente.
 * - "secondary": Color gris suave.
 * - "ghost": Sin fondo ni borde (solo texto).
 * - "link": Estilo de hipervínculo.
 * @param {string} className - Clases de Tailwind adicionales (Ej: "w-full", "h-12", "bg-emerald-600").
 */