import { createSignal, Show } from "solid-js";
import EditorEstiloBoton from "./EditorEstiloBoton";
import EditorEstiloTexto from "./EditorEstiloTexto";
import BannerPreview from "./BannerPreview";
import { crearBanner, actualizarBanner } from "@/services/banner.service";

export default function ModalBanner(props: { banner: any; onClose: () => void }) {
    const [tab, setTab] = createSignal<"datos">("datos");
    const [form, setForm] = createSignal<any>({
        ...props.banner,
        textoTop: props.banner?.textoTop ?? 50,
        textoLeft: props.banner?.textoLeft ?? 50,
        botonTop: props.banner?.botonTop ?? 50,
        botonLeft: props.banner?.botonLeft ?? 50,
        backgroundColorTexto: props.banner?.backgroundColorTexto ?? "#ffffff"
    });
    console.log(props.banner.textoTop)
    const [previewImg, setPreviewImg] = createSignal<string>(form().img);

    const onFileChange = (e: Event) => {
        const input = e.currentTarget as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImg(reader.result as string);
            };
            reader.readAsDataURL(file);
            setForm({ ...form(), _newFile: file });
        }
    };

    const guardar = async () => {
        try {
            if (form().id) {
                await actualizarBanner(form().id, form());
            } else {
                await crearBanner(form());
            }

            props.onClose();
        } catch (err) {
            alert("Error al guardar banner");
            console.error(err);
        }
    };



    return (
        <>
            <div class="fixed inset-0 bg-black/50 z-40" onClick={props.onClose} />
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                    {/* HEADER */}
                    <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                        <h3 class="text-xl font-semibold">
                            {form().id ? "Editar Banner" : "Nuevo Banner"}
                        </h3>
                        <button
                            onClick={props.onClose}
                            class="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* TABS */}
                    <div class="flex border-b px-4 sticky top-[56px] bg-white z-10">
                        <button
                            onClick={() => setTab("datos")}
                            class={`py-2 px-4 -mb-px border-b-2 ${tab() === "datos"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            Datos del Banner
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div class="p-6 flex flex-col gap-4">
                        <div>
                            <label class="block mb-1 font-medium">Imagen</label>
                            <input type="file" accept="image/*" onChange={onFileChange} />
                            <Show when={previewImg()}>
                                <img
                                    src={previewImg()}
                                    alt="Preview"
                                    class="mt-2 h-32 object-contain border rounded"
                                />
                            </Show>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium">Texto</label>
                            <input
                                type="text"
                                value={form().texto}
                                onInput={(e) =>
                                    setForm({ ...form(), texto: e.currentTarget.value })
                                }
                                class="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        <EditorEstiloTexto
                            initialValue={form().descripcionEstilo || ""}
                            textoPreview={form().texto || "Texto de ejemplo"}
                            onChange={(nuevoEstilo, top, left, width) =>
                                setForm({
                                    ...form(),
                                    descripcionEstilo: nuevoEstilo,
                                    textoTop: top,
                                    textoLeft: left,
                                    textoWidth: width
                                })
                            }
                        />


                        <div>
                            <label class="block mb-1 font-medium">Texto del Botón</label>
                            <input
                                type="text"
                                value={form().botonTexto || "Botón de ejemplo"}
                                onInput={(e) =>
                                    setForm({ ...form(), botonTexto: e.currentTarget.value })
                                }
                                class="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        <EditorEstiloBoton
                            initialValue={form().botonEstilo || ""}
                            textoBoton={form().botonTexto || "Botón de ejemplo"}
                            onChange={(nuevoEstilo, top, left) =>
                                setForm({
                                    ...form(),
                                    botonEstilo: nuevoEstilo,
                                    botonTop: top,
                                    botonLeft: left
                                })
                            }
                        />

                        <div>
                            <label class="block mb-1 font-medium">Link del Botón</label>
                            <input
                                type="text"
                                value={form().botonLink || ""}
                                onInput={(e) =>
                                    setForm({ ...form(), botonLink: e.currentTarget.value })
                                }
                                class="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        <div>
                            <label class="block mb-1 font-medium">Fecha Desde</label>
                            <input
                                type="date"
                                value={form().fechaDesde || ""}
                                onInput={(e) =>
                                    setForm({ ...form(), fechaDesde: e.currentTarget.value })
                                }
                                class="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        <div>
                            <label class="block mb-1 font-medium">Fecha Hasta</label>
                            <input
                                type="date"
                                value={form().fechaHasta || ""}
                                onInput={(e) =>
                                    setForm({ ...form(), fechaHasta: e.currentTarget.value })
                                }
                                class="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        <div>
                            <label class="block mb-1 font-medium">Activo</label>
                            <select
                                value={form().activo ? "1" : "0"}
                                onInput={(e) =>
                                    setForm({ ...form(), activo: e.currentTarget.value === "1" })
                                }
                                class="border border-gray-300 rounded px-3 py-2 w-full"
                            >
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>

                        {/* PREVIEW */}
                        <BannerPreview
                            img={previewImg() || "/img/no-image.png"}
                            texto={form().texto || ""}
                            descripcionEstilo={form().descripcionEstilo || ""}
                            textoTop={form().textoTop || 50}
                            textoLeft={form().textoLeft || 50}
                            textoWidth={form().textoWidth || 50}
                            backgroundColorTexto={form().backgroundColorTexto}
                            botonTexto={form().botonTexto || "Botón de prueba"}
                            botonEstilo={form().botonEstilo || ""}
                            botonTop={form().botonTop || 50}
                            botonLeft={form().botonLeft || 50}
                        />

                    </div>

                    {/* FOOTER */}
                    <div class="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white z-10">
                        <button class="btn" onClick={guardar}>
                            Guardar
                        </button>
                        <button class="btn btn-secondary" onClick={props.onClose}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
