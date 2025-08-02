import { Request, Response } from 'express';
import fetch from 'node-fetch';

interface GooglePrediction {
  description: string;
  place_id: string;
}

interface GooglePlaceDetail {
  status: string;
  result?: {
    formatted_address: string;
    address_components: {
      long_name: string;
      types: string[];
    }[];
  };
  error_message?: string;
}

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

export async function obtenerSugerencias(req: Request, res: Response) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.length < 3) {
      return res.status(400).json({ mensaje: 'Parámetro inválido' });
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(q)}&key=${apiKey}&language=es&components=country:ar`;

    const response = await fetch(url);
    const raw = await response.text();

    const data = JSON.parse(raw) as { predictions: GooglePrediction[] };

    res.json({ predictions: data.predictions || [] });
  } catch (error) {
    console.error('❌ Error en obtenerSugerencias:', error);
    res.status(500).json({ mensaje: 'Error al consultar Google Places', detalle: error });
  }
}

export async function obtenerDetalleDireccion(req: Request, res: Response) {
  try {
    const { place_id } = req.query;
    if (!place_id || typeof place_id !== 'string') {
      return res.status(400).json({ mensaje: 'Parámetro place_id inválido' });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}&language=es`;

    const response = await fetch(url);
    const data = (await response.json()) as GooglePlaceDetail;

    if (data.status !== 'OK' || !data.result) {
      console.error('❌ Google API ERROR:', data);
      return res.status(500).json({
        mensaje: 'Error desde Google API',
        status: data.status,
        detalle: data.error_message || 'Respuesta inválida',
      });
    }

    const r = data.result;
    const getComp = (tipo: string) =>
      r.address_components?.find((c) => c.types.includes(tipo))?.long_name || '';
    
    res.json({
      formatted: r.formatted_address,
      components: {
        city: getComp('locality') || getComp('administrative_area_level_2'),
        state: getComp('administrative_area_level_1'),
        postcode: getComp('postal_code'),
        suburb: getComp('sublocality') || '',
        road: getComp('route'),
        house_number: getComp('street_number'),
      },
    });
  } catch (error) {
    console.error('❌ Error en obtenerDetalleDireccion:', error);
    res.status(500).json({ mensaje: 'Error al obtener detalles de la dirección', detalle: error });
  }
}