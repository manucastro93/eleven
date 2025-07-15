import { imprimirContenido } from "@/utils/imprimir.utils";

export default function DetallePedidoModal(props: {
    pedido: {
        id: number;
        cliente: string;
        fecha: string;
        estado: string;
        items: { producto: string; cantidad: number }[];
    };
    onClose: () => void;
}) {
    const esPedidoPendiente = props.pedido.estado !== "en_proceso";

    return (
        <>
            <div class="fixed inset-0 bg-black/40 z-40" onClick={props.onClose} />
            <div class="fixed inset-0 z-60 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                    {/* HEADER */}
                    <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                        <h2 class="text-xl font-semibold">Pedido #{props.pedido.id}</h2>
                        <button class="text-gray-500 hover:text-gray-700" onClick={props.onClose}>
                            ✕
                        </button>
                    </div>

                    {/* CONTENIDO A IMPRIMIR */}
                    <div class="p-4 space-y-4" id="contenido-a-imprimir">
                        <p><strong>Cliente:</strong> {props.pedido.cliente}</p>
                        <p><strong>Fecha:</strong> {props.pedido.fecha}</p>
                        <p><strong>Estado:</strong> {props.pedido.estado}</p>

                        <div>
                            <h3 class="text-md font-semibold mb-2">Productos</h3>
                            <table class="w-full text-sm border">
                                <thead>
                                    <tr class="border-b text-left text-gray-500">
                                        <th class="py-1">Producto</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.pedido.items.map((item) => (
                                        <tr class="border-b last:border-none">
                                            <td class="py-1">{item.producto}</td>
                                            <td>{item.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* BOTÓN IMPRIMIR */}
                    {esPedidoPendiente && (
                        <div class="flex justify-end px-4 pb-4 mt-2">
                            <button
                                onClick={() =>
                                    imprimirContenido("contenido-a-imprimir", `Pedido #${props.pedido.id}`, {
                                        nota: "Opción para alguna nota",
                                        pie: `Emitido el ${new Date().toLocaleDateString()}`,
                                    })
                                }
                                class="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                            >
                                Imprimir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
