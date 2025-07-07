export function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // saca tildes
      .replace(/[^a-z0-9\s]/g, '')                      // saca símbolos
      .replace(/\s+/g, '-');                            // reemplaza espacios por -
  }
  