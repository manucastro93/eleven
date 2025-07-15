export function imprimirContenido(
  idHtml: string,
  titulo: string = "Documento",
  opciones?: {
    nota?: string;
    pie?: string;
  }
) {
  const contenido = document.getElementById(idHtml);
  if (!contenido) return;

  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) return;

  const notaHtml = opciones?.nota
    ? `<div style="margin-top: 2rem; font-size: 0.875rem; color: #666;"><em>${opciones.nota}</em></div>`
    : "";

  const pieHtml = opciones?.pie
    ? `<div style="margin-top: 4rem; font-size: 0.875rem; color: #999; text-align: center;">${opciones.pie}</div>`
    : "";

  printWindow.document.write(`
    <html>
      <head>
        <title>${titulo}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            padding: 2rem;
          }
          .encabezado {
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 1px solid #ccc;
            padding-bottom: 1rem;
          }
          .encabezado img {
            height: 50px;
            margin-right: 1rem;
          }
          .encabezado h1 {
            font-size: 1.5rem;
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          th, td {
            border: 1px solid #999;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
          }
        </style>
      </head>
      <body>
        <div class="encabezado">
          <img src="/logo-print.png" alt="Logo Eleven" />
          <h1>${titulo}</h1>
        </div>
        ${contenido.innerHTML}
        ${notaHtml}
        ${pieHtml}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
