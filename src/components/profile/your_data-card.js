import { CollapsableShell } from "../collapsable-shell"
import { UploadSection } from "./file_upload/upload-section"
import { SectionCard } from "../section-card"

export async function YourDataCard({
    etfsLastUploadDate,
    fondosMutuosLastUploadDate,
}) {

    const cargarUploadStatus = (date) => {
        const tieneFecha = Boolean(date)

        return (
            <section className="rounded-3xl border border-border-soft bg-panel-soft p-5 mt-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-md font-semibold text-white">
                            Última actualización:
                        </p>
                        <p className="text-sm text-text-muted">
                            Fecha de subida último documento
                        </p>
                    </div>

                    {tieneFecha ? (
                        <span className="rounded-full bg-green-attention px-3 py-1 text-md font-semibold text-success">
                            {date}
                        </span>
                    ) : (
                        <span className="rounded-full bg-[rgba(245,158,11,0.14)] px-3 py-1 text-md font-semibold text-yellow-400">
                            Aún no se sube documento
                        </span>
                    )}
                </div>
            </section>
        )
    }

    return (
        <CollapsableShell
            title="Carga o actualiza tus datos"
            description="Sube o actualiza los datos de tu portafolio mediante tus Certificados de Transacciones"
        >
            {/* Div de informaciones */}
            <div className="space-y-6 mb-6">
                {/* Sección de Cómo Obtener los certificados */}
                <section className="rounded-3xl border border-[#3b2a5a] bg-panel p-5 shadow-[0_0_0_1px_rgba(109,102,255,0.10)]">
                    <p className="text-xl font-bold">
                        ¿Dónde obtener mis Certificados?
                    </p>

                    <p className="text-md font-bold text-text-muted">
                        Sigue los siguientes pasos:
                    </p>

                    <div className="">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-3">
                            <div className="flex items-start gap-4">
                                <div className="mt-0 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[rgba(16,185,129,0.16)] text-success">
                                    <span className="h-2.5 w-2.5 rounded-full bg-text-muted" />
                                </div>

                                <p className="text-lg font-semibold text-white">
                                    Acceder a Fintual
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-3">
                            <div className="flex items-start gap-4">
                                <div className="mt-3 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[rgba(16,185,129,0.16)] text-success">
                                    <span className="h-2.5 w-2.5 rounded-full bg-text-muted" />
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-white">
                                        {"Ir a Perfil"}
                                    </p>

                                    <p className="mt-0 text-sm text-[#9fd1c0]">
                                        Ve a la esquina superior izquierda y
                                        presiona el ícono de perfil
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-3">
                            <div className="flex items-start gap-4">
                                <div className="mt-3 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[rgba(16,185,129,0.16)] text-success">
                                    <span className="h-2.5 w-2.5 rounded-full bg-text-muted" />
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-white">
                                        {"Ir a Perfil > Certificados"}
                                    </p>

                                    <p className="mt-0 text-sm text-[#9fd1c0]">
                                        Nota: Esto puede requerir que inicies
                                        sesión nuevamente
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-3">
                            <div className="flex items-start gap-4">
                                <div className="mt-3 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[rgba(16,185,129,0.16)] text-success">
                                    <span className="h-2.5 w-2.5 rounded-full bg-text-muted" />
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-white">
                                        {
                                            "Elegir los certificados a obtener"
                                        }
                                    </p>

                                    <p className="mt-0 text-sm text-[#9fd1c0]">
                                        Hay certificados que permiten descarga
                                        inmmediata y otros que se envían vía
                                        correo electrónico
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de Qué Certificados Seleccionar */}
                <section className="rounded-3xl border border-[#3b2a5a] bg-panel p-5 shadow-[0_0_0_1px_rgba(109,102,255,0.10)]">
                    <p className="text-xl font-bold">
                        ¿Qué certificados elegir?
                    </p>

                    <p className="text-md font-bold text-text-muted">
                        Orion Portafolio soporta obtener información de los
                        siguientes certificados:
                    </p>

                    <div className="">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-3">
                            <div className="flex items-start gap-4">
                                <div className="mt-3 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[rgba(16,185,129,0.16)] text-success">
                                    <span className="h-2.5 w-2.5 rounded-full bg-text-muted" />
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-white">
                                        {
                                            "Certificado de Transacciones Acciones y ETFs"
                                        }
                                    </p>

                                    <p className="mt-0 text-sm text-[#9fd1c0]">
                                        En la sección{" "}
                                        <b>
                                            Certificado de transacciones y
                                            eventos de capital en Acciones
                                        </b>{" "}
                                        selecciona <b>Enviar a mi mail</b>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-3">
                            <div className="flex items-start gap-4">
                                <div className="mt-3 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[rgba(16,185,129,0.16)] text-success">
                                    <span className="h-2.5 w-2.5 rounded-full bg-text-muted" />
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-white">
                                        {
                                            "Certificado de Transacciones Fondos Mutuos"
                                        }
                                    </p>

                                    <p className="mt-0 text-sm text-[#9fd1c0]">
                                        En la sección{" "}
                                        <b>
                                            Certificado de transacciones en
                                            Fondos Mutuos
                                        </b>{" "}
                                        selecciona <b>Enviar a mi mail</b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Div de subida de archivos */}
            <div className="space-y-6">
                <SectionCard
                    title="Cargar Certificado de Transacciones Acciones y ETFs (PDF)"
                    description="Sube un archivo PDF con tus transacciones de Acciones y ETFs para importarlas al sistema."
                >
                    <UploadSection finantial_file_type="stocks_etfs"/>

                    {/* {cargarUploadStatus(etfsLastUploadDate)} */}
                </SectionCard>

                <SectionCard
                    title="Cargar Certificado de Transacciones Fondos Mutuos (PDF)"
                    description="Sube un archivo CSV con transacciones para importarlas al sistema."
                >
                    <UploadSection finantial_file_type="mutual_funds"/>

                    {/* {cargarUploadStatus(fondosMutuosLastUploadDate)} */}
                </SectionCard>
            </div>
        </CollapsableShell>
    )
}
